// components/Chart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Chart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center">Ingen data att visa ännu.</p>;
  }

  const labels = data.map(item => item.year);
  const stockPrices = data.map(item => item.stockPrice);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Aktiekurs',
        data: stockPrices,
        fill: false,
        borderColor: 'rgba(75,192,192,1)', // Justera färgen om det behövs
        borderWidth: 2,  // Tjocklek på linjen
        tension: 0.1 // Skapar en mjukare linje
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Viktigt för att den ska kunna anpassas fritt
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
        beginAtZero: true,  // Säkerställer att y-axeln börjar från 0
        min: 0,  // Förhindrar att den går i negativt värde
        suggestedMax: Math.max(...stockPrices) * 1.2,  // Dynamisk max för att justera tillräckligt
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <h3>Aktiekurs</h3>
      <div style={{ height: '400px' }}> {/* Här säkerställer vi att grafen får en fast höjd */}
        <Line data={chartData} options={options}/>
      </div>
    </div>
  );
};