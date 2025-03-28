import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MonthlyEarningsChart = () => {
  const exchangeRate = 11.5; // EUR till SEK
  const quarterlyProfitEUR = 377100000; // Evolution Q4 2023 vinst i EUR
  const quarterlyProfitSEK = quarterlyProfitEUR * exchangeRate; // Omvandlat till SEK

  // Beräkningar
  const profitPerDay = quarterlyProfitSEK / 92; // Antal dagar i kvartalet (vi använder 92 som ett exempel)
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Beräkna data för varje dag i månaden
    const daysInMonth = new Date().getDate(); // Få dagens datum för att räkna dagar som har gått
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      data.push({
        date: `Dag ${day}`,
        value: profitPerDay * day, // Beräkna hur mycket Evolution har tjänat upp till den dagen
      });
    }

    setChartData(data);
  }, []); // Lägg till tom array för att bara köra en gång vid initial render

  return (
    <div className="chart-container" style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Evolution's Månadsintjäning 📊</h2>

      {/* Centrera grafen och minska bredden */}
      <div style={{ width: "80%", height: 300, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => value.toLocaleString("sv-SE")} />
            <Tooltip formatter={(value) => `${value.toLocaleString("sv-SE")} SEK`} />
            <Line type="monotone" dataKey="value" stroke="#28a745" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyEarningsChart;