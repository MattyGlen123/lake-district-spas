#!/bin/bash
# Claude Code stop hook
# Runs after Claude finishes each task.
# - If files have changed: runs TypeScript typecheck
# - If typecheck fails: exits with code 2 (Claude Code feeds output back to Claude)
# - If typecheck passes: prints confirmation and exits cleanly
# - AUTO-COMMIT: uncomment the block below to enable (see note)

# Check if there are any uncommitted changes (staged or unstaged)
if git diff --quiet && git diff --cached --quiet; then
  # No changes — nothing to check
  exit 0
fi

echo "Files changed — running TypeScript check..."
OUTPUT=$(npm run typecheck 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "TypeScript errors found. Please fix before finishing:"
  echo ""
  echo "$OUTPUT"
  exit 2  # Exit code 2 = Claude Code feeds this output back to Claude as a message
fi

echo "TypeScript check passed."

# --- OPTIONAL AUTO-COMMIT (disabled by default) ---
# Uncomment to enable auto-commit on clean typecheck.
# Note: Husky pre-commit hook will also run typecheck + test on commit.
# This is safe but means typecheck runs twice. Tests only run on commit, not here.
#
# git add -A
# git commit -m "Auto-commit: Claude task complete, typecheck passed
#
# Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
# --------------------------------------------------

exit 0
