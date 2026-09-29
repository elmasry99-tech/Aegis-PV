'use client';

import Link from 'next/link';
import { ArrowLeft, CloudSun, Cpu, Gauge, HardDrive, Home, RefreshCw, Sparkles, ShieldCheck, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLiveAnalysis, useRefreshLive } from '@/features/live/hooks/useLiveAnalysis';
import type { LiveAnalysis, SiteId } from '@/lib/live/types';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useSpotlight } from '@/shared/hooks/useSpotlight';
import { cn } from '@/shared/utils/cn';
import styles from './evidence.module.css';

const timeFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' });

export function EvidenceView({ site }: { site: SiteId }) {
  const { data, error, isPending } = useLiveAnalysis(site);
  const refresh = useRefreshLive(site);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href={`/dashboard?mode=live&site=${site}`} className={styles.back}>
          <ArrowLeft size={16} /> Back to live dashboard
        </Link>
        <div className={styles.topActions}>
          <button type="button" className={styles.button} onClick={() => refresh.mutate()} disabled={refresh.isPending}>
            <RefreshCw size={14} className={cn(refresh.isPending && styles.spin)} /> {refresh.isPending ? 'Analysing' : 'Re-run analysis'}
          </button>
          <ThemeToggle />
        </div>
      </div>

      <header className={styles.header}>
        <span className={styles.eyebrow}>Evidence panel</span>
        <h1 className={styles.title}>
          What the AI <span className="text-gradient">saw</span>
        </h1>
        <p className={styles.lead}>
          The exact payload sent for this site, grouped as in the Aegis-PV report’s data-ingestion layer: climate, operational and
          context data, plus the digital-twin baseline.
        </p>
      </header>

      {error && !data && <div className={cn('glass', styles.card, styles.error)} role="alert">{error.message}</div>}
      {isPending && !data && <div className={styles.skeleton} aria-busy="true" />}
      {data && <EvidenceBody a={data} />}
    </div>
  );
}

function EvidenceBody({ a }: { a: LiveAnalysis }) {
  const { climate, operational, context, twin } = a.payload;
  const d = a.diagnosis;

  return (
    <div className={styles.stack}>
      <Card delay={0}>
        <div className={styles.runMeta}>
          <Meta label="Site" value={`${a.site.name} · ${a.site.city}`} />
          <Meta label="Coordinates" value={`${a.site.lat.toFixed(3)}°N, ${a.site.lon.toFixed(3)}°E`} />
          <Meta label="Generated" value={`${timeFmt.format(new Date(a.generatedAt))} (KSA)`} />
          <Meta
            label="Diagnosed by"
            value={
              a.source === 'ai' ? (
                <span className={cn(styles.badge, styles.badgeAi)}><Sparkles size={12} /> {a.model}</span>
              ) : (
                <span className={cn(styles.badge, styles.badgeRules)}><ShieldCheck size={12} /> Rules engine</span>
              )
            }
          />
        </div>
        {(a.fallbackReason || a.stale) && (
          <p className={styles.note}>
            <TriangleAlert size={14} /> {a.stale ? 'Stale result — weather unavailable. ' : 'AI unavailable — '}
            {a.fallbackReason}
          </p>
        )}
      </Card>

      <Card delay={0.05} title="Diagnosis and confidence" icon={<Cpu size={18} />}>
        <div className={styles.diagRow}>
          <div>
            <h2 className={styles.diagTitle}>{d.title}</h2>
            <p className={styles.muted}>{d.summary}</p>
            <p className={styles.action}><strong>Next step:</strong> {d.action}</p>
          </div>
          <div className={styles.bars}>
            <Bar label="Overall confidence" value={d.confidence} strong />
            <Bar label="Model probability" value={d.confidenceBreakdown.modelProbability} />
            <Bar label="Data quality" value={d.confidenceBreakdown.dataQuality} />
            <Bar label="Event duration" value={d.confidenceBreakdown.eventDuration} />
            <p className={styles.small}>Alerts are issued only at ≥ 85% confidence (report §Alert design).</p>
          </div>
        </div>
        <h3 className={styles.subhead}>Evidence behind the decision</h3>
        <ul className={styles.list}>{d.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
      </Card>

      <Card delay={0.1} title="Climate data" icon={<CloudSun size={18} />} tag="Open-Meteo · live">
        <KeyValues
          rows={[
            ['Local time', climate.current.time.replace('T', ' ')],
            ['Global horizontal irradiance (GHI)', `${climate.current.ghi} W/m²`],
            ['Plane-of-array irradiance (GTI)', `${climate.current.gti} W/m²`],
            ['Direct normal (DNI) / diffuse (DHI)', `${climate.current.dni} / ${climate.current.dhi} W/m²`],
            ['Ambient temperature', `${climate.current.ambientTempC} °C`],
            ['Humidity', `${climate.current.humidityPct} %`],
            ['Wind / cloud cover', `${climate.current.windKmh} km/h · ${climate.current.cloudCoverPct} %`],
          ]}
        />
        <HourlyTable
          head={['Hour', 'GHI', 'GTI', 'Temp °C', 'RH %']}
          rows={climate.hourly.filter((p) => p.ghi > 0).map((p) => [p.time.slice(11, 16), p.ghi, p.gti, p.ambientTempC, p.humidityPct])}
        />
      </Card>

      <Card delay={0.15} title="Operational data" icon={<HardDrive size={18} />} tag="Simulated inverter" tagWarn>
        <p className={styles.note}><TriangleAlert size={14} /> {operational.note}</p>
        <KeyValues
          rows={[
            ['DC voltage', `${operational.current.dcVoltageV} V`],
            ['String current', operational.current.stringCurrentA.map((c, i) => `S${i + 1} ${c} A`).join(' · ')],
            ['DC power / AC power', `${operational.current.dcPowerKw} / ${operational.current.acPowerKw} kW`],
            ['AC voltage', `${operational.current.acVoltageV} V`],
            ['Energy today', `${operational.current.energyTodayKwh} kWh`],
          ]}
        />
        <HourlyTable
          head={['Hour', 'DC V', 'DC kW', 'AC kW']}
          rows={operational.hourly.filter((p) => p.acPowerKw > 0).map((p) => [p.time.slice(11, 16), p.dcVoltageV, p.dcPowerKw, p.acPowerKw])}
        />
      </Card>

      <Card delay={0.2} title="Context data" icon={<Home size={18} />} tag="System profile">
        <KeyValues
          rows={[
            ['Location', `${context.location.name}, ${context.location.city}`],
            ['Array size', `${context.system.arrayKwp} kWp · ${context.system.strings} strings × ${context.system.modulesPerString} × ${context.system.moduleWp} W`],
            ['Module', `${context.system.moduleEfficiencyPct}% efficiency · ${context.system.tempCoeffPctPerC} %/°C · NOCT ${context.system.noctC} °C`],
            ['Tilt / azimuth', `${context.system.tiltDeg}° / ${context.system.azimuthDeg}° (south)`],
            ['Age / degradation', `${context.system.ageYears} years · ${context.system.degradationPctPerYear} %/yr`],
            ['Since last cleaning', `${context.system.daysSinceCleaning} days · soiling ${context.system.soilingRatePctPerDay} %/day`],
            ['Inverter efficiency', `${context.system.inverterEfficiencyPct} %`],
          ]}
        />
        <h3 className={styles.subhead}>Sources</h3>
        <ul className={styles.list}>{Object.entries(context.sources).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}</ul>
      </Card>

      <Card delay={0.25} title="Digital-twin baseline" icon={<Gauge size={18} />} tag="Computed, not AI">
        <p className={styles.muted}>{twin.method}</p>
        <KeyValues
          rows={[
            ['Analysis day', twin.analysisDate],
            ['Expected energy', `${twin.expectedEnergyKwh} kWh`],
            ['Actual energy', `${twin.actualEnergyKwh} kWh`],
            ['Gap', `${twin.gapPct} %`],
          ]}
        />
        <HourlyTable
          head={['Hour', 'Cell °C', 'Expected kW', 'Actual kW']}
          rows={twin.hourly.filter((p) => p.expectedKw > 0).map((p) => [p.time.slice(11, 16), p.cellTempC, p.expectedKw, p.actualKw])}
        />
      </Card>

      <details className={cn('glass', styles.card, styles.raw)}>
        <summary>Raw JSON payload sent to the AI</summary>
        <pre>{JSON.stringify(a.payload, null, 2)}</pre>
      </details>
    </div>
  );
}

function Card({ children, title, icon, tag, tagWarn, delay = 0 }: { children: ReactNode; title?: string; icon?: ReactNode; tag?: string; tagWarn?: boolean; delay?: number }) {
  const onMouseMove = useSpotlight<HTMLElement>();
  return (
    <section
      onMouseMove={onMouseMove}
      className={cn('glass spotlight-card', styles.card, styles.enter)}
      style={{ animationDelay: `${delay}s` }}
    >
      {title && (
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{icon} {title}</h2>
          {tag && <span className={cn(styles.badge, tagWarn ? styles.badgeRules : styles.badgeAi)}>{tag}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

function Meta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={styles.meta}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  );
}

function Bar({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={styles.bar}>
      <div className={styles.barTop}>
        <span className={strong ? styles.barLabelStrong : undefined}>{label}</span>
        <span>{value}%</span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function KeyValues({ rows }: { rows: [string, string][] }) {
  return (
    <dl className={styles.kv}>
      {rows.map(([k, v]) => (
        <div key={k} className={styles.kvRow}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function HourlyTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  if (!rows.length) return null;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
