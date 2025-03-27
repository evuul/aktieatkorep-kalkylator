import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const DividendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center">Ingen data att visa ännu.</p>;
  }

  const labels = data.map(item => item.year);
  const dividends = data.map(item => Math.abs(item.totalDividend));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total utdelning per aktie (kr)',
        data: dividends,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Detta gör att grafen inte låser sitt aspect-ratio
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
        suggestedMax: Math.max(...dividends) * 1.2,
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <h3>Utdelning per Aktie</h3> {/* Rubrik ovanför grafen */}
      <Bar data={chartData} options={options} />
    </div>
  );
};