import React from "react";
import { Wobble } from "ldrs/react";
import 'ldrs/react/Wobble.css'
import { Box } from "@mui/material";

function Preloader() {
  

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#090909",
        zIndex: 9999,
      }}
    >
      <Wobble size="70" speed="1.3" color="white" />
    </Box>
  );
}

export default Preloader;
