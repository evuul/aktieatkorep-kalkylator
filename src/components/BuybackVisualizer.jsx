import React, { useState, useEffect } from "react";
import '../styles/charts.css';

const BuybackVisualizer = () => {
  const [buybackData, setBuybackData] = useState([]); // För att lagra den inlästa datan
  const [remainingCash, setRemainingCash] = useState(5700000000); // Total återköpskassa
  const [sharesBought, setSharesBought] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0); // Spenderad summa på återköp
  const [profitLoss, setProfitLoss] = useState(null); // För att spåra vinst/förlust
  const [currentStockPrice, setCurrentStockPrice] = useState(800); // Sätt till aktiekurs från JSON eller extern källa

  // Hämta JSON-datan med async/await
  const fetchBuybackData = async () => {
    try {
      const response = await fetch("/data/buybackData.json");
      if (!response.ok) {
        throw new Error(`HTTP-fel! Status: ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Felaktig JSON-struktur: Förväntade en array");
      }

      console.log(data); // Debugging: Kontrollera den hämtade datan

      setBuybackData(data);

      let totalSharesBought = 0;
      let totalTransactionValue = 0; // Total spenderad summa på aktier
      let totalShares = 0;

      // Iterera över JSON-data och summera värden
      data.forEach((entry) => {
        if (entry.Antal_aktier > 0) {
          totalSharesBought += entry.Antal_aktier;
          totalTransactionValue += entry.Transaktionsvärde;
          totalShares += entry.Antal_aktier; // Vi adderar antalet aktier som har köpts
        }
      });

      // Räkna ut snittkursen (total transaktionsvärde / total aktier köpta)
      const calculatedAveragePrice = totalSharesBought > 0 ? totalTransactionValue / totalSharesBought : 0;

      setSharesBought(totalSharesBought);
      setAveragePrice(calculatedAveragePrice);
      setTotalSpent(totalTransactionValue);
    } catch (error) {
      console.error("Error fetching buyback data:", error);
    }
  };

  useEffect(() => {
    // Kalla på funktionen när komponenten är inladdad
    fetchBuybackData();
  }, []);

  useEffect(() => {
    // Beräkna vinst/förlust om data finns
    if (buybackData.length > 0 && sharesBought > 0) {
      const profitOrLoss = (currentStockPrice - averagePrice) * sharesBought;
      setProfitLoss(profitOrLoss); // Positivt värde = vinst, negativt = förlust
    }
  }, [buybackData, averagePrice, sharesBought, currentStockPrice]);

  // Beräkning av procentuell användning av återköpskassan
  const buybackProgress = totalSpent > 0 ? (totalSpent / remainingCash) * 100 : 0;

  // Dynamisk klass för vinst eller förlust
  const profitLossClass = profitLoss >= 0 ? 'win' : 'loss';

  return (
    <div className="buyback-visualizer">
      <h3>Aktieåterköp - Visualisering</h3>

      {/* Återköpskassa */}
      <div className="progress-container">
        <h5>Återköpskassa: {remainingCash.toLocaleString()} SEK</h5>
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${buybackProgress}%`, backgroundColor: '#98FF98' }}  // Mintgrön
            ></div>
        </div>
        <p>{Math.round(buybackProgress)}% av återköpskassan har använts</p>
      </div>

      {/* Återköpta aktier och Vinst/Förlust */}
      <div className="info-boxes">
        <div className="info-box">
          <p><strong>Återköpta aktier:</strong> {sharesBought}</p>
          <p><strong>Snittkurs:</strong> {averagePrice ? averagePrice.toFixed(2) : 'Ingen data'} SEK</p>
        </div>

        <div className={`info-box ${profitLossClass}`}>
          <p><strong>Vinst/Förlust:</strong> 
            {profitLoss !== null && profitLoss !== undefined ? (
              profitLoss >= 0 ? 
              `${profitLoss.toFixed(2)} SEK Vinst` : 
              `${Math.abs(profitLoss).toFixed(2)} SEK Förlust`
            ) : "Ingen data tillgänglig"}
          </p>
        </div>

        <div className="info-box">
          <p><strong>Kvarvarande kassa:</strong> {Math.round(remainingCash - totalSpent).toLocaleString()} SEK</p>
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
    </div>
  );
};

export default BuybackVisualizer;