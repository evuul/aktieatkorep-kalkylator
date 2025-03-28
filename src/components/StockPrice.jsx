import React, { useState, useEffect } from 'react';

const StockPrice = () => {
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState(null); // För att visa felmeddelanden
  const API_KEY = 'cvhg40pr01qgkck3ko5gcvhg40pr01qgkck3ko60';
  const BASE_URL = 'https://finnhub.io/api/v1';

  useEffect(() => {
    const fetchStockPrice = async () => {
      try {
        // Försök att direkt använda ticker-symbolen EVOG för Evolution Gaming
        const tickerSymbol = "EVOG.ST"; // Evolution Gaming ticker på Stockholmsbörsen
        const priceResponse = await fetch(`${BASE_URL}/quote?symbol=${tickerSymbol}&token=${API_KEY}`);
        const priceData = await priceResponse.json();

        if (priceData.error) {
          setError('Fel vid hämtning av data');
          return;
        }

        setStockPrice(priceData.c); // Senaste aktiekursen
        setError(null); // Återställ eventuellt tidigare fel
      } catch (error) {
        setError('Fel vid hämtning av data');
        console.error('Fel vid hämtning av data:', error);
      }
    };

    fetchStockPrice();
  }, []);

  return (
    <div>
      <h2>Aktuellt aktiepris för Evolution Gaming</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{stockPrice ? `SEK ${stockPrice}` : 'Laddar...'}</p>
      )}
    </div>
  );
};

export default StockPrice;