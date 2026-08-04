'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Radio,
  Cloud,
  Filter,
  BarChart2,
  Target,
  Wrench,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { DIAGNOSES, PIPELINE_STAGES, FEATURE_IMPORTANCE } from '@/lib/mock-data';

// ─── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Radio,
  Cloud,
  Filter,
  BarChart2,
  Cpu,
  Target,
  Wrench,
};

// ─── Confidence breakdown per scenario ───────────────────────────────────────
const CONFIDENCE_BREAKDOWN: Record<
  string,
  { label: string; value: number; color: string }[]
> = {
  healthy: [
    { label: 'Healthy', value: 99, color: '#10b981' },
    { label: 'Soiling', value: 0.5, color: '#eab308' },
    { label: 'Shading', value: 0.3, color: '#f97316' },
    { label: 'Equip. Fault', value: 0.2, color: '#ef4444' },
  ],
  dust: [
    { label: 'Healthy', value: 4, color: '#10b981' },
    { label: 'Soiling', value: 92, color: '#eab308' },
    { label: 'Shading', value: 3, color: '#f97316' },
    { label: 'Equip. Fault', value: 1, color: '#ef4444' },
  ],
  shading: [
    { label: 'Healthy', value: 5, color: '#10b981' },
    { label: 'Soiling', value: 7, color: '#eab308' },
    { label: 'Shading', value: 88, color: '#f97316' },
    { label: 'Equip. Fault', value: 0, color: '#ef4444' },
  ],
  hardware: [
    { label: 'Healthy', value: 0.5, color: '#10b981' },
    { label: 'Soiling', value: 0.8, color: '#eab308' },
    { label: 'Shading', value: 0.7, color: '#f97316' },
    { label: 'Equip. Fault', value: 98, color: '#ef4444' },
  ],
};

// ─── Status badge styles ──────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  healthy: {
    bg: 'rgba(16,185,129,0.1)',
    color: '#10b981',
    border: 'rgba(16,185,129,0.3)',
    label: 'Healthy',
  },
  warning: {
    bg: 'rgba(234,179,8,0.1)',
    color: '#eab308',
    border: 'rgba(234,179,8,0.3)',
    label: 'Warning',
  },
  critical: {
    bg: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    border: 'rgba(239,68,68,0.3)',
    label: 'Critical',
  },
};

