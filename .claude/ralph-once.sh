#!/usr/bin/env bash
# ralph-once.sh — run one Ralph iteration for a feature (human-in-the-loop)
#
# Usage:   bash .claude/ralph-once.sh <feature-slug>
# Example: bash .claude/ralph-once.sh same-tab-outbound-navigation
#   or:    npm run ralph same-tab-outbound-navigation
#
# Runs interactively — you see Claude's tool calls (explore, bash, edits) in
# real-time. acceptEdits auto-approves file writes; bash commands prompt you.
# Ctrl-C at any point to abort.

set -euo pipefail

FEATURE="${1:-}"
if [[ -z "$FEATURE" ]]; then
  echo "Usage: bash .claude/ralph-once.sh <feature-slug>"
  echo ""
  echo "Available features:"
  ls .scratch/ 2>/dev/null | sed 's/^/  /' || echo "  (none)"
  exit 1
fi

SCRATCH=".scratch/$FEATURE"
ISSUES_DIR="$SCRATCH/issues"
PRD_FILE="$SCRATCH/PRD.md"
PROGRESS_FILE="$SCRATCH/progress.txt"

if [[ ! -d "$SCRATCH" ]]; then
  echo "Error: $SCRATCH not found"
  echo ""
  echo "Available features:"
  ls .scratch/ 2>/dev/null | sed 's/^/  /' || echo "  (none)"
  exit 1
fi

# Create progress file if it doesn't exist so @reference always resolves
touch "$PROGRESS_FILE"

# Build @file references — PRD, all issue files, progress log
FILE_REFS=""
[[ -f "$PRD_FILE" ]] && FILE_REFS+="@$PRD_FILE "
for f in "$ISSUES_DIR"/*.md; do
  [[ -f "$f" ]] || continue
  FILE_REFS+="@$f "
done
FILE_REFS+="@$PROGRESS_FILE"

RECENT=$(git log --oneline -5 2>/dev/null || echo "(no commits yet)")

claude --permission-mode acceptEdits "$FILE_REFS

Recent commits:
$RECENT

## Your task

### Step 1 — Pick the next issue
Find the highest-priority issue with Status: ready-for-agent.
Respect blocking relationships (check 'Blocked by' in each issue).
Priority: unblocked issues first, then lowest number.
If all issues are Status: completed, output the exact text NO_MORE_TASKS and stop.

### Step 2 — Implement with strict TDD (red-green-refactor)
For every piece of behaviour the issue specifies:
1. Write exactly one failing test — do NOT write any implementation yet
2. Run: npm test
3. Confirm the test fails for the right reason (not a compilation error)
4. Write the minimum implementation to make it pass
5. Run: npm test
6. Confirm the test passes
7. Repeat for the next behaviour

For pure refactors where no behaviour changes: run npm test first to confirm
the baseline, make the change, run npm test again to confirm nothing broke.

Never write implementation code before the corresponding test exists and is
confirmed failing. Never write multiple tests at once before implementing.

### Step 3 — Run feedback loops
When the issue is fully implemented:
- Run: npm run typecheck
- Run: npm test

Both must pass. Fix any failures before continuing.

### Step 4 — Update the issue file
In the issue file, change the Status line to: Status: completed
Check off any acceptance criteria that are now passing.

### Step 5 — Update the progress log
Append to $PROGRESS_FILE:
- Issue completed
- Summary of changes made
- Any gotchas or notes for the next run

### Step 6 — Commit
Stage and commit all changes: implementation files, test files, updated issue
file, progress.txt.
Commit message format: [ralph] $FEATURE/<issue-filename>: <brief description>

### Step 7 — Report and stop
Output a summary: what was done, what files changed.
List any remaining ready-for-agent issues.
If no ready-for-agent issues remain, output NO_MORE_TASKS on its own line.
"
