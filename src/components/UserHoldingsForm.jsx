import React, { useState } from 'react';

const UserHoldingsForm = ({ onHoldingsChange }) => {
  const [holdings, setHoldings] = useState({ userShares: '', userGAV: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Förhindrar ogiltiga tecken och negativa värden
    if (name === 'userShares' || name === 'userGAV') {
      const regex = /^[0-9]*\.?[0-9]*$/; // Tillåter endast siffror och decimaler
      if (regex.test(value) || value === '') {
        setHoldings({ ...holdings, [name]: value });
        setError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kontrollera att båda fälten har giltiga värden
    const userShares = parseFloat(holdings.userShares) || 0;
    const userGAV = parseFloat(holdings.userGAV) || 0;

    if (userShares <= 0 || userGAV <= 0) {
      setError('Både aktier och GAV måste vara större än noll.');
    } else {
      onHoldingsChange({ userShares, userGAV });
      setError('');
    }
  };

  return (
    <form className="holdings-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <div className="input-field">
          <label>Dina aktier:</label>
          <input
            type="number"
            name="userShares"
            value={holdings.userShares}
            onChange={handleChange}
            placeholder="Antal aktier"
          />
        </div>
  
        <div className="input-field">
          <label>Ditt GAV:</label>
          <input
            type="number"
            name="userGAV"
            value={holdings.userGAV}
            onChange={handleChange}
            placeholder="GAV i SEK"
          />
        </div>
      </div>
  
      {error && <div className="error-message">{error}</div>}
  
      <button type="submit" className="update-button">Uppdatera</button>
    </form>
  );
};

export default UserHoldingsForm;