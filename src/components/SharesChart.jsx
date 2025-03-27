// components/SharesChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const SharesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center">Ingen data att visa ännu.</p>;
  }

  const labels = data.map(item => item.year);
  const shares = data.map(item => Math.abs(item.shares));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Aktier efter återköp',
        data: shares,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Gör att grafen kan anpassa sig fritt till skärmstorleken
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        suggestedMax: Math.max(...shares) * 1.2,
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <h3>Aktier efter Återköp</h3>
      <div style={{ height: '400px' }}> {/* Säkerställer en fast höjd på grafen */}
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};