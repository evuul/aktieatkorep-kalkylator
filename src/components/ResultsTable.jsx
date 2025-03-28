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
            <th>Ditt totala värde</th>
            <th>Din utdelning</th>
          </tr>
        </thead>
        <tbody>
          {results.map((yearData, index) => {
            const userDividend = userHoldings.userShares * yearData.dividendPerShare;
            const userTotalValue = userHoldings.userShares * yearData.buybackPrice;

            return (
              <tr key={index}>
                <td>{yearData.year}</td>
                <td>{Math.round(userTotalValue).toLocaleString()} kr</td>
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