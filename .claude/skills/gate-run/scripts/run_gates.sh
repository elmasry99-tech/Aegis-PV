#!/usr/bin/env bash
# run_gates.sh [--fast] — lint, typecheck, (build) → docs/qa/gates/<gate>.json
set -uo pipefail
out="docs/qa/gates"; mkdir -p "$out"
fast="${1:-}"
summary=""; failed=0

run_gate() {
  local gate="$1"; shift
  local log; log="$(mktemp)"
  "$@" >"$log" 2>&1; local code=$?
  node -e '
    const [gate, code, cmd, logPath, out] = process.argv.slice(1);
    const fs = require("fs");
    const log = fs.readFileSync(logPath, "utf8").split(/\r?\n/);
    const pass = code === "0";
    const report = { gate, pass, ran_at: new Date().toISOString(), command: cmd,
      assertions: [{ name: `${gate} exits 0`, pass, detail: `exit ${code}` }] };
    if (!pass) report.log_tail = log.slice(-40).join("\n");
    fs.writeFileSync(`${out}/${gate}.json`, JSON.stringify(report, null, 2));
  ' "$gate" "$code" "$*" "$log" "$out"
  rm -f "$log"
  if [[ $code -eq 0 ]]; then summary+="$gate=pass "; else summary+="$gate=FAIL "; failed=1; fi
  echo "$out/$gate.json"
}

run_gate lint npx eslint src
npx next typegen >/dev/null 2>&1 # RouteContext/PageProps are generated per route (Next 16)
run_gate typecheck npx tsc --noEmit
if [[ "$fast" != "--fast" ]]; then run_gate build npx next build; fi

echo "gates: ${summary}"
exit $failed