// ─── Flowing dot connector between stages ────────────────────────────────────
function FlowConnector({ active }: { active: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 40,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 2,
          height: '100%',
          background: active
            ? 'linear-gradient(180deg, rgba(16,185,129,0.6) 0%, rgba(6,182,212,0.3) 100%)'
            : 'rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {active && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background:
                'linear-gradient(180deg, transparent 0%, #10b981 50%, transparent 100%)',
            }}
            animate={{ top: ['-40%', '140%'] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 0.1,
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Single pipeline stage card ───────────────────────────────────────────────
interface StageCardProps {
  stage: (typeof PIPELINE_STAGES)[number];
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function StageCard({
  stage,
  index,
  isActive,
  isCompleted,
  isExpanded,
  onToggle,
}: StageCardProps) {
  const Icon = ICON_MAP[stage.icon] ?? Cpu;

  const borderColor = isActive
    ? 'rgba(16,185,129,0.5)'
    : isCompleted
    ? 'rgba(16,185,129,0.2)'
    : 'rgba(0,0,0,0.08)';

  const bg = isActive
    ? 'rgba(16,185,129,0.06)'
    : isCompleted
    ? 'rgba(16,185,129,0.02)'
    : '#f4f4f5';

  const boxShadow = isActive
    ? '0 0 0 1px rgba(16,185,129,0.3), 0 4px 24px rgba(16,185,129,0.08)'
    : 'none';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      whileTap={{ scale: 0.99 }}
      onClick={onToggle}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: '1.1rem 1.25rem',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
        boxShadow,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Active glow strip */}
      {isActive && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(16,185,129,0.04) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Step number / status */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: isCompleted
              ? 'rgba(16,185,129,0.15)'
              : isActive
              ? 'rgba(16,185,129,0.2)'
              : 'rgba(0,0,0,0.05)',
            border: `1px solid ${
              isCompleted || isActive
                ? 'rgba(16,185,129,0.4)'
                : 'rgba(0,0,0,0.1)'
            }`,
            transition: 'all 0.25s ease',
          }}
        >
          {isCompleted ? (
            <CheckCircle2 size={16} color="#10b981" />
          ) : isActive ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Activity size={14} color="#10b981" />
            </motion.div>
          ) : (
            <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 600 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isActive
              ? 'rgba(16,185,129,0.12)'
              : 'rgba(0,0,0,0.04)',
            border: `1px solid ${
              isActive ? 'rgba(16,185,129,0.25)' : 'rgba(0,0,0,0.08)'
            }`,
            flexShrink: 0,
            transition: 'all 0.25s ease',
          }}
        >
          <Icon
            size={16}
            color={isActive ? '#10b981' : isCompleted ? '#10b981' : '#52525b'}
            strokeWidth={1.75}
          />
        </div>

        {/* Label + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive || isCompleted ? '#18181b' : '#52525b',
              marginBottom: '0.15rem',
              transition: 'color 0.25s ease',
            }}
          >
            {stage.label}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#71717a', lineHeight: 1.4 }}>
            {stage.description}
          </div>
        </div>

        {/* Duration badge + expand icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: '0.7rem',
                color: '#10b981',
                fontWeight: 500,
              }}
            >
              <Clock size={10} />
              {stage.duration}ms
            </motion.div>
          )}
          {isCompleted && !isActive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.15)',
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: '0.7rem',
                color: '#10b981',
                fontWeight: 500,
              }}
            >
              <Zap size={10} />
              Done
            </div>
          )}
          <div style={{ color: '#52525b' }}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#52525b',
                  lineHeight: 1.65,
                  marginBottom: '0.875rem',
                }}
              >
                {stage.detail}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {stage.inputs.length > 0 && (
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#52525b',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Inputs
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {stage.inputs.map((inp) => (
                        <span
                          key={inp}
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: 999,
                            background: 'rgba(0,0,0,0.06)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            color: '#52525b',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {inp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {stage.outputs.length > 0 && (
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#52525b',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Outputs
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {stage.outputs.map((out) => (
                        <span
                          key={out}
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: 999,
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(16,185,129,0.2)',
                            color: '#10b981',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {out}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Custom recharts tooltip ──────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { feature: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const { value, payload: data } = payload[0];
  return (
    <div
      style={{
        background: '#f4f4f5',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: '0.78rem',
      }}
    >
      <div style={{ color: '#52525b', marginBottom: 2 }}>{data.feature}</div>
      <div style={{ color: '#10b981', fontWeight: 700 }}>
        {(value * 100).toFixed(0)}%
      </div>
    </div>
  );
}

// ─── Confidence bar ───────────────────────────────────────────────────────────
function ConfidenceBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.3rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#52525b' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div
        style={{
          height: 5,
          borderRadius: 999,
          background: 'rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(value, 0.5)}%` }}
          transition={{ duration: 0.7, delay, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 999 }}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PipelinePage() {
  const { scenario } = useScenarioContext();
  const diagnosis = DIAGNOSES[scenario];
  const breakdown = CONFIDENCE_BREAKDOWN[scenario] ?? CONFIDENCE_BREAKDOWN.dust;
  const badge = STATUS_BADGE[diagnosis.status] ?? STATUS_BADGE.healthy;

  // Responsive layout
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    setIsNarrow(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Active/completed stage tracking
  const [activeStageIndex, setActiveStageIndex] = useState<number>(-1);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const animRunning = useRef(false);

  // Simulate the pipeline running through stages on mount (and scenario change)
  useEffect(() => {
    if (animRunning.current) return;
    animRunning.current = true;
    setActiveStageIndex(-1);

    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    PIPELINE_STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        setActiveStageIndex(i);
        // Auto-expand the active stage
        setExpandedStage(stage.id);
      }, elapsed + 300);
      timers.push(t);
      elapsed += stage.duration + 120;
    });

    // After all stages complete, keep last as active
    const done = setTimeout(() => {
      animRunning.current = false;
    }, elapsed + 300);
    timers.push(done);

    return () => {
      timers.forEach(clearTimeout);
      animRunning.current = false;
    };
  }, [scenario]);

  const handleToggle = (stageId: string) => {
    setExpandedStage((prev) => (prev === stageId ? null : stageId));
  };

  // Recharts chart data
  const chartData = FEATURE_IMPORTANCE.map((f) => ({
    feature: f.feature,
    importance: f.importance,
  }));

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: 1400,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '0.4rem',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cpu size={18} color="#10b981" strokeWidth={1.75} />
            </div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#18181b',
                margin: 0,
              }}
            >
              AI Pipeline
            </h1>
          </div>
          <p style={{ color: '#52525b', fontSize: '0.9rem', margin: 0 }}>
            How the system classifies faults and generates recommendations
          </p>
        </div>

        {/* Current diagnosis badge */}
        <motion.div
          key={scenario}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: badge.bg,
            border: `1px solid ${badge.border}`,
            borderRadius: 12,
            padding: '0.6rem 1rem',
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: badge.color,
              boxShadow: `0 0 8px ${badge.color}`,
            }}
          />
          <div>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: badge.color,
                opacity: 0.8,
                marginBottom: 2,
              }}
            >
              Current Diagnosis
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: badge.color }}>
              {diagnosis.title}
            </div>
          </div>
          <div
            style={{
              marginLeft: 4,
              padding: '3px 8px',
              borderRadius: 999,
              background: badge.color + '20',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: badge.color,
            }}
          >
            {diagnosis.confidence}%
          </div>
        </motion.div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isNarrow ? '1fr' : '1fr 340px',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: Pipeline visualization ─────────────────────────────── */}
        <div
          style={{
            background: '#f4f4f5',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 16,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#52525b',
              }}
            >
              <Activity size={16} color="#10b981" />
              Pipeline Execution
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10b981',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>
                Live
              </span>
            </div>
          </div>

          {/* Stage cards with connectors */}
          <div>
            {PIPELINE_STAGES.map((stage, i) => {
              const isCompleted = i < activeStageIndex;
              const isActive = i === activeStageIndex;
              const isExpanded = expandedStage === stage.id;

              return (
                <div key={stage.id}>
                  <StageCard
                    stage={stage}
                    index={i}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    isExpanded={isExpanded}
                    onToggle={() => handleToggle(stage.id)}
                  />
                  {i < PIPELINE_STAGES.length - 1 && (
                    <FlowConnector active={isCompleted || isActive} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion status bar */}
          <motion.div
            style={{
              marginTop: '1.5rem',
              padding: '0.875rem 1rem',
              background: 'rgba(16,185,129,0.04)',
              border: '1px solid rgba(16,185,129,0.12)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#52525b' }}>
              Pipeline completion
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 120,
                  height: 4,
                  borderRadius: 999,
                  background: 'rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{
                    width: `${Math.round(
                      ((Math.max(activeStageIndex, 0) + 1) / PIPELINE_STAGES.length) * 100
                    )}%`,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                    borderRadius: 999,
                  }}
                />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>
                {Math.round(
                  ((Math.max(activeStageIndex, 0) + 1) / PIPELINE_STAGES.length) * 100
                )}
                %
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Details panel ──────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Feature Importance chart */}
          <div
            style={{
              background: '#f4f4f5',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: 16,
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <BarChart2 size={16} color="#06b6d4" strokeWidth={1.75} />
              <span
                style={{ fontSize: '0.875rem', fontWeight: 600, color: '#52525b' }}
              >
                Feature Importance
              </span>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 32, bottom: 0, left: 8 }}
                barCategoryGap="28%"
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <XAxis
                  type="number"
                  domain={[0, 0.4]}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  width={105}
                  tick={{ fill: '#52525b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]} maxBarSize={14}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill="url(#barGradient)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Current Prediction */}
          <motion.div
            key={scenario}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: '#f4f4f5',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: 16,
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <Target size={16} color="#10b981" strokeWidth={1.75} />
              <span
                style={{ fontSize: '0.875rem', fontWeight: 600, color: '#52525b' }}
              >
                Current Prediction
              </span>
            </div>

            {/* Big confidence + fault label */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <motion.div
                key={diagnosis.confidence}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: badge.color,
                  lineHeight: 1,
                  marginBottom: '0.3rem',
                }}
              >
                {diagnosis.confidence}%
              </motion.div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#18181b',
                  marginBottom: '0.2rem',
                }}
              >
                {diagnosis.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                Confidence Score (Platt-calibrated)
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: 'rgba(0,0,0,0.06)',
                marginBottom: '1rem',
              }}
            />

            {/* Confidence breakdown bars */}
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#52525b',
                marginBottom: '0.6rem',
              }}
            >
              Class Probabilities
            </div>
            {breakdown.map((item, idx) => (
              <ConfidenceBar
                key={item.label}
                label={item.label}
                value={item.value}
                color={item.color}
                delay={idx * 0.08}
              />
            ))}

            {/* Model info footer */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.625rem 0.75rem',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 8,
                fontSize: '0.72rem',
                color: '#71717a',
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: '#52525b', fontWeight: 500 }}>Model:</span>{' '}
              RF + LSTM Ensemble &nbsp;·&nbsp;
              <span style={{ color: '#52525b', fontWeight: 500 }}>Trained:</span>{' '}
              18 months labeled data &nbsp;·&nbsp;
              <span style={{ color: '#52525b', fontWeight: 500 }}>Classes:</span> 4
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
