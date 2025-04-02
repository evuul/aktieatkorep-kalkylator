import React, { useState, useEffect } from "react";
import '../styles/charts.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BuybackVisualizer = () => {
  const [buybackData, setBuybackData] = useState([]);
  const [remainingCashEUR] = useState(500000000); // Återköpskassa i EUR
  const [remainingCashSEK, setRemainingCashSEK] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [sharesBought, setSharesBought] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [profitLoss, setProfitLoss] = useState(null);
  const [currentStockPrice, setCurrentStockPrice] = useState(800);

  const [filterPeriod, setFilterPeriod] = useState('day'); // Standard är 'day'

  // Hämta aktuell EUR/SEK växelkurs
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
      const data = await response.json();
      const rate = data.rates.SEK;
      setExchangeRate(rate);
      setRemainingCashSEK(remainingCashEUR * rate);
    } catch (error) {
      console.error("Fel vid hämtning av valutakurs:", error);
    }
  };

  // Hämta JSON-data för återköpta aktier
  const fetchBuybackData = async () => {
    try {
      const response = await fetch("/data/buybackData.json");
      if (!response.ok) throw new Error(`HTTP-fel! Status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Felaktig JSON-struktur: Förväntade en array");

      setBuybackData(data);

      let totalSharesBought = 0;
      let totalTransactionValue = 0;

      data.forEach((entry) => {
        if (entry.Antal_aktier > 0) {
          totalSharesBought += entry.Antal_aktier;
          totalTransactionValue += entry.Transaktionsvärde;
        }
      });

      const calculatedAveragePrice = totalSharesBought > 0 ? totalTransactionValue / totalSharesBought : 0;

      setSharesBought(totalSharesBought);
      setAveragePrice(calculatedAveragePrice);
      setTotalSpent(totalTransactionValue);
    } catch (error) {
      console.error("Error fetching buyback data:", error);
    }
  };

  // Beräkna vinst/förlust baserat på snittpris och nuvarande aktiekurs
  useEffect(() => {
    if (buybackData.length > 0 && sharesBought > 0) {
      const profitOrLoss = (currentStockPrice - averagePrice) * sharesBought;
      setProfitLoss(profitOrLoss);
    }
  }, [buybackData, averagePrice, sharesBought, currentStockPrice]);

  useEffect(() => {
    fetchExchangeRate();
    fetchBuybackData();
  }, []);

  const buybackProgress = totalSpent > 0 && remainingCashSEK > 0 ? (totalSpent / remainingCashSEK) * 100 : 0;
  const profitLossClass = profitLoss >= 0 ? 'win' : 'loss';

  // Filtrera och gruppera data baserat på vald period (dag, månad, år)
const filterData = (data, period) => {
  let filteredData = [];

  if (period === 'day') {
    // Visa alla återköp per dag utan att gruppera
    filteredData = data.map(entry => ({
      date: entry.Datum, // Använd det fulla datumet
      sharesBought: entry.Antal_aktier
    }));
  } else if (period === 'month') {
    // Gruppera efter månad
    const monthData = data.reduce((acc, entry) => {
      const month = new Date(entry.Datum).toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
      if (!acc[month]) acc[month] = { date: month, sharesBought: 0 };
      acc[month].sharesBought += entry.Antal_aktier;
      return acc;
    }, {});
    filteredData = Object.values(monthData);
  } else if (period === 'year') {
    // Gruppera efter år
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

  const chartData = filterData(buybackData, filterPeriod);

  return (
    <div className="buyback-visualizer">
      <h3>Aktieåterköp - Visualisering</h3>

      {/* Dropdown för att välja tidsperiod */}
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

      {/* Återköpskassa */}
      <div className="progress-container">
        <h5>Återköpskassa: {remainingCashSEK ? remainingCashSEK.toLocaleString() : "..."} SEK</h5>
        <p>(Baserat på växelkurs: {exchangeRate ? exchangeRate.toFixed(2) : "..."})</p>
        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${buybackProgress}%`, backgroundColor: '#66BB6A' }}></div>
        </div>
        <p>{Math.round(buybackProgress)}% av återköpskassan har använts</p>
      </div>

      {/* Återköpta aktier och Vinst/Förlust */}
      <div className="info-boxes">
        <div className="info-box">
          <p><strong>Återköpta aktier:</strong> {sharesBought.toLocaleString()}</p>
          <p><strong>Snittkurs:</strong> {averagePrice ? averagePrice.toFixed(2) : 'Ingen data'} SEK</p>
        </div>

        <div className={`info-box ${profitLossClass}`}>
          <p><strong>Vinst/Förlust:</strong> 
            {profitLoss !== null ? (
              profitLoss >= 0 ? 
              `${profitLoss.toFixed(2)} SEK Vinst` : 
              `${Math.abs(profitLoss).toFixed(2)} SEK Förlust`
            ) : "Ingen data tillgänglig"}
          </p>
        </div>

        <div className="info-box">
          <p><strong>Kvarvarande kassa:</strong> {remainingCashSEK ? (remainingCashSEK - totalSpent).toLocaleString() : "..."} SEK</p>
        </div>
      </div>

      {/* Manuell uppdatering av nuvarande aktiekurs */}
      <div className="update-stock-price">
        <label htmlFor="stockPrice">Aktuell aktiekurs (SEK): </label>
        <input
          id="stockPrice"
          type="number"
          value={currentStockPrice}
          onChange={(e) => setCurrentStockPrice(Number(e.target.value))}
        />
      </div>

      {/* Stapeldiagram för återköpta aktier */}
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
            <Bar dataKey="sharesBought" fill="#66BB6A" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BuybackVisualizer;