import React, { useState, useEffect } from "react";
import "../styles/charts.css"; // För stilning

const UPDATE_INTERVAL = 900; // 15 minuter i sekunder

const LivePlayers = () => {
  const [playerCount, setPlayerCount] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(UPDATE_INTERVAL);

  const paylode = {
    "org_id": "o_GOI88Az",
    "project_id": "proj_RMsr7M2",
    "steps": [
        {
            "namespace": "get_request",
            "props": {
                "http": null,
                "httpRequest": {
                    "auth": {
                        "type": "bearer",
                        "username": "authorization",
                        "password": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBbGV4YW5kZXIuZWtAbGl2ZS5zZSIsImlhdCI6MTc0MzE2NzkxMCwiZXhwIjoxNzQzNzcyNzEwfQ.P6NgU37IKNBXO_EMjpBOCTqgasPMwjmx2qeEYCIZL3c",
                        "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBbGV4YW5kZXIuZWtAbGl2ZS5zZSIsImlhdCI6MTc0MzE2NzkxMCwiZXhwIjoxNzQzNzcyNzEwfQ.P6NgU37IKNBXO_EMjpBOCTqgasPMwjmx2qeEYCIZL3c"
                    },
                    "body": {
                        "contentType": "application/json",
                        "fields": [
                            {
                                "name": "",
                                "value": "",
                                "disabled": true
                            }
                        ],
                        "mode": "fields",
                        "type": "fields"
                    },
                    "headers": [
                        {
                            "name": "",
                            "value": "",
                            "disabled": true
                        }
                    ],
                    "method": "GET",
                    "params": [
                        {
                            "name": "",
                            "value": "",
                            "disabled": true
                        }
                    ],
                    "url": "https://generous-shelagh-khalid-organization-eb1285b3.koyeb.app/api/players/current",
                    "tab": "Body"
                },
                "includeHeaders": null
            }
        },
        {
            "namespace": "return_http_response",
            "props": {
                "http": null,
                "resStatusCode": 200,
                "resHeaders": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
                "resBody": "{{steps.code.$return_value}}"
            }
        }
    ],
    "triggers": [
        {
            "props": {
                "emitShape": "BODY_ONLY",
                "responseType": "customResponse",
                "domains": [],
                "authorization": "none",
                "discardAutomatedRequests": null,
                "staticResponseStatus": 200,
                "staticResponseHeaders": {},
                "staticResponseBody": "",
                "bearerToken": ""
            }
        }
    ],
    "settings": {
        "name": "API LIVE PLAYERS",
        "auto_deploy": true
    }
}

  const fetchPlayerData = async () => {
    try {
      const response = await fetch("https://eok5qxjsyfl2mj2.m.pipedream.net", {
        method: "Post",
        body: paylode,
        headers: {
          Authorization: "Bearer 10968afa1e99e122efc86e81bde466a6"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP-fel! Status: ${response.status}`);
      }
      const data = await response.json();

      // console.log({data});
      

      setPlayerCount(data.playerCount || "Okänt antal spelare");
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