import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const metricColors = {
  operatingRevenues: "#1f77b4", // Blå
  adjustedEBITDA: "#ff7f0e", // Orange
  adjustedEBITDAMargin: "#2ca02c", // Grön
  adjustedProfitForPeriod: "#d62728", // Röd
  adjustedEarningsPerShare: "#9467bd", // Lila
  equityPerShare: "#8c564b", // Brun
  ocfPerShare: "#e377c2", // Rosa
  averageNumberOfFTEs: "#7f7f7f", // Grå
};

export const FinancialChart = ({ data, selectedMetrics, metricLabels }) => {
  if (selectedMetrics.length === 0) return null;

  return (
    <div>
      <h3>Stapeldiagram</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedMetrics.map(metric => (
            <Bar
              key={metric}
              dataKey={metric}
              fill={metricColors[metric]}
              name={metricLabels[metric]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};