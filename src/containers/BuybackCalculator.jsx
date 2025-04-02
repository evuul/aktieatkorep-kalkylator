import React, { useState } from 'react';
// import { InputForm } from '../components/InputForm';
// import { Chart } from '../components/Chart';
// import { DividendChart } from '../components/DividendChart';
// import { SharesChart } from '../components/SharesChart';
// import UserHoldingsForm from '../components/UserHoldingsForm';
// import ResultsTable from '../components/ResultsTable';
import MoneyCounter from '../components/MoneyCounter';
import MonthlyEarningsChart from "../components/MonthlyEarningsChart";
import BuybackVisualizer from '../components/BuybackVisualizer';
import LivePlayers from '../components/LivePlayers';
import AnalyzeChart from '../components/AnalyzeChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/charts.css';
import BuybackHistory from '../components/BuybackHistory';
import PeModel from '../components/PeModel';
import LivePlayersMockup from '../components/LivePlayersMockup';

const BuybackCalculator = () => {
  const [data, setData] = useState({
    stockPrice: 770,
    shares: 211833204,
    buyback: 5.7,
    dividend: 32,
    growth: 15,
  });

  // const [userHoldings, setUserHoldings] = useState({
  //   userShares: 0,
  //   userGAV: 0,
  // });

  // const [chartData, setChartData] = useState([]);
  // const [dividendData, setDividendData] = useState([]);
  const [results, setResults] = useState({ sharesData: [], dividendData: [], yearlyResults: [] });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setData({ ...data, [name]: parseFloat(value) || 0 });
  // };

  // const handleHoldingsChange = (holdings) => {
  //   setUserHoldings(holdings);
  // };

  const handleCalculate = () => {
    let shares = data.shares;
    let stockPrice = data.stockPrice;
    let dividendPot = 6000000000;
    let buyback = data.buyback * 1000000000;
    let growth = data.growth / 100;

    let newChartData = [];
    let newDividendData = [];
    let newSharesData = [];
    let newResults = [];

    let updatedShares = shares;
    let updatedDividendPerShare = dividendPot / shares;

    for (let year = 1; year <= 5; year++) {
      let yearBuyback = buyback + (year - 1) * 2000000000;
      let yearDividendPot = dividendPot + (year - 1) * 2000000000;

      let sharesRepurchased = yearBuyback / stockPrice;
      sharesRepurchased = Math.min(sharesRepurchased, updatedShares);
      updatedShares -= sharesRepurchased;
      if (updatedShares < 0) updatedShares = 0;

      stockPrice *= 1 + growth;
      updatedDividendPerShare = yearDividendPot / updatedShares;

      newChartData.push({ year: `År ${year}`, stockPrice });
      newDividendData.push({ year: `År ${year}`, totalDividend: updatedDividendPerShare });
      newSharesData.push({ year: `År ${year}`, shares: updatedShares });

      newResults.push({
        year: `År ${year}`,
        buybackAmount: yearBuyback / 1000000000,
        dividendPot: yearDividendPot / 1000000000,
        remainingShares: updatedShares,
        buybackPrice: stockPrice,
        dividendPerShare: updatedShares > 0 ? updatedDividendPerShare : 0,
      });
    }

    setChartData(newChartData);
    setDividendData(newDividendData);
    setResults({ sharesData: newSharesData, dividendData: newDividendData, yearlyResults: newResults });
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Dashboard Evolution</h1>
      <LivePlayersMockup />
      {/* <LivePlayers /> */}
      <MoneyCounter />

      {/* <InputForm data={data} onInputChange={handleInputChange} onCalculate={handleCalculate} /> */}
      {/* <UserHoldingsForm onHoldingsChange={handleHoldingsChange} /> */}

      {/* <div className="charts-container">
        <div className="chart-wrapper"><Chart data={chartData} /></div>
        <div className="chart-wrapper"><DividendChart data={dividendData} /></div>
        <div className="chart-wrapper"><SharesChart data={results.sharesData} /></div>
      </div> */}

      <div className="calculations">
        {results.yearlyResults.map((yearData, index) => (
          <div key={index} className="calculation-box">
            <h5>{yearData.year}</h5>
            <p><strong>Återköpsbelopp:</strong> {yearData.buybackAmount} miljarder</p>
            <p><strong>Utdelningskassa:</strong> {yearData.dividendPot} miljarder</p>
            <p><strong>Kvarvarande aktier:</strong> {Math.round(yearData.remainingShares)}st</p>
            <p><strong>Aktiepris vid återköp:</strong> {Math.round(yearData.buybackPrice)} kr</p>
            <p><strong>Utdelning per aktie:</strong> {Math.round(yearData.dividendPerShare)} kr</p>
          </div>
        ))}
      </div>

      <AnalyzeChart />

      {/* Den här komponenten hanterar nu JSON-filen för buyback-data */}
      <BuybackVisualizer />
      <BuybackHistory />
      {/* <ResultsTable results={results.yearlyResults} userHoldings={userHoldings} /> */}
      {/* <MonthlyEarningsChart />   */}
      {/* <PeModel /> */}
    </div>
  );
};

export default BuybackCalculator;