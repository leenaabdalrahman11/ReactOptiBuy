import { useState } from "react";
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
  Divider
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory2";
import AxiosInstance from "../../api/AxiosInstance";

export default function SearchOverlay() {
  const [query, setQuery] = useState("");

  const searchApi = async ({ queryKey }) => {
    const [_key, q] = queryKey;
    if (!q || q.trim() === "") return { categories: [], products: [] };

    try {
      const { data } = await AxiosInstance.get(
        `/search?q=${encodeURIComponent(q)}`
      );
      return data;
    } catch (error) {
      console.error("Search API error:", error);
      throw new Error("Failed to fetch search results");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query],
    queryFn: searchApi,
    enabled: !!query,
    staleTime: 30_000
  });

  const categories = data?.categories || [];
  const products = data?.products || [];

  return (
    <Box
      sx={{
        position: "relative", 
        width: "40%",
        bgcolor: "background.paper",
        zIndex: 1300,
        mx: "auto",         
      }}
    >
      <TextField
        fullWidth
        size="medium"
        label="Search for any products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {(categories.length > 0 || products.length > 0) && (
        <Paper
          sx={{
            mt: 0,   
            p: 1,
            position: "absolute", 
            width: "100%",
            boxShadow: 3,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {categories.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Categories
              </Typography>
              <List dense>
                {categories.map((cat) => (
                  <ListItemButton
                    key={cat._id}
                    component="a"
                    href={`/category-details/${cat._id}`}
                  >
                    <CategoryIcon sx={{ mr: 1 }} />
                    <ListItemText primary={cat.name} />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}

          {categories.length > 0 && products.length > 0 && <Divider sx={{ my: 1 }} />}

          {products.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Products
              </Typography>
              <List dense>
                {products.map((prod) => (
                  <ListItemButton
                    key={prod._id}
                    component="a"
                    href={`/product-details/${prod._id}`}
                  >
                    <InventoryIcon sx={{ mr: 1 }} />
                    <ListItemText
                      primary={prod.name}
                      secondary={prod.description}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </Paper>
      )}

      {!isLoading && query && categories.length === 0 && products.length === 0 && (
        <Typography sx={{ mt: 1 }} color="text.secondary">
          No results found
        </Typography>
      )}

      {isError && (
        <Typography color="error" sx={{ mt: 1 }}>
          Search failed
        </Typography>
      )}
    </Box>
  );
}
