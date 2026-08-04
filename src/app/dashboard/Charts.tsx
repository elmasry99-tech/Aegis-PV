"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#52525b',
        font: {
          family: "'Inter', sans-serif",
        },
        usePointStyle: true,
        boxWidth: 6,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0a0a0a',
      bodyColor: '#52525b',
      borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
    },
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.06)',
      },
      ticks: {
        color: '#71717a',
      },
      beginAtZero: false,
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#71717a',
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
};

export function PowerOutputChart({ scenario }: { scenario: string }) {
  const labels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  
  // Baseline Expected curve
  const expectedData = [0.5, 2.1, 4.2, 5.0, 4.3, 2.5, 0.4];
  
  let actualData = [...expectedData];
  
  if (scenario === 'dust') {
    // Gradual decline from expected
    actualData = [0.4, 1.8, 3.5, 4.2, 3.6, 2.1, 0.3];
  } else if (scenario === 'shading') {
    // Sharp dip at specific times
    actualData = [0.5, 2.1, 1.5, 5.0, 4.3, 2.5, 0.4];
  } else if (scenario === 'hardware') {
    // Sudden complete drop
    actualData = [0.5, 2.1, 4.2, 0, 0, 0, 0];
  }

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Expected Output (kW)',
        data: expectedData,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.4,
      },
      {
        fill: true,
        label: 'Actual Output (kW)',
        data: actualData,
        borderColor: scenario === 'healthy' ? '#10b981' : '#ef4444',
        backgroundColor: scenario === 'healthy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        pointBackgroundColor: scenario === 'healthy' ? '#10b981' : '#ef4444',
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
