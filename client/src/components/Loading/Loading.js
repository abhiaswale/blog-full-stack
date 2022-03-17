import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return (
    <Box className="h-screen flex justify-center items-center">
      <CircularProgress />
    </Box>
  );
};

export default Loading;
