'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { SITES_BY_SCENARIO, CURRENT_OUTPUT } from '@/lib/mock-data';
import { SCENARIO_LABELS } from '@/lib/constants';
import type { SiteStatus } from '@/shared/types';

const STATUS_COLOR: Record<SiteStatus, string> = {
  healthy: '#10b981',
  warning: '#eab308',
  critical: '#ef4444',
};

const STATUS_GLOW: Record<SiteStatus, string> = {
  healthy: 'rgba(16, 185, 129, 0.35)',
  warning: 'rgba(234, 179, 8, 0.35)',
  critical: 'rgba(239, 68, 68, 0.35)',
};

const SITE_EXPECTED: Record<string, number> = {
  'al-olaya': 4.8,
  'diplomatic': 5.2,
  'king-abdullah': 4.6,
  'malaz': 4.1,
  'qurtubah': 4.4,
};

function generateSparkline(status: SiteStatus): { v: number }[] {
  if (status === 'healthy') {
    return [88, 90, 92, 91, 93, 94, 93].map((v) => ({ v }));
  }
  if (status === 'warning') {
    return [90, 88, 84, 80, 78, 76, 75].map((v) => ({ v }));
  }
  return [88, 75, 60, 40, 20, 10, 5].map((v) => ({ v }));
}

function ScenarioBadge({ scenario }: { scenario: string }) {
  return (
    <span
      style={{
        background: 'rgba(16,185,129,0.12)',
        border: '1px solid rgba(16,185,129,0.3)',
        color: '#10b981',
        borderRadius: 999,
        padding: '0.3rem 0.9rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {SCENARIO_LABELS[scenario] ?? scenario}
    </span>
  );
}

function StatusDot({ status }: { status: SiteStatus }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: STATUS_COLOR[status],
        fontSize: '0.78rem',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: STATUS_COLOR[status],
          boxShadow: `0 0 6px ${STATUS_COLOR[status]}`,
          display: 'inline-block',
          animation: status === 'critical' ? 'pulse 1.5s ease-in-out infinite' : undefined,
        }}
      />
      {status}
    </span>
  );
}

export default function SitesPage() {
  const { scenario } = useScenarioContext();
  const sites = SITES_BY_SCENARIO[scenario] ?? [];
  const currentOutput = CURRENT_OUTPUT[scenario] ?? 0;

  const counts = useMemo(() => {
    const healthy = sites.filter((s) => s.status === 'healthy').length;
    const warning = sites.filter((s) => s.status === 'warning').length;
    const critical = sites.filter((s) => s.status === 'critical').length;
    return { healthy, warning, critical };
  }, [sites]);

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: 1200,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#18181b',
              marginBottom: '0.4rem',
            }}
          >
            Site Monitoring
          </h1>
          <p style={{ color: '#52525b', fontSize: '0.9rem' }}>
            Riyadh Residential Portfolio — 5 installations
          </p>
        </div>
        <ScenarioBadge scenario={scenario} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {sites.map((site, i) => {
          const sparkData = generateSparkline(site.status);
          const expected = SITE_EXPECTED[site.id] ?? 4.8;
          const siteOutput = site.status === 'healthy'
            ? expected
            : site.status === 'warning'
            ? +(expected * 0.875).toFixed(1)
            : +(expected * 0.1).toFixed(1);

          return (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                background: '#f4f4f5',
                borderRadius: 16,
                padding: '1.25rem',
                border: `1px solid ${STATUS_GLOW[site.status]}`,
                boxShadow: `0 0 20px ${STATUS_GLOW[site.status]}`,
                cursor: 'default',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              }}
              whileHover={{
                y: -4,
                boxShadow: `0 8px 32px ${STATUS_GLOW[site.status]}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#18181b',
                    fontFamily: 'var(--font-outfit), sans-serif',
                  }}
                >
                  {site.name}
                </span>
                <span
                  style={{
                    background: 'rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 999,
                    padding: '0.15rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: STATUS_COLOR[site.status],
                  }}
                >
                  {site.confidence}%
                </span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <StatusDot status={site.status} />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <span style={{ color: '#52525b', fontSize: '0.8rem' }}>Output</span>
                <span style={{ color: '#18181b', fontSize: '0.85rem', fontWeight: 600 }}>
                  {siteOutput} / {expected} MW
                </span>
              </div>

              <div style={{ height: 60, marginTop: '0.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${site.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={STATUS_COLOR[site.status]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={STATUS_COLOR[site.status]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={STATUS_COLOR[site.status]}
                      strokeWidth={1.5}
                      fill={`url(#grad-${site.id})`}
                      dot={false}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{
          display: 'flex',
          gap: '1.25rem',
          flexWrap: 'wrap',
          background: '#f4f4f5',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 16,
          padding: '1.25rem 1.5rem',
        }}
      >
        {[
          { label: 'Total Sites', value: sites.length, color: '#18181b' },
          { label: 'Healthy', value: counts.healthy, color: '#10b981' },
          { label: 'Warnings', value: counts.warning, color: '#eab308' },
          { label: 'Critical', value: counts.critical, color: '#ef4444' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: '1 1 120px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <span style={{ color: '#52525b', fontSize: '0.78rem', fontWeight: 500 }}>
              {item.label}
            </span>
            <span
              style={{
                color: item.color,
                fontSize: '1.6rem',
                fontWeight: 700,
                fontFamily: 'var(--font-outfit), sans-serif',
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
