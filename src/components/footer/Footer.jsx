import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Link as MuiLink,
  IconButton,
  Divider,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#11161eff", 
        color: "#E5E7EB",
        mt: 6,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontWeight={900} fontSize={18}>
            OptiBuy
          </Typography>

          <Stack direction="row" spacing={3}>
            {["Shop", "About", "Contact"].map((item) => (
              <MuiLink
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: "#D1D5DB",
                  fontSize: 14,
                  "&:hover": { color: "#fff" },
                }}
              >
                {item}
              </MuiLink>
            ))}
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: "#D1D5DB" }}>
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton sx={{ color: "#D1D5DB" }}>
              <InstagramIcon fontSize="small" />
            </IconButton>
            <IconButton sx={{ color: "#D1D5DB" }}>
              <TwitterIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "center", color: "#9CA3AF" }}
        >
          © {new Date().getFullYear()} OptiBuy. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
