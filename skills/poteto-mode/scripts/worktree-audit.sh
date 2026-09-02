#!/usr/bin/env bash
# Read-only worktree prune audit. Classifies every git worktree by size, merge
# state, uncommitted work, remote/PR state, and an explicitly exported Kiro
# transcript directory when supplied. Never deletes anything.
#
# Usage: KIRO_TRANSCRIPTS_DIR=/path/to/export worktree-audit.sh [repo-path]
set -u

repo="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -z "$repo" ] && { echo "not in a git repo; pass a repo path" >&2; exit 1; }
cd "$repo" || exit 1

main_wt=$(git worktree list --porcelain | awk '/^worktree /{print $2; exit}')
default_ref=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null || true)
if [ -z "$default_ref" ]; then
  for candidate in origin/main origin/master; do
    if git show-ref --verify --quiet "refs/remotes/$candidate"; then
      default_ref="$candidate"
      break
    fi
  done
fi
if [ -n "$default_ref" ]; then
  default_branch=${default_ref#origin/}
  git fetch origin "$default_branch" --quiet 2>/dev/null || echo "warn: could not fetch $default_ref; merged column may be stale" >&2
else
  echo "warn: could not determine origin's default branch; merged column is unknown" >&2
fi

command -v jq >/dev/null 2>&1 || { echo "jq is required" >&2; exit 1; }
if [ -n "${KIRO_TRANSCRIPTS_DIR:-}" ]; then
  command -v rg >/dev/null 2>&1 || { echo "rg is required when KIRO_TRANSCRIPTS_DIR is set" >&2; exit 1; }
fi

prs=$(mktemp)
trap 'rm -f "$prs"' EXIT
gh pr list --author "@me" --state all --limit 1000 \
  --json number,state,headRefName 2>/dev/null > "$prs" || echo "[]" > "$prs"

transcripts="${KIRO_TRANSCRIPTS_DIR:-}"
if [ -n "$transcripts" ] && [ ! -d "$transcripts" ]; then
  echo "KIRO_TRANSCRIPTS_DIR is not a directory: $transcripts" >&2
  exit 1
fi
now=$(date +%s)

mtime_and_path() {
  stat -c '%Y %n' "$1" 2>/dev/null || stat -f '%m %N' "$1" 2>/dev/null
}

format_day() {
  date -d "@$1" '+%Y-%m-%d' 2>/dev/null || date -r "$1" '+%Y-%m-%d' 2>/dev/null || echo "?"
}

printf "SIZE\tAGE\tMERGED\tDIRTY\tREMOTE\tPR\tLAST_CHAT\tBUCKET\tWORKTREE\n"

git worktree list --porcelain | awk '/^worktree /{print $2}' | while read -r wt; do
  [ "$wt" = "$main_wt" ] && continue

  size=$(du -sh "$wt" 2>/dev/null | awk '{print $1}')
  head=$(git -C "$wt" rev-parse HEAD 2>/dev/null)
  head_ts=$(git -C "$wt" log -1 --format='%ct' HEAD 2>/dev/null || echo 0)
  age=$([ "$head_ts" -gt 0 ] 2>/dev/null && echo "$(( (now - head_ts) / 86400 ))d" || echo "?")

  if [ -n "$default_ref" ]; then
    git merge-base --is-ancestor "$head" "$default_ref" 2>/dev/null && merged=YES || merged=no
  else
    merged=unknown
  fi

  porcelain=$(git -C "$wt" status --porcelain 2>/dev/null)
  if [ -z "$porcelain" ]; then
    dirty=clean
  elif printf '%s\n' "$porcelain" | grep -qv '^??'; then
    dirty="wip:$(printf '%s\n' "$porcelain" | grep -cv '^??')"
  else
    dirty="scratch:$(printf '%s\n' "$porcelain" | grep -c '^??')"
  fi

  branch=$(git -C "$wt" symbolic-ref --quiet --short HEAD 2>/dev/null || echo "")
  if [ -z "$branch" ]; then
    remote=detached
  elif git -C "$wt" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
    if [ "$(git -C "$wt" rev-parse "origin/$branch" 2>/dev/null)" = "$head" ]; then
      remote=pushed
    else
      remote="ahead$(git -C "$wt" rev-list --count "origin/$branch..HEAD" 2>/dev/null)"
    fi
  else
    remote=no-remote
  fi

  pr=$([ -n "$branch" ] && jq -r --arg b "$branch" \
    '.[] | select(.headRefName==$b) | "#\(.number)/\(.state)"' "$prs" 2>/dev/null | head -1)
  [ -z "$pr" ] && pr="-"

  last="unknown"
  last_ts=0
  transcript_evidence=unknown
  if [ -n "$transcripts" ]; then
    transcript_evidence=known
    last="-"
    while IFS= read -r file; do
      candidate=$(mtime_and_path "$file")
      candidate_ts=${candidate%% *}
      if [ "${candidate_ts:-0}" -gt "$last_ts" ] 2>/dev/null; then
        last_ts=$candidate_ts
      fi
    done < <(rg -l -F -e "${wt}/" -e "${wt}\"" "$transcripts" 2>/dev/null)
    [ "$last_ts" -gt 0 ] 2>/dev/null && last=$(format_day "$last_ts")
  fi
  recent=$([ "$last_ts" -gt 0 ] 2>/dev/null && [ $(( (now - last_ts) / 86400 )) -le 4 ] && echo yes || echo no)

  case "$dirty" in
    wip:*) bucket=hold-wip ;;
    *) case "$pr" in
      *OPEN*) bucket=hold-open-pr ;;
      *) if [ "$transcript_evidence" = unknown ]; then bucket=review-transcript-unknown
         elif [ "$recent" = yes ]; then bucket=verify-recent-chat
         elif [ "$merged" = YES ] || [ "$pr" != "-" ]; then bucket=safe
         else bucket=review
         fi ;;
    esac ;;
  esac

  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
    "$size" "$age" "$merged" "$dirty" "$remote" "$pr" "$last" "$bucket" "$wt"
done
