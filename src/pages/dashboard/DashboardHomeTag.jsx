import React, { useEffect, useState } from "react";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Autocomplete,
} from "@mui/material";

export default function DashboardHomeTag() {
  const [tag, setTag] = useState("");
  const [tagsOptions, setTagsOptions] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const settingsRes = await AxiosUserInstance.get("/settings");
      setTag(settingsRes.data.settings?.homeProductsTag || "");

      const tagsRes = await AxiosUserInstance.get("/products/tags");
      setTagsOptions(tagsRes.data.tags || []);
    };
    load();
  }, []);

  const save = async () => {
    setMsg("");
    const cleanTag = tag.trim().toLowerCase();
    const { data } = await AxiosUserInstance.put("/settings", {
      homeProductsTag: cleanTag,
    });
    setMsg(`Saved! Home tag = ${data.settings.homeProductsTag}`);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Home Products Tag
      </Typography>

      {msg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      <Autocomplete
        freeSolo
        options={tagsOptions}
        value={tag}
        onChange={(e, newValue) => setTag(newValue || "")}
        onInputChange={(e, newInput) => setTag(newInput)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose or type tag (ex: black)"
            fullWidth
          />
        )}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={save}>
        Save
      </Button>
    </Box>
  );
}
