import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AxiosInstance from "../../api/AxiosInstance";
import { useNavigate } from "react-router-dom";

export default function SearchOverlay() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const searchApi = async ({ queryKey }) => {
    const [_key, q] = queryKey;
    if (!q) return { products: [] };

const { data } = await AxiosInstance.get(
  `/search?q=${encodeURIComponent(q)}&source=overlay`
);

    const products = (data?.products || []).map((p) => ({
      _id: p._id,
      name: p.name,
    }));

    const uniq = [];
    const seen = new Set();
    for (const p of products) {
      const key = (p.name || "").toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniq.push(p);
      }
    }

    return { products: uniq };
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-suggest", debounced],
    queryFn: searchApi,
    enabled: debounced.length > 0,
    staleTime: 30_000,
  });

  const products = data?.products || [];
  const showDropdown = open && debounced.length > 0 && products.length > 0;

const goToFilteredProducts = (q) => {
  const cleaned = (q || "").trim();
  if (!cleaned) return;

  setOpen(false);
  navigate(`/products-page?search=${encodeURIComponent(cleaned)}&page=1&limit=10`);
};

const finalizeSearch = async (q) => {
  const cleaned = (q || "").trim();
  if (!cleaned) return;

  try {
    await AxiosInstance.post("/search/log", { q: cleaned, source: "overlay" });
  } catch {}

  setOpen(false);
  navigate(`/products-page?search=${encodeURIComponent(cleaned)}&page=1&limit=10`);
};


  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 520 }}>
      <TextField
        fullWidth
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150);
        }}
onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    finalizeSearch(query);
  }
}}

        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading ? <CircularProgress size={18} /> : null}
            </InputAdornment>
          ),
          sx: {
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          },
        }}
      />

      {showDropdown && (
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            borderRadius: 2,
            overflow: "hidden",
            zIndex: 1400,
          }}
        >
          <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
            <List disablePadding>
              {products.map((prod) => (
                <ListItemButton
                  key={prod._id}
                  onMouseDown={(e) => e.preventDefault()} 
                  onClick={() => {
                    setQuery(prod.name); 
                    finalizeSearch(prod.name);

                  }}
                  sx={{ px: 2, py: 1.2 }}
                >
                  <ListItemText
                    primary={prod.name}
                    primaryTypographyProps={{ noWrap: true, fontWeight: 700 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Paper>
      )}

      {!isLoading && debounced && open && products.length === 0 && !isError && (
        <Typography sx={{ mt: 1, fontSize: 13 }} color="text.secondary">
          No suggestions
        </Typography>
      )}

      {isError && (
        <Typography color="error" sx={{ mt: 1, fontSize: 13 }}>
          Search failed
        </Typography>
      )}
    </Box>
  );
}
