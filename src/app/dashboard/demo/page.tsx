'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Wind,
  Cloud,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { useScenarioContext } from '@/shared/contexts/ScenarioContext';
import { SCENARIOS } from '@/lib/constants';
import type { ScenarioKey } from '@/shared/types';

const SCENARIO_CONFIG = [
  {
    key: SCENARIOS.HEALTHY as ScenarioKey,
    name: 'Normal / Healthy',
    description: 'All systems operating at peak efficiency. No faults detected.',
    icon: CheckCircle2,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
    tint: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.4)',
  },
  {
    key: SCENARIOS.DUST as ScenarioKey,
    name: 'Dusty / Soiling',
    description: 'Sand accumulation on panels reducing irradiance absorption.',
    icon: Wind,
    color: '#eab308',
    glow: 'rgba(234,179,8,0.25)',
    tint: 'rgba(234,179,8,0.06)',
    border: 'rgba(234,179,8,0.4)',
  },
  {
    key: SCENARIOS.SHADING as ScenarioKey,
    name: 'Shaded',
    description: 'Partial obstruction detected on string arrays during peak hours.',
    icon: Cloud,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
    tint: 'rgba(59,130,246,0.06)',
    border: 'rgba(59,130,246,0.4)',
  },
  {
    key: SCENARIOS.HARDWARE as ScenarioKey,
    name: 'Equipment Fault',
    description: 'Inverter string disconnected. Immediate technician dispatch required.',
    icon: AlertTriangle,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.25)',
    tint: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.4)',
  },
];

function buildFeed(scenario: ScenarioKey) {
  const base = [
    { time: '12:34:51', msg: 'DC Voltage String 1: 487.3 V', sym: '✓', ok: true },
    { time: '12:34:51', msg: 'DC Current String 2: 8.42 A', sym: '✓', ok: true },
    { time: '12:34:52', msg: 'Inverter Temp: 68.4°C', sym: '✓', ok: true },
    { time: '12:34:52', msg: 'AC Power Output: 4.18 kW', sym: '✓', ok: true },
    { time: '12:34:53', msg: 'PR Ratio: 0.847', sym: '⚠', ok: false },
    { time: '12:34:53', msg: 'Model Inference: Soiling (92%)', sym: '→', ok: null },
    { time: '12:34:54', msg: 'Irradiance: 812 W/m²', sym: '✓', ok: true },
    { time: '12:34:54', msg: 'String Imbalance: 0.3%', sym: '✓', ok: true },
  ];

  if (scenario === SCENARIOS.DUST) {
    base[4] = { time: '12:34:53', msg: 'PR Ratio: 0.741 (−12.5%)', sym: '⚠', ok: false };
    base[5] = { time: '12:34:53', msg: 'Model Inference: Soiling (92%)', sym: '→', ok: null };
  } else if (scenario === SCENARIOS.SHADING) {
    base[3] = { time: '12:34:52', msg: 'AC Power Output: 3.94 kW', sym: '⚠', ok: false };
    base[5] = { time: '12:34:53', msg: 'Model Inference: Shading (88%)', sym: '→', ok: null };
  } else if (scenario === SCENARIOS.HARDWARE) {
    base[0] = { time: '12:34:51', msg: 'DC Voltage String 3: 0.0 V', sym: '✗', ok: false };
    base[3] = { time: '12:34:52', msg: 'AC Power Output: 0.00 kW', sym: '✗', ok: false };
    base[5] = { time: '12:34:53', msg: 'Model Inference: Inverter Fault (98%)', sym: '→', ok: null };
  } else {
    base[4] = { time: '12:34:53', msg: 'PR Ratio: 0.971', sym: '✓', ok: true };
    base[5] = { time: '12:34:53', msg: 'Model Inference: Healthy (99%)', sym: '✓', ok: true };
  }

  return base;
}

function symColor(ok: boolean | null) {
  if (ok === true) return '#10b981';
  if (ok === false) return '#ef4444';
  return '#06b6d4';
}

export default function DemoPage() {
  const { scenario, setScenario } = useScenarioContext();
  const [feedKey, setFeedKey] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFeedKey((k) => k + 1);
  }, [scenario]);

  const feed = buildFeed(scenario);

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: 1200,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '0.4rem',
          }}
        >
          Demo Control Panel
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
          Simulate live telemetry for any scenario
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {SCENARIO_CONFIG.map((cfg, i) => {
            const isActive = scenario === cfg.key;
            const Icon = cfg.icon;
            return (
              <motion.button
                key={cfg.key}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                onClick={() => setScenario(cfg.key)}
                style={{
                  background: isActive ? cfg.tint : '#161616',
                  border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14,
                  padding: '1.1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'left',
                  boxShadow: isActive ? `0 0 20px ${cfg.glow}` : 'none',
                  transition: 'all 0.2s ease',
                  width: '100%',
                }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
              >
                <span
                  style={{
                    color: isActive ? cfg.color : '#71717a',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    transition: 'color 0.2s ease',
                  }}
                >
                  <Icon size={22} />
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '0.2rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-outfit), sans-serif',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: isActive ? '#fff' : '#a1a1aa',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {cfg.name}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          background: cfg.color,
                          color: '#000',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          borderRadius: 999,
                          padding: '0.1rem 0.5rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      color: '#71717a',
                      fontSize: '0.78rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {cfg.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div
          style={{
            background: '#161616',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                display: 'inline-block',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-outfit), sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#fff',
              }}
            >
              Live Telemetry Feed
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={feedKey}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
              >
                {feed.map((entry, i) => (
                  <motion.div
                    key={`${feedKey}-${i}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.35rem 0.6rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ color: '#71717a', flexShrink: 0 }}>[{entry.time}]</span>
                    <span style={{ color: '#e4e4e7', flex: 1 }}>{entry.msg}</span>
                    <span
                      style={{
                        color: symColor(entry.ok),
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {entry.sym}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
        style={{
          border: `2px dashed ${isDragOver ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: 16,
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          cursor: 'pointer',
          background: isDragOver ? 'rgba(16,185,129,0.05)' : 'transparent',
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }}
        whileHover={{
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.05)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
        />
        <Upload size={28} style={{ color: '#71717a' }} />
        <p
          style={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#fff',
          }}
        >
          Drop CSV file here or click to upload
        </p>
        <p style={{ color: '#71717a', fontSize: '0.82rem' }}>
          Supports: DC voltage, AC power, temperature, irradiance columns
        </p>
      </motion.div>
    </div>
  );
}
