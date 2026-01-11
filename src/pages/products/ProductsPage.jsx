import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";

import {
  Box,
  Typography,
  CircularProgress,
  Pagination as MuiPagination,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";

import AllProductsCards from "./AllProductsCards.jsx";
import styles from "./AllProducts.module.css";
import Categories from "../categories/Categories.jsx";

const DEFAULT_LIMIT = 10;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.max(1, Number(searchParams.get("limit") || DEFAULT_LIMIT));
  const search = (searchParams.get("search") || "").trim();

  const fetchProducts = async ({ queryKey }) => {
    const [, { page, limit, search }] = queryKey;

    try {
      const { data } = await AxiosInstance.get("products/active", {
        params: { page, limit, search },
      });
      return { mode: "server", data };
    } catch (e) {
      const { data } = await AxiosInstance.get("products/active");
      return { mode: "client", data, search };
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-products", { page, limit, search }],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <p>error is {error.message}</p>;

  let productsToShow = [];
  let totalPages = 1;

  if (data?.mode === "server") {
    const raw = data?.data || {};
    const serverProducts = raw?.products || [];

    const filtered = search
      ? serverProducts.filter((p) =>
          (p.name || "").toLowerCase().includes(search.toLowerCase())
        )
      : serverProducts;

    const totalCount = filtered.length;
    totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const safePageLocal = Math.min(page, totalPages);
    const start = (safePageLocal - 1) * limit;
    productsToShow = filtered.slice(start, start + limit);
  } else {
    const allProducts = data?.data?.products || [];

    const filtered = search
      ? allProducts.filter((p) =>
          (p.name || "").toLowerCase().includes(search.toLowerCase())
        )
      : allProducts;

    const totalCount = filtered.length;
    totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const safePageLocal = Math.min(page, totalPages);
    const start = (safePageLocal - 1) * limit;
    productsToShow = filtered.slice(start, start + limit);
  }

  const safePage = Math.min(page, totalPages);

  const handlePageChange = (_, newPage) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      prev.set("limit", String(limit));
      if (search) prev.set("search", search);
      else prev.delete("search");
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs = ["All Product", "Living room", "Office", "Decor", "Kitchen", "Bath"];

  return (
    <Box className={styles.page}>
      <Box className={styles.container}>
        <Box className={styles.hero}>
          <Typography className={styles.kicker}>
            Have a good setup for your minimalist home
          </Typography>

          <Typography variant="h3" component="h1" className={styles.title}>
            {search ? `Results for: "${search}"` : "Our Products"}
          </Typography>

          <Typography className={styles.subtitle}>
            {search
              ? `Showing ${productsToShow.length} results • Page ${safePage} of ${totalPages}`
              : `Showing ${productsToShow.length} items • Page ${safePage} of ${totalPages}`}
          </Typography>
        </Box>

        <Box>
          <Categories />
        </Box>

        <Box className={styles.grid}>
          {productsToShow.map((product) => (
            <Box key={product._id || product.id} className={styles.cardOuter}>
              <AllProductsCards product={product} />
            </Box>
          ))}
        </Box>

        {totalPages > 1 && (
          <Box className={styles.paginationWrap}>
            <Divider className={styles.divider} />
            <MuiPagination
              page={safePage}
              count={totalPages}
              onChange={handlePageChange}
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
