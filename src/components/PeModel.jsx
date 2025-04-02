import React, { useState, useEffect } from 'react';
import '../styles/charts.css'; // Importera CSS-fil för styling

const PeModel = () => {
  const [eps, setEps] = useState(10); // Startvärde för EPS
  const [antalAktier, setAntalAktier] = useState(1000000); // Startvärde för antal aktier
  const [peTal, setPeTal] = useState(15); // Startvärde för P/E-tal
  const [aktiekurs, setAktiekurs] = useState(eps * peTal); // Beräkna aktiekurs baserat på EPS och P/E-tal

  useEffect(() => {
    setAktiekurs(eps * peTal);
  }, [eps, peTal]);

  const handleEpsChange = (event) => {
    setEps(parseFloat(event.target.value));
  };

  const handleAntalAktierChange = (event) => {
    setAntalAktier(parseInt(event.target.value));
  };

  const handlePeTalChange = (event) => {
    setPeTal(parseFloat(event.target.value));
  };

  return (
    <div className="pe-model-container">
      <h2>P/E-talsmodell</h2>

      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="eps">Vinst per aktie (EPS):</label>
          <input
            type="number"
            id="eps"
            value={eps}
            onChange={handleEpsChange}
          />
        </div>

        <div className="input-field">
          <label htmlFor="antalAktier">Antal aktier:</label>
          <input
            type="number"
            id="antalAktier"
            value={antalAktier}
            onChange={handleAntalAktierChange}
          />
        </div>

        <div className="input-field">
          <label htmlFor="peTal">P/E-tal:</label>
          <input
            type="number"
            id="peTal"
            value={peTal}
            onChange={handlePeTalChange}
          />
        </div>
      </div>

      <div className="result-display">
        <h3>Aktiekurs: {aktiekurs.toFixed(2)} SEK</h3>
      </div>
    </div>
  );
};

export default PeModel;