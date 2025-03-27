import React from 'react';

const ResultsTable = ({ results, userHoldings }) => {
  if (!userHoldings.userShares) return null;

  return (
    <div className="results-container">
      <h2>Din utveckling över tid</h2>
      <table className="table">
        <thead>
          <tr>
            <th>År</th>
            <th>Återköpsbelopp (miljarder)</th>
            <th>Utdelningspot (miljarder)</th>
            <th>Aktiepris vid återköp</th>
            <th>Utdelning per aktie</th>
            <th>Dina aktier</th>
            <th>Din utdelning</th>
          </tr>
        </thead>
        <tbody>
          {results.map((yearData, index) => {
            const userDividend = userHoldings.userShares * yearData.dividendPerShare;

            return (
              <tr key={index}>
                <td>{yearData.year}</td>
                <td>{yearData.buybackAmount.toFixed(1)}</td>
                <td>{yearData.dividendPot.toFixed(1)}</td>
                <td>{Math.round(yearData.buybackPrice)} kr</td>
                <td>{Math.round(yearData.dividendPerShare)} kr</td>
                <td>{userHoldings.userShares.toLocaleString()}</td>
                <td>{Math.round(userDividend).toLocaleString()} kr</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;