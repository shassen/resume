#!/usr/bin/env bash
#
# Regenerates the resume PDF from the master print-resume HTML file (outside
# this repo) and copies the result in, overwriting the PDF that the site's
# "Download PDF" button and nav "Résumé ↓" link use.
#
# The output filename is dated with the current month and year, e.g. running
# this in October 2026 produces "shawn-hassen-resume-october-2026.pdf". Any
# previously dated PDF (in the master location and in this repo) is removed,
# and every "shawn-hassen-resume-<month>-<year>.pdf" reference in index.html
# is rewritten to match, so there's always exactly one correctly named/linked
# resume PDF.
#
# Usage:
#   ./scripts/regenerate-resume-pdf.sh
#
# Requires Node.js (for npx). Uses Playwright's headless-Chromium "print to
# PDF" via its CLI (`npx playwright pdf`) rather than a repo dependency, so
# nothing gets added to this static site's shipped code. Playwright/Chromium
# will be downloaded to npx's cache on first run if not already present.

set -euo pipefail

MASTER_DIR="/Users/shawn/Documents/shawn-hassen-resume"
MASTER_HTML="$MASTER_DIR/resume.html"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -f "$MASTER_HTML" ]; then
  echo "Error: master resume HTML not found at $MASTER_HTML" >&2
  exit 1
fi

MONTH="$(date +%B | tr '[:upper:]' '[:lower:]')"
YEAR="$(date +%Y)"
FILENAME="shawn-hassen-resume-${MONTH}-${YEAR}.pdf"

MASTER_PDF="$MASTER_DIR/$FILENAME"
REPO_PDF="$REPO_ROOT/$FILENAME"

echo "Rendering PDF from $MASTER_HTML ..."
npx --yes playwright@1 pdf --paper-format Letter "file://$MASTER_HTML" "$MASTER_PDF"

# Remove any previously dated PDF(s) so we don't accumulate stale copies.
find "$MASTER_DIR" -maxdepth 1 -type f -name 'shawn-hassen-resume-*.pdf' ! -name "$FILENAME" -delete
find "$REPO_ROOT" -maxdepth 1 -type f -name 'shawn-hassen-resume-*.pdf' ! -name "$FILENAME" -delete

echo "Copying into repo: $REPO_PDF"
cp "$MASTER_PDF" "$REPO_PDF"

# Point every existing dated-filename reference at the new file.
sed -i '' -E "s/shawn-hassen-resume-[a-z]+-[0-9]{4}\.pdf/${FILENAME}/g" "$REPO_ROOT/index.html"

# Lightweight page-count check (no extra deps): count PDF page objects.
# Freshly written files aren't Spotlight-indexed yet, so `mdls` isn't
# reliable here - this regex approach works immediately and needs nothing
# beyond the Python 3 that ships with macOS.
PAGE_COUNT="$(python3 -c "
import re
data = open('$REPO_PDF', 'rb').read()
print(len(re.findall(rb'/Type\s*/Page(?!s)', data)))
")"

echo "Done. Generated $FILENAME - page count: $PAGE_COUNT (expected: 2)"
echo "Updated index.html references. Review with: git -C \"$REPO_ROOT\" diff"
