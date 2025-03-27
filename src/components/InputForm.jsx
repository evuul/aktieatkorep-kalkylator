import React from 'react';
import '../styles/InputForm.css';

export const InputForm = ({ data, onInputChange, onCalculate }) => {
  return (
    <div className="mb-4">
      <div className="form-group">
        <label>Aktiepris</label>
        <input 
          type="number" 
          name="stockPrice" 
          value={data.stockPrice} 
          onChange={onInputChange} 
          className="form-control" 
        />
      </div>
      <div className="form-group">
        <label>Antal Aktier</label>
        <input 
          type="number" 
          name="shares" 
          value={data.shares} 
          onChange={onInputChange} 
          className="form-control" 
        />
      </div>
      <div className="form-group">
        <label>Återköpsbelopp (miljarder)</label>
        <input 
          type="number" 
          name="buyback" 
          value={data.buyback} 
          onChange={onInputChange} 
          className="form-control" 
        />
      </div>
      <div className="form-group">
        <label>Utdelning per aktie (kr)</label>
        <input 
          type="number" 
          name="dividend" 
          value={data.dividend} 
          onChange={onInputChange} 
          className="form-control" 
        />
      </div>
      <button onClick={onCalculate} className="btn btn-primary mt-3">Beräkna</button>
    </div>
  );
};