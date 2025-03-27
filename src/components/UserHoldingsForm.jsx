import React, { useState } from 'react';

const UserHoldingsForm = ({ onHoldingsChange }) => {
  const [holdings, setHoldings] = useState({ userShares: '', userGAV: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHoldings({ ...holdings, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onHoldingsChange({ userShares: parseFloat(holdings.userShares) || 0, userGAV: parseFloat(holdings.userGAV) || 0 });
  };

  return (
    <form className="holdings-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <div className="input-field">
          <label>Dina aktier:</label>
          <input type="number" name="userShares" value={holdings.userShares} onChange={handleChange} />
        </div>
  
        <div className="input-field">
          <label>Ditt GAV:</label>
          <input type="number" name="userGAV" value={holdings.userGAV} onChange={handleChange} />
        </div>
      </div>
  
      <button type="submit" className="update-button">Uppdatera</button>
    </form>
  );
};

export default UserHoldingsForm;