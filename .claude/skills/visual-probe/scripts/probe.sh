#!/usr/bin/env bash
# probe.sh <route> [label] — headless screenshots at 5 widths × light/dark
set -euo pipefail
route="${1:?route, e.g. /dashboard}"; label="${2:-$(echo "$route" | tr -c 'a-zA-Z0-9' '-' | sed 's/-*$//')}"
base="${BASE_URL:-http://localhost:3000}"; budget="${BUDGET_MS:-9000}"
out="docs/qa/visual/${label}"; mkdir -p "$out"; : > "$out/manifest.txt"

chrome=""
for c in "/c/Program Files/Google/Chrome/Application/chrome.exe" \
         "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
         "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
         "$(command -v google-chrome 2>/dev/null || true)" "$(command -v chromium 2>/dev/null || true)"; do
  [[ -n "$c" && -x "$c" ]] && { chrome="$c"; break; }
done
[[ -z "$chrome" ]] && { echo "no Chrome/Edge found" >&2; exit 2; }

sep='?'; [[ "$route" == *\?* ]] && sep='&'
for theme in light dark; do
  for w in 1600 1440 1280 768 480; do
    h=$(( w <= 768 ? 1800 : 1100 ))
    png="$out/${w}-${theme}.png"
    profile="$(mktemp -d)"
    # Windows Chrome needs a Windows path for --screenshot
    target="$(cd "$out" && pwd -W 2>/dev/null || pwd)/${w}-${theme}.png"
    "$chrome" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
      --user-data-dir="$(cd "$profile" && pwd -W 2>/dev/null || echo "$profile")" \
      --window-size="${w},${h}" --virtual-time-budget="$budget" \
      --screenshot="$target" "${base}${route}${sep}theme=${theme}" >/dev/null 2>&1 || true
    rm -rf "$profile"
    if [[ -s "$png" ]]; then echo "$png" >> "$out/manifest.txt"; else echo "MISSING $png" >&2; fi
  done
done
echo "$out/manifest.txt ($(wc -l < "$out/manifest.txt") images)"
