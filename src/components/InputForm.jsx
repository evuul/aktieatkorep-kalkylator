import React from 'react';

export const InputForm = ({ data, onInputChange, onCalculate }) => {
  return (
    <div className="mb-4">
      <div className="form-group-container">
        <div className="form-group">
          <label>Aktiepris</label>
          <input 
            type="number" 
            name="stockPrice" 
            value={data.stockPrice || ""} // Fallback till tom sträng om undefined
            onChange={onInputChange} 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label>Antal Aktier</label>
          <input 
            type="number" 
            name="shares" 
            value={data.shares || ""} // Fallback till tom sträng om undefined
            onChange={onInputChange} 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label>Återköpsbelopp (miljarder)</label>
          <input 
            type="number" 
            name="buyback" 
            value={data.buyback || ""} // Fallback till tom sträng om undefined
            onChange={onInputChange} 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label>Utdelning per aktie (kr)</label>
          <input 
            type="number" 
            name="dividend" 
            value={data.dividend || ""} // Fallback till tom sträng om undefined
            onChange={onInputChange} 
            className="form-control" 
          />
        </div>
      </div>
      <button onClick={onCalculate} className="btn btn-primary mt-3">Beräkna</button>
    </div>
  );
};