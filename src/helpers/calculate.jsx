// helpers/calculate.js

export const calculateResults = (data, years = 5) => {
    let results = [];
    let { stockPrice, shares, buyback, dividend, growth } = data;
  
    for (let i = 0; i < years; i++) {
      const totalBuybackAmount = buyback * 1000000000; // Omvandlar miljarder till kronor
      const buybackShares = totalBuybackAmount / stockPrice;
      shares -= buybackShares; // Färre aktier i omlopp
  
      const totalDividend = shares * dividend; // Total utdelning till aktieägarna
      stockPrice *= 1 + growth / 100; // Aktiepriset ökar enligt tillväxttakten
      dividend *= 1.1; // Simulera utdelningstillväxt
  
      results.push({
        year: `År ${i + 1}`,
        stockPrice: stockPrice.toFixed(2),
        shares: Math.round(shares),
        dividend: dividend.toFixed(2),
        totalDividend: totalDividend.toFixed(2),
      });
    }
  
    return results;
  };