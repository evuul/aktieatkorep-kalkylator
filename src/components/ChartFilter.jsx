import React from "react";

const ChartFilter = ({ selectedMetrics, setSelectedMetrics }) => {
  const metrics = [
    { key: "operatingRevenues", label: "Operativa Intäkter" },
    { key: "adjustedEBITDA", label: "EBITDA" },
    { key: "adjustedEBITDAMargin", label: "EBITDA Marginal" },
    { key: "adjustedProfitForPeriod", label: "Vinst för Perioden" },
    { key: "adjustedEarningsPerShare", label: "Vinst per Aktie" },
    { key: "equityPerShare", label: "Eget Kapital per Aktie" },
    { key: "ocfPerShare", label: "OCF per Aktie" },
    { key: "totalRegulatedMarket", label: "Reglerad Marknad" }, // Nytt fält
    { key: "totalEurope", label: "Europa" },
    { key: "totalAsia", label: "Asien" },
    { key: "totalNorthAmerica", label: "Nordamerika" },
    { key: "totalLatAm", label: "Latinamerika" },
    { key: "totalOther", label: "Övriga Marknader" },
  ];

  const toggleMetric = (key) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  return (
    <div>
      <h3>Välj nyckeltal för graf:</h3>
      {metrics.map((metric) => (
        <label key={metric.key} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedMetrics.includes(metric.key)}
            onChange={() => toggleMetric(metric.key)}
          />
          {metric.label}
        </label>
      ))}
    </div>
  );
};

export default ChartFilter;