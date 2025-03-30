import React, { useState, useEffect } from "react";
import "../styles/charts.css"; // För stilning

const UPDATE_INTERVAL = 900; // 15 minuter i sekunder

const LivePlayers = () => {
  const [playerCount, setPlayerCount] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(UPDATE_INTERVAL);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch("https://hook.eu2.make.com/igw8o8m41m1sth8b8eaplka5qut5ss30");
      if (!response.ok) {
        throw new Error(`HTTP-fel! Status: ${response.status}`);
      }
      const data = await response.json();

      setPlayerCount(data.playersCount || "Okänt antal spelare");
      setLastUpdated(new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }));

      setCountdown(UPDATE_INTERVAL); // 🔥 ÅTERSTÄLL TIMER TILL 15 MINUTER VID NY UPPDATERING
    } catch (error) {
      console.error("Fel vid hämtning av data:", error);
    }
  };

  useEffect(() => {
    fetchPlayerData(); // Hämta data vid sidladdning

    const updateInterval = setInterval(fetchPlayerData, UPDATE_INTERVAL * 1000); // Synkad uppdatering
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(updateInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  // Format för att visa timer som "MM:SS"
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="live-players">
      <h3>Live Spelare</h3>
      <div className="player-info-box">
        <p className="player-count">
          <strong>Antal spelare:</strong> {playerCount !== null ? playerCount : "Laddar..."}
        </p>
        <p className="last-updated">
          <strong>Senast uppdaterad:</strong> {lastUpdated || "Laddar..."}
        </p>
        <p className="countdown">
          <strong>Nästa uppdatering om:</strong> {formatCountdown(countdown)}
        </p>
      </div>
    </div>
  );
};

export default LivePlayers;