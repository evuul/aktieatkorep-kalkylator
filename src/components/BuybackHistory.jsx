import React, { useState, useEffect } from "react";
import '../styles/charts.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BuybackHistory = () => {
  const [buybackData, setBuybackData] = useState([]);
  const [oldBuybackData, setOldBuybackData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [sharesBought, setSharesBought] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [profitLoss, setProfitLoss] = useState(null);
  const [currentStockPrice, setCurrentStockPrice] = useState(800);
  const [filterPeriod, setFilterPeriod] = useState('day');

  const fetchOldBuybackData = async () => {
    try {
      const response = await fetch("/data/oldBuybackData.json");
      if (!response.ok) throw new Error(`HTTP-fel! Status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Felaktig JSON-struktur: Förväntade en array");
      setOldBuybackData(data);
    } catch (error) {
      console.error("Error fetching old buyback data:", error);
    }
  };

  const fetchBuybackData = async () => {
    try {
      const response = await fetch("/data/buybackData.json");
      if (!response.ok) throw new Error(`HTTP-fel! Status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Felaktig JSON-struktur: Förväntade en array");
      setBuybackData(data);
    } catch (error) {
      console.error("Error fetching buyback data:", error);
    }
  };

  useEffect(() => {
    fetchOldBuybackData();
    fetchBuybackData();
  }, []);

  useEffect(() => {
    const combinedData = [...oldBuybackData, ...buybackData];
    let totalSharesBought = 0;
    let totalTransactionValue = 0;

    combinedData.forEach((entry) => {
      if (entry.Antal_aktier > 0) {
        totalSharesBought += entry.Antal_aktier;
        totalTransactionValue += entry.Transaktionsvärde;
      }
    });

    const calculatedAveragePrice = totalSharesBought > 0 ? totalTransactionValue / totalSharesBought : 0;

    setSharesBought(totalSharesBought);
    setAveragePrice(calculatedAveragePrice);
    setTotalSpent(totalTransactionValue);
  }, [buybackData, oldBuybackData]);

  useEffect(() => {
    if (sharesBought > 0 && averagePrice > 0) {
      const profitOrLoss = (currentStockPrice - averagePrice) * sharesBought;
      setProfitLoss(profitOrLoss);
    }
  }, [currentStockPrice, sharesBought, averagePrice]);

  const filterData = (data, period) => {
    let filteredData = [];
    if (period === 'day') {
      filteredData = data.map(entry => ({
        date: entry.Datum,
        sharesBought: entry.Antal_aktier
      }));
    } else if (period === 'month') {
      const monthData = data.reduce((acc, entry) => {
        const month = new Date(entry.Datum).toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
        if (!acc[month]) acc[month] = { date: month, sharesBought: 0 };
        acc[month].sharesBought += entry.Antal_aktier;
        return acc;
      }, {});
      filteredData = Object.values(monthData);
    } else if (period === 'year') {
      const yearData = data.reduce((acc, entry) => {
        const year = new Date(entry.Datum).getFullYear();
        if (!acc[year]) acc[year] = { date: year, sharesBought: 0 };
        acc[year].sharesBought += entry.Antal_aktier;
        return acc;
      }, {});
      filteredData = Object.values(yearData);
    }
    return filteredData;
  };

  const chartData = filterData([...oldBuybackData, ...buybackData], filterPeriod);

  return (
    <div className="buyback-history">
      <h3>Historik för Aktieåterköp</h3>
      <div>
        <label htmlFor="filterPeriod">Välj tidsperiod:</label>
        <select
          id="filterPeriod"
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
        >
          <option value="day">Dag</option>
          <option value="month">Månad</option>
          <option value="year">År</option>
        </select>
      </div>
      <div className="info-boxes">
        <div className="info-box">
          <p><strong>Återköpta aktier:</strong> {sharesBought.toLocaleString()}</p>
          <p><strong>Snittkurs:</strong> {averagePrice ? averagePrice.toFixed(2) : 'Ingen data'} SEK</p>
        </div>
        <div className={`info-box ${profitLoss >= 0 ? 'win' : 'loss'}`}>
          <p><strong>Vinst/Förlust:</strong> 
            {profitLoss !== null ? (
              profitLoss >= 0 ? 
              `${Math.round(profitLoss).toLocaleString()} SEK Vinst` : 
              `${Math.abs(Math.round(profitLoss)).toLocaleString()} SEK Förlust`
            ) : "Ingen data tillgänglig"}
          </p>
        </div>
        <div className="info-box">
          <p><strong>Totalt spenderat på återköp:</strong> {totalSpent ? totalSpent.toLocaleString() : 'Ingen data'} SEK</p>
        </div>
      </div>
      <div className="update-stock-price">
        <label htmlFor="stockPrice">Aktuell aktiekurs (SEK): </label>
        <input
          id="stockPrice"
          type="number"
          value={currentStockPrice}
          onChange={(e) => setCurrentStockPrice(Number(e.target.value))}
        />
      </div>
      <div className="buyback-chart">
        <h4 style={{ textAlign: 'center' }}>
          Antal Återköpta Aktier per {filterPeriod === 'day' ? 'Dag' : filterPeriod === 'month' ? 'Månad' : 'År'}
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} st`} />
            <Legend />
            <Bar dataKey="sharesBought" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BuybackHistory;