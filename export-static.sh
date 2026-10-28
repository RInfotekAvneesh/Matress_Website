#!/usr/bin/env bash
# Runs the published app and saves every page as static HTML into ./_site.
# Usage: ./export-static.sh <publish-dir> [path-base]   e.g. ./export-static.sh publish /Matress_Website
#        Pass "" as the path base when the site is served from a domain root.
set -euo pipefail

PUBLISH_DIR="$1"
BASE="${2:-}"
BASE="${BASE%/}"
PORT=5055
OUT="_site"
PAGES=(Home/Collection Home/About Home/Services Home/Faq Home/Contact Home/Privacy Home/Terms)

rm -rf "$OUT"
mkdir -p "$OUT"
cp -r "$PUBLISH_DIR/wwwroot/." "$OUT/"

(cd "$PUBLISH_DIR" && PathBase="$BASE" ASPNETCORE_URLS="http://localhost:$PORT" dotnet Matress_Website.dll) &
APP_PID=$!
trap 'kill $APP_PID 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do
  curl -fs "http://localhost:$PORT$BASE/" -o /dev/null && break
  sleep 1
done

curl -fsS "http://localhost:$PORT$BASE/" -o "$OUT/index.html"
for page in "${PAGES[@]}"; do
  mkdir -p "$OUT/$page"
  curl -fsS "http://localhost:$PORT$BASE/$page" -o "$OUT/$page/index.html"
done
cp "$OUT/index.html" "$OUT/404.html"
touch "$OUT/.nojekyll"

echo "Exported $(( ${#PAGES[@]} + 1 )) pages to $OUT"
