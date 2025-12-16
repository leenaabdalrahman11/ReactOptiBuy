import { Box, Typography } from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#111",
        color: "#fff",
        py: 3,
        textAlign: "center",
        mt: 6,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} OptiBuy. All rights reserved.
      </Typography>

      <Typography
        variant="caption"
        sx={{ opacity: 0.7, display: "block", mt: 0.5 }}
      >
        Built with ❤️ by Leena
      </Typography>
    </Box>
  );
}
