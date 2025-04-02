import React, { useState, useEffect } from "react";
import '../styles/charts.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const AnalyzeChart = () => {
  const [financialReports, setFinancialReports] = useState([]);
  const [viewMode, setViewMode] = useState('quarterly'); // Kvartal som standard
  const [selectedMetrics, setSelectedMetrics] = useState(["operatingRevenues"]); // Standardval

  const fetchFinancialReports = async () => {
    try {
      const response = await fetch("/data/financialReports.json");
      if (!response.ok) {
        throw new Error(`HTTP-fel! Status: ${response.status}`);
      }
      const data = await response.json();
      setFinancialReports(data.financialReports);
    } catch (error) {
      console.error("Error fetching financial reports:", error);
    }
  };

  useEffect(() => {
    fetchFinancialReports();
  }, []);

  // Funktion för att sammanställa data per år (sammanfoga kvartal till ett år)
  const aggregateAnnualData = () => {
    const annualData = {};
  
    financialReports.forEach(report => {
      if (!annualData[report.year]) {
        annualData[report.year] = {
          year: report.year,
          totalOperatingRevenues: 0, 
          totalAdjustedEBITDA: 0,
          totalAdjustedOperatingProfit: 0,
          totalAdjustedProfitForPeriod: 0,
          adjustedEarningsPerShare: 0, // Ska summeras
          equityPerShare: 0,
          ocfPerShare: 0,
          averageNumberOfFTEs: 0,
          totalBuybackShares: 0, // Nytt fält för återköpta aktier
          count: 0
        };
      }
  
      annualData[report.year].totalOperatingRevenues += report.operatingRevenues;
      annualData[report.year].totalAdjustedEBITDA += report.adjustedEBITDA;
      annualData[report.year].totalAdjustedOperatingProfit += report.adjustedOperatingProfit;
      annualData[report.year].totalAdjustedProfitForPeriod += report.adjustedProfitForPeriod;
      annualData[report.year].adjustedEarningsPerShare += report.adjustedEarningsPerShare; // Summera vinst per aktie
      annualData[report.year].equityPerShare += report.equityPerShare;
      annualData[report.year].ocfPerShare += report.ocfPerShare;
      annualData[report.year].averageNumberOfFTEs += report.averageNumberOfFTEs;
      annualData[report.year].totalBuybackShares += report.buybackShares || 0; // Summera upp aktierna som har återköpts
      annualData[report.year].count += 1;
    });
  
    return Object.values(annualData).map(report => ({
      year: report.year,
      operatingRevenues: report.totalOperatingRevenues,
      adjustedEBITDA: report.totalAdjustedEBITDA,
      adjustedEBITDAMargin: (report.totalAdjustedEBITDA / report.totalOperatingRevenues) * 100,
      adjustedOperatingProfit: report.totalAdjustedOperatingProfit,
      adjustedOperatingMargin: (report.totalAdjustedOperatingProfit / report.totalOperatingRevenues) * 100,
      adjustedProfitForPeriod: report.totalAdjustedProfitForPeriod,
      adjustedProfitMargin: (report.totalAdjustedProfitForPeriod / report.totalOperatingRevenues) * 100,
      adjustedEarningsPerShare: report.adjustedEarningsPerShare, // Nu summeras den korrekt
      equityPerShare: report.equityPerShare / report.count,
      ocfPerShare: report.ocfPerShare / report.count,
      averageNumberOfFTEs: report.averageNumberOfFTEs / report.count,
      totalBuybackShares: report.totalBuybackShares // Lägg till totala återköpta aktier
    }));
  };

  const roundValue = (value) => (value ? value.toFixed(2) : '0.00');

  const renderFinancialTable = () => {
    const dataToRender = viewMode === 'annual' ? aggregateAnnualData() : financialReports;
  
    return (
      <div className="table-container">
        <table className="financial-report-table">
          <thead>
            <tr>
              <th>År</th>
              {viewMode === 'quarterly' && <th>Kvartal</th>} {/* Visa endast i kvartalsvy */}
              <th>Operativa Intäkter (M€)</th>
              <th>EBITDA (M€)</th>
              <th>EBITDA Marginal (%)</th>
              <th>Rörelseresultat (M€)</th>
              <th>Rörelsemarginal (%)</th>
              <th>Vinst för Perioden (M€)</th>
              <th>Vinstmarginal (%)</th>
              <th>Vinst per Aktie (€)</th>
              <th>Eget Kapital per Aktie (€)</th>
              <th>OCF per Aktie (M€)</th>
              <th>Antal Heltidsanställda</th>
            </tr>
          </thead>
          <tbody>
            {dataToRender.map((report, index) => (
              <tr key={index}>
                <td>{report.year}</td>
                {viewMode === "quarterly" && <td>Q{report.quarter.replace(/\D/g, "")}</td>}
                <td>{roundValue(report.operatingRevenues)} M€</td>
                <td>{roundValue(report.adjustedEBITDA)} M€</td>
                <td>{roundValue(report.adjustedEBITDAMargin)} %</td>
                <td>{roundValue(report.adjustedOperatingProfit)} M€</td>
                <td>{roundValue(report.adjustedOperatingMargin)} %</td>
                <td>{roundValue(report.adjustedProfitForPeriod)} M€</td>
                <td>{roundValue(report.adjustedProfitMargin)} %</td>
                <td>{roundValue(report.adjustedEarningsPerShare)} €</td>
                <td>{roundValue(report.equityPerShare)} €</td>
                <td>{roundValue(report.ocfPerShare)} M€</td>
                <td>{roundValue(report.averageNumberOfFTEs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const chartColors = {
    operatingRevenues: "#8884d8",
    adjustedEBITDA: "#82ca9d",
    adjustedEBITDAMargin: "#ffc658",
    adjustedOperatingProfit: "#ff7300",
    adjustedOperatingMargin: "#d88884",
    adjustedProfitForPeriod: "#8d44ad",
    adjustedEarningsPerShare: "#ff6666",
  };

  const renderGrowthChart = () => {
    const dataToRender = viewMode === 'annual' ? aggregateAnnualData() : financialReports;
    
    const data = dataToRender.map(report => ({
      yearQuarter: viewMode === 'annual' 
        ? `${report.year}`  
        : `${report.year} Q${report.quarter.replace(/\D/g, "")}`,
      // Här rensar vi varje numeriskt värde till 2 decimaler
      operatingRevenues: report.operatingRevenues ? parseFloat(report.operatingRevenues.toFixed(2)) : 0,
      adjustedEBITDA: report.adjustedEBITDA ? parseFloat(report.adjustedEBITDA.toFixed(2)) : 0,
      adjustedEBITDAMargin: report.adjustedEBITDAMargin ? parseFloat(report.adjustedEBITDAMargin.toFixed(2)) : 0,
      adjustedOperatingProfit: report.adjustedOperatingProfit ? parseFloat(report.adjustedOperatingProfit.toFixed(2)) : 0,
      adjustedOperatingMargin: report.adjustedOperatingMargin ? parseFloat(report.adjustedOperatingMargin.toFixed(2)) : 0,
      adjustedProfitForPeriod: report.adjustedProfitForPeriod ? parseFloat(report.adjustedProfitForPeriod.toFixed(2)) : 0,
      adjustedProfitMargin: report.adjustedProfitMargin ? parseFloat(report.adjustedProfitMargin.toFixed(2)) : 0,
      adjustedEarningsPerShare: report.adjustedEarningsPerShare ? parseFloat(report.adjustedEarningsPerShare.toFixed(2)) : 0,
      equityPerShare: report.equityPerShare ? parseFloat(report.equityPerShare.toFixed(2)) : 0,
      ocfPerShare: report.ocfPerShare ? parseFloat(report.ocfPerShare.toFixed(2)) : 0,
      averageNumberOfFTEs: report.averageNumberOfFTEs ? parseFloat(report.averageNumberOfFTEs.toFixed(2)) : 0,
      totalBuybackShares: report.totalBuybackShares ? parseFloat(report.totalBuybackShares.toFixed(2)) : 0, // Lägg till buyback data
    }));

    return (
      <div>
        <h3>Nyckeltal - Stapeldiagram</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearQuarter" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedMetrics.map(metric => (
              <Bar key={metric} dataKey={metric} fill={chartColors[metric]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
};

  const handleMetricSelection = (metric) => {
    setSelectedMetrics(prevMetrics =>
      prevMetrics.includes(metric)
        ? prevMetrics.filter(m => m !== metric)
        : [...prevMetrics, metric]
    );
  };

  return (
    <div className="analyze-chart">
      <h2>Finansiella Rapportdata</h2>

      {/* Knappar för att byta mellan kvartal och helår */}
      <div className="view-mode-buttons">
        <button onClick={() => setViewMode('quarterly')} className={viewMode === 'quarterly' ? 'active' : ''}>Kvartal</button>
        <button onClick={() => setViewMode('annual')} className={viewMode === 'annual' ? 'active' : ''}>Helår</button>
      </div>

      {/* Nyckeltalsfilter */}
      <div className="metrics-filter">
        {Object.keys(chartColors).map(metric => (
          <label key={metric} style={{ marginRight: '20px' }}>
            <input
              type="checkbox"
              checked={selectedMetrics.includes(metric)}
              onChange={() => handleMetricSelection(metric)}
            />
            <span style={{ color: chartColors[metric] }}>{metric}</span>
          </label>
        ))}
      </div>

      {/* Visa tabellen */}
      {renderFinancialTable()}

      {/* Visa stapeldiagram */}
      {renderGrowthChart()}
    </div>
  );
};

export default AnalyzeChart;