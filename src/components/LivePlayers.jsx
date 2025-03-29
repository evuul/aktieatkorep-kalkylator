import React, { useState, useEffect } from "react";
import "../styles/charts.css"; // För stilning

const LivePlayers = () => {
  const [playerCount, setPlayerCount] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const fetchPlayerData = async () => {
    try {
      const response = await fetch("https://hook.eu2.make.com/igw8o8m41m1sth8b8eaplka5qut5ss30");
      if (!response.ok) {
        throw new Error(`HTTP-fel! Status: ${response.status}`);
      }
      const data = await response.json();
      
      // Uppdatera state med hämtad data
      setPlayerCount(data.playersCount || "Okänt antal spelare");
      setLastUpdated(
        new Date().toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Fel vid hämtning av data:", error);
    }
  };

  useEffect(() => {
    fetchPlayerData(); // Hämta data direkt vid inladdning

    // Uppdatera datan varje minut (60000 ms)
    const interval = setInterval(fetchPlayerData, 900000);

    return () => clearInterval(interval); // Rensa intervallet vid avmontering
  }, []);

  return (
    <div className="live-players">
      <h3>Live Spelare</h3>
      <div className="player-info-box">
        <p>
          <strong>Antal spelare:</strong> {playerCount !== null ? playerCount : "Laddar..."}
        </p>
        <p>
          <strong>Senast uppdaterad:</strong> {lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default LivePlayers;

// https://hook.eu2.make.com/fcf2dj4sq00t5hwjdzh1rhyuwravqodn

  /*useEffect(() => {
    async function fetchData() {
      const headers = new Headers()
      headers.set('authorization', "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBbGV4YW5kZXIuZWtAbGl2ZS5zZSIsImlhdCI6MTc0MzE2NzkxMCwiZXhwIjoxNzQzNzcyNzEwfQ.P6NgU37IKNBXO_EMjpBOCTqgasPMwjmx2qeEYCIZL3c")
      const respond = await fetch(
        "https://generous-shelagh-khalid-organization-eb1285b3.koyeb.app/api/players/current",
        {
          headers: headers,
          // referrer: "https://www.evoinsights.io/",
          // referrerPolicy: "strict-origin-when-cross-origin",
          // body: null,
          // method: "GET",
          // // mode: "cors",
          // credentials: "include",
        }
      );
      const data = await respond.json();
      setPlayerCount(data)
      console.log(data);
    }
    fetchData
  }, []); */