import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MoneyCounter = () => {
  const exchangeRate = 10.83; // EUR till SEK
  const quarterlyProfitEUR = 377100000; // Evolution Q4 2023 vinst i EUR
  const quarterlyProfitSEK = quarterlyProfitEUR * exchangeRate; // Omvandlat till SEK

  // Beräkningar
  const profitPerDay = quarterlyProfitSEK / 92; // 92 dagar i kvartalet
  const profitPerSecond = profitPerDay / 24 / 60 / 60; // Omvandlat till SEK per sekund

  const [money, setMoney] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((prevMoney) => prevMoney + profitPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [profitPerSecond]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Evolution Money Counter 💰</h2>
      <p><strong>Ren vinst sedan du öppnade sidan:</strong></p>

      {/* Animerad pengasiffra */}
      <motion.h3
        key={money}
        initial={{ opacity: 0.5, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {money.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} SEK
      </motion.h3>
    </div>
  );
};

export default MoneyCounter;