// src/components/AnalyticsChart.js

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './AnalyticsChart.css';

export default function AnalyticsChart({ data, options }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: options.type || 'bar',
      data: data || {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Demo Data',
            data: [12, 19, 8, 15, 11],
            backgroundColor: 'rgba(57,255,20,0.6)',
            borderColor: 'rgba(57,255,20,1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: '#eee' } },
          y: {
            beginAtZero: true,
            ticks: { color: '#eee' },
            grid: { color: '#333' },
          },
        },
        plugins: {
          legend: {
            labels: { color: '#39FF14', font: { family: 'Inter' } },
          },
        },
        ...options.settings,
      },
    });
    return () => chart.destroy();
  }, [data, options]);

  return (
    <div className="analytics-chart-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
