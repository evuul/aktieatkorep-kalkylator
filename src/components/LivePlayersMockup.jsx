import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";

const LivePlayersMockup = () => {
  const [playerCount, setPlayerCount] = useState(81524); // Exempelvärde

  // Kontrollera om antalet spelare är över 90 000
  const isHighPlayerCount = playerCount > 90000;

  // Puls-animation som delas mellan LIVE och siffran
  const pulseAnimation = {
    scale: [1, 1.1, 1], // Pulserande effekt
    opacity: [1, 0.85, 1], // Lätt skiftande opacitet
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop",
    },
  };

  return (
    <Card
      sx={{
        maxWidth: 380,
        margin: "20px auto",
        background: "linear-gradient(145deg, rgb(10, 25, 47), rgb(20, 50, 70))", // Fräschare mörk ton
        borderRadius: "24px",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)", // Lite kraftigare skugga för mer djup
        padding: "20px",
        textAlign: "center",
        color: "#ffffff",
        border: "3px solid rgb(30, 100, 130)", // En fräschare kantfärg
      }}
    >
      <CardContent>
        {/* LIVE-märkning */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <motion.div animate={pulseAnimation}>
            <Chip
              label="LIVE"
              color="error"
              size="small"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #ff5e62, #ff9966)", // Lite modernare röd-orange
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "8px",
              }}
            />
          </motion.div>
        </Box>

        {/* Antal spelare */}
        <Box display="flex" flexDirection="column" alignItems="center" marginTop="20px">
          <Typography variant="h6" sx={{ opacity: 0.9, marginBottom: "5px" }}>
            Antal spelare:
          </Typography>

          <motion.div key={playerCount} animate={pulseAnimation}>
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: "48px",
                background: "linear-gradient(45deg, rgb(175, 238, 238), rgb(240, 255, 255))", // Fräsch ljus cyan-vit
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 5px rgba(175, 238, 238, 0.4)", // Minskad glöd
              }}
            >
              {playerCount.toLocaleString()}
              {isHighPlayerCount && (
                <motion.span
                  animate={{
                    y: [0, -10, 0], // Rör sig upp och ner
                    x: [0, -4, 4, 0], // Lätt skakning
                    rotate: [0, -2, 2, 0], // Liten rotation för mer dynamik
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity, // Upprepar sig
                    repeatType: "loop",
                  }}
                  style={{
                    color: "#ffcc00",
                    fontSize: "48px",
                    textShadow: "0 0 5px rgba(255, 204, 0, 0.4)", // Minskad glöd på raketen
                  }}
                >
                  🚀
                </motion.span>
              )}
            </Typography>
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LivePlayersMockup;