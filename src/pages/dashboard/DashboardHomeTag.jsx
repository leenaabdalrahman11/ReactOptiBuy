import React, { useEffect, useState } from "react";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Autocomplete,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

export default function DashboardHomeTag() {
  const [tag, setTag] = useState("");
  const [tagsOptions, setTagsOptions] = useState([]);
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("Seasonal Offers");

  const [loading, setLoading] = useState(false);

  const accent = "#22d3ee";
  const bg = "#070B12";
  const panel = "rgba(15, 23, 42, 0.55)";
  const border = "rgba(148, 163, 184, 0.12)";
  const grid = "rgba(148, 163, 184, 0.08)";

  const glassCardSx = {
    background: `linear-gradient(180deg, ${panel} 0%, rgba(15, 23, 42, 0.35) 100%)`,
    border: `1px solid ${border}`,
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    borderRadius: 3,
    backdropFilter: "blur(10px)",
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "rgba(255,255,255,0.92)",
      borderRadius: 2,
      backgroundColor: "rgba(2, 6, 23, 0.35)",
      "& fieldset": { borderColor: border },
      "&:hover fieldset": { borderColor: "rgba(34, 211, 238, 0.35)" },
      "&.Mui-focused fieldset": { borderColor: accent },
    },
    "& .MuiInputLabel-root": { color: "rgba(226,232,240,0.72)" },
    "& .MuiInputLabel-root.Mui-focused": { color: accent },
    "& .MuiFormHelperText-root": { color: "rgba(226,232,240,0.6)" },
  };

  const menuPaperSx = {
    mt: 1,
    backgroundColor: "rgba(2,6,23,0.95)",
    border: `1px solid ${border}`,
    color: "rgba(255,255,255,0.9)",
    "& .MuiAutocomplete-option": {
      fontSize: 14,
    },
    "& .MuiAutocomplete-noOptions": {
      color: "rgba(226,232,240,0.7)",
    },
  };

  const primaryBtnSx = {
    borderRadius: 2,
    fontWeight: 800,
    textTransform: "none",
    background: `linear-gradient(90deg, ${accent} 0%, rgba(99,102,241,0.95) 100%)`,
    boxShadow: "0 12px 30px rgba(34,211,238,0.18)",
    "&:hover": {
      background: `linear-gradient(90deg, rgba(34,211,238,0.95) 0%, rgba(99,102,241,0.9) 100%)`,
    },
    "&.Mui-disabled": {
      background: "rgba(148,163,184,0.20)",
      color: "rgba(255,255,255,0.55)",
    },
  };

  const outlineBtnSx = {
    borderRadius: 2,
    fontWeight: 800,
    textTransform: "none",
    color: "rgba(255,255,255,0.86)",
    borderColor: "rgba(148, 163, 184, 0.25)",
    backgroundColor: "rgba(2, 6, 23, 0.10)",
    "&:hover": {
      borderColor: "rgba(34,211,238,0.45)",
      backgroundColor: "rgba(34,211,238,0.06)",
    },
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const settingsRes = await AxiosUserInstance.get("/settings");
        setTag(settingsRes.data.settings?.homeProductsTag || "");

        const tagsRes = await AxiosUserInstance.get("/products/tags");
        setTagsOptions(tagsRes.data.tags || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("season_title");
    if (saved) setTitle(saved);
  }, []);

  const saveTitle = () => {
    localStorage.setItem("season_title", title);
    alert("Saved!");
  };

  const save = async () => {
    setMsg("");
    const cleanTag = tag.trim().toLowerCase();
    const { data } = await AxiosUserInstance.put("/settings", {
      homeProductsTag: cleanTag,
    });
    setMsg(`Saved! Home tag = ${data.settings.homeProductsTag}`);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        color: "white",
        background: `radial-gradient(900px 500px at 20% 10%, rgba(34,211,238,0.12) 0%, transparent 60%),
                     radial-gradient(900px 500px at 80% 20%, rgba(99,102,241,0.10) 0%, transparent 55%),
                     linear-gradient(180deg, ${bg} 0%, #05070D 100%)`,
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${grid} 1px, transparent 1px),
            linear-gradient(90deg, ${grid} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.5,
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 980, mx: "auto" }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.1 }}
          >
            Home Products Tag
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
            Choose a tag for the home products section, and set the section title.
          </Typography>
        </Box>

        <Card sx={glassCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {msg && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(34,197,94,0.10)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  color: "rgba(255,255,255,0.9)",
                  "& .MuiAlert-icon": { color: "rgb(34,197,94)" },
                }}
              >
                {msg}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
                <CircularProgress sx={{ color: accent }} />
              </Box>
            ) : (
              <>
                <Autocomplete
                  freeSolo
                  options={tagsOptions}
                  value={tag}
                  onChange={(e, newValue) => setTag(newValue || "")}
                  onInputChange={(e, newInput) => setTag(newInput)}
                  PaperComponent={(props) => (
                    <Box component="div" {...props} sx={menuPaperSx} />
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose or type tag (ex: black)"
                      fullWidth
                      sx={fieldSx}
                    />
                  )}
                />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <Button variant="contained" onClick={save} sx={primaryBtnSx}>
                    Save Tag
                  </Button>
                </Box>

                <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${border}` }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "rgba(226,232,240,0.75)",
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      mb: 1,
                    }}
                  >
                    Section Title
                  </Typography>

                  <TextField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Black Friday Deals"
                    fullWidth
                    sx={fieldSx}
                  />

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                    <Button variant="contained" onClick={saveTitle} sx={primaryBtnSx}>
                      Save Title
                    </Button>
                    <Button variant="outlined" onClick={() => setTitle("Seasonal Offers")} sx={outlineBtnSx}>
                      Reset
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
