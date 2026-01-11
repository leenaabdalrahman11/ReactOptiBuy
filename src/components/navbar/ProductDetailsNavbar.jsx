import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function DetailsNavbar({ title = "Details", cartCount = 0 }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (e) {}
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fff",
        color: "text.primary",
        marginTop:"60px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        zIndex: 1200,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72, display: "flex", gap: 1.5 }}>
          <Tooltip title="Back">
            <IconButton onClick={() => navigate(-1)} sx={{ color: "inherit" }}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.75,
                display: { xs: "none", sm: "block" },
              }}
            >
              View Details
            </Typography>
          </Box>

          <Tooltip title="Share">
            <IconButton onClick={handleShare} sx={{ color: "inherit" }}>
              <ShareOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Cart">
            <IconButton component={RouterLink} to="/cart" sx={{ color: "inherit" }}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
