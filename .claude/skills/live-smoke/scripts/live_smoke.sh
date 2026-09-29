#!/usr/bin/env bash
# live_smoke.sh [--refresh] — contract-check /api/live/<site> on the running dev server
set -uo pipefail
base="${BASE_URL:-http://localhost:3000}"
q=""; [[ "${1:-}" == "--refresh" ]] && q="?refresh=1"
out="docs/qa/gates"; mkdir -p "$out"
has_key=0; grep -qE '^ANTHROPIC_API_KEY=.+' .env.local 2>/dev/null && has_key=1

node - "$base" "$q" "$out" "$has_key" <<'EOF'
const [base, q, out, hasKey] = process.argv.slice(2);
const fs = require('fs');
const assertions = []; const line = [];
const ok = (name, pass, detail = '') => { assertions.push({ name, pass: !!pass, detail: String(detail) }); return !!pass; };

(async () => {
  for (const site of ['riyadh', 'dhahran']) {
    let res, body;
    try { res = await fetch(`${base}/api/live/${site}${q}`); body = await res.json(); }
    catch (e) { ok(`${site}: reachable`, false, e.message); line.push(`${site}=unreachable`); continue; }
    ok(`${site}: HTTP 200`, res.status === 200, res.status);
    if (res.status !== 200) { line.push(`${site}=${res.status}`); continue; }
    const p = body.payload ?? {}; const d = body.diagnosis ?? {};
    let all = true;
    all &= ok(`${site}: payload groups`, ['climate', 'operational', 'context', 'twin'].every(k => k in p));
    all &= ok(`${site}: climate from open-meteo`, p.climate?.source === 'open-meteo', p.climate?.source);
    all &= ok(`${site}: operational simulated`, p.operational?.source === 'simulated', p.operational?.source);
    all &= ok(`${site}: confidence 0-100`, d.confidence >= 0 && d.confidence <= 100, d.confidence);
    all &= ok(`${site}: healthScore 0-100`, d.healthScore >= 0 && d.healthScore <= 100, d.healthScore);
    all &= ok(`${site}: A6 threshold`, !d.isFault || d.confidence >= 85 || d.status === 'critical', `isFault=${d.isFault} conf=${d.confidence} status=${d.status}`);
    all &= ok(`${site}: evidence 2-5`, Array.isArray(d.evidence) && d.evidence.length >= 2 && d.evidence.length <= 5, d.evidence?.length);
    all &= ok(`${site}: chart points`, Array.isArray(body.chart) && body.chart.length >= 6, body.chart?.length);
    all &= ok(`${site}: source allowed`, body.source === 'ai' || (body.source === 'rules' && hasKey === '0'), `${body.source} ${body.fallbackReason ?? ''}`);
    line.push(`${site}=${body.source}(${all ? 'pass' : 'FAIL'})${body.stale ? '[stale]' : ''}`);
  }
  const bad = await fetch(`${base}/api/live/london`).then(r => r.status).catch(() => 0);
  ok('unknown site 404', bad === 404, bad);
  const pass = assertions.every(a => a.pass);
  fs.writeFileSync(`${out}/live-smoke.json`, JSON.stringify({ gate: 'live-smoke', pass, ran_at: new Date().toISOString(), command: `GET ${base}/api/live/*${q}`, assertions }, null, 2));
  console.log(`live-smoke: ${line.join(' ')} → ${pass ? 'pass' : 'FAIL'}`);
  process.exit(pass ? 0 : 1);
})();
EOF
