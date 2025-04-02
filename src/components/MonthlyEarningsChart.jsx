import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MonthlyEarningsChart = () => {
  const exchangeRate = 11.5; // EUR till SEK
  const quarterlyProfitEUR = 337.104; // 🔥 Hårdkodad kvartalsvinst i EUR

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const quarterlyProfitSEK = quarterlyProfitEUR * exchangeRate;
    const profitPerDay = quarterlyProfitSEK / 92;

    const daysInMonth = new Date().getDate();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      data.push({
        date: `Dag ${day}`,
        value: profitPerDay * day,
      });
    }

    setChartData(data);
  }, []);

  return (
    <div className="chart-container" style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Evolution's Månadsintjäning 📊</h2>

      {/* 🔍 Visa senaste kvartalsvinst */}
      <div style={{ marginBottom: "10px" }}>
        <h3>Senaste kvartalsvinst (EUR): {quarterlyProfitEUR.toLocaleString()} EUR</h3>
      </div>

      {/* 📈 Grafen */}
      <div style={{ width: "80%", height: 300, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => value.toLocaleString("sv-SE")} />
            <Tooltip formatter={(value) => `${value.toLocaleString("sv-SE")} SEK`} />
            <Line type="monotone" dataKey="value" stroke="#28a745" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyEarningsChart;