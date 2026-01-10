import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";

import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Stack,
  Chip,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

export default function EditPromoSection() {
  const { key } = useParams();
  const qc = useQueryClient();
  const [form, setForm] = React.useState(null);

  const fetchSection = async () => {
    const { data } = await AxiosInstance.get(`/api/promo-sections/${key}`);
    return data.section;
  };

  const {
    data: section,
    isLoading: isSectionLoading,
    isError: isSectionError,
    error: sectionError,
  } = useQuery({
    queryKey: ["homeSection", key],
    queryFn: fetchSection,
  });

  React.useEffect(() => {
    if (!section) return;

    const normalizeText = (v) => {
      if (!v) return { en: "", ar: "" };
      if (typeof v === "string") return { en: v, ar: v };
      return { en: v.en || "", ar: v.ar || "" };
    };

    setForm({
      ...section,
      cta: {
        ...(section.cta || {}),
        text: normalizeText(section.cta?.text),
      },
      heading: {
        ...(section.heading || {}),
        small: normalizeText(section.heading?.small),
        title: normalizeText(section.heading?.title),
        desc: normalizeText(section.heading?.desc),
      },
      items: (section.items || []).map((it) => ({
        ...it,
        badge: normalizeText(it.badge),
      })),
    });
  }, [section]);

  const fetchProducts = async () => {
    try {
      const { data } = await AxiosInstance.get("products/active");
      const list = data?.products || data?.data?.products || data?.result || [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      const { data } = await AxiosInstance.get("/products/active");
      const list = data?.products || data?.data?.products || data?.result || [];
      return Array.isArray(list) ? list : [];
    }
  };

  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["activeProducts"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        items: (form.items || []).map((it) => ({
          ...it,
          buttonLink: it.productId ? `/product-details/${it.productId}` : "#",
        })),
      };

      const { data } = await AxiosInstance.patch(
        `/api/promo-sections/${key}`,
        payload
      );
      return data.section;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["homeSection", key] }),
  });

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

  const sectionCardSx = {
    ...glassCardSx,
    overflow: "hidden",
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

  const switchSx = {
    "& .MuiSwitch-switchBase.Mui-checked": { color: accent },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "rgba(34,211,238,0.55)",
    },
    "& .MuiSwitch-track": { backgroundColor: "rgba(148,163,184,0.25)" },
  };

  const chipSx = {
    borderRadius: 2,
    fontWeight: 900,
    color: "rgba(255,255,255,0.86)",
    borderColor: "rgba(148,163,184,0.20)",
    backgroundColor: "rgba(2,6,23,0.20)",
  };

  const optionAvatarSx = {
    width: 42,
    height: 42,
    borderRadius: 2,
    border: "1px solid rgba(148,163,184,0.20)",
    bgcolor: "rgba(2,6,23,0.25)",
  };

  const dividerSx = { borderColor: "rgba(148,163,184,0.12)" };

  const previewFrameSx = {
    width: 220,
    height: 140,
    borderRadius: 3,
    border: "1px solid rgba(148,163,184,0.16)",
    overflow: "hidden",
    background: "rgba(2, 6, 23, 0.25)",
    display: "grid",
    placeItems: "center",
  };

  const previewImgSx = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform .25s ease",
    "&:hover": { transform: "scale(1.03)" },
  };

  const pageWrapSx = {
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
  };

  if (isSectionError && !form) {
    return (
      <Box sx={pageWrapSx}>
        <Box
          sx={{ position: "relative", zIndex: 1, maxWidth: 1100, mx: "auto" }}
        >
          <Typography sx={{ color: "rgb(239,68,68)" }}>
            Failed to load section: {sectionError?.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isSectionLoading || !form) {
    return (
      <Box sx={{ ...pageWrapSx, display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: accent }} />
      </Box>
    );
  }

  const updateHeading = (field, langKey, value) => {
    setForm((prev) => ({
      ...prev,
      heading: {
        ...(prev.heading || {}),
        [field]: {
          ...(prev.heading?.[field] || { en: "", ar: "" }),
          [langKey]: value,
        },
      },
    }));
  };

  const updateCtaText = (langKey, value) => {
    setForm((prev) => ({
      ...prev,
      cta: {
        ...(prev.cta || {}),
        text: {
          ...(prev.cta?.text || { en: "", ar: "" }),
          [langKey]: value,
        },
      },
    }));
  };

  const updateCtaLink = (value) => {
    setForm((prev) => ({
      ...prev,
      cta: {
        ...(prev.cta || {}),
        link: value,
      },
    }));
  };

  const updateItemField = (index, field, value) => {
    setForm((prev) => {
      const items = [...(prev.items || [])];
      const cur = items[index] || {};
      items[index] = { ...cur, [field]: value };
      return { ...prev, items };
    });
  };

  const updateItemBadge = (index, langKey, value) => {
    setForm((prev) => {
      const items = [...(prev.items || [])];
      const cur = items[index] || {};
      items[index] = {
        ...cur,
        badge: {
          ...(cur.badge || { en: "", ar: "" }),
          [langKey]: value,
        },
      };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { productId: "", badge: { en: "", ar: "" }, order: (prev.items?.length || 0) + 1 },
      ],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <Box sx={pageWrapSx}>
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 1100, mx: "auto" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Edit Section
            </Typography>
            <Typography
              sx={{ fontSize: 13, color: "rgba(226,232,240,0.7)", mt: 0.5 }}
            >
              Key: <b>{key}</b>
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            sx={{ ...primaryBtnSx, px: 2.5 }}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>

        <Card sx={{ ...sectionCardSx, mb: 2 }}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography
                sx={{ fontWeight: 900, color: "rgba(226,232,240,0.9)" }}
              >
                Section Settings
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    sx={switchSx}
                    checked={!!form.isActive}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, isActive: e.target.checked }))
                    }
                  />
                }
                label={
                  <Typography
                    sx={{ fontWeight: 800, color: "rgba(226,232,240,0.8)" }}
                  >
                    Active
                  </Typography>
                }
              />
            </Stack>

            <Divider sx={{ ...dividerSx, my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    mb: 1,
                    fontWeight: 800,
                    color: "rgba(226,232,240,0.85)",
                  }}
                >
                  Heading
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Small Title (EN)"
                      value={form.heading?.small?.en || ""}
                      onChange={(e) =>
                        updateHeading("small", "en", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Small Title (AR)"
                      value={form.heading?.small?.ar || ""}
                      onChange={(e) =>
                        updateHeading("small", "ar", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                      inputProps={{ dir: "rtl" }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Main Title (EN)"
                      value={form.heading?.title?.en || ""}
                      onChange={(e) =>
                        updateHeading("title", "en", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Main Title (AR)"
                      value={form.heading?.title?.ar || ""}
                      onChange={(e) =>
                        updateHeading("title", "ar", e.target.value)
                      }
                      fullWidth
                      sx={fieldSx}
                      inputProps={{ dir: "rtl" }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Description (EN)"
                      value={form.heading?.desc?.en || ""}
                      onChange={(e) =>
                        updateHeading("desc", "en", e.target.value)
                      }
                      fullWidth
                      multiline
                      rows={3}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Description (AR)"
                      value={form.heading?.desc?.ar || ""}
                      onChange={(e) =>
                        updateHeading("desc", "ar", e.target.value)
                      }
                      fullWidth
                      multiline
                      rows={3}
                      sx={fieldSx}
                      inputProps={{ dir: "rtl" }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    mb: 1,
                    fontWeight: 800,
                    color: "rgba(226,232,240,0.85)",
                  }}
                >
                  CTA
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Button Text (EN)"
                      value={form.cta?.text?.en || ""}
                      onChange={(e) => updateCtaText("en", e.target.value)}
                      fullWidth
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Button Text (AR)"
                      value={form.cta?.text?.ar || ""}
                      onChange={(e) => updateCtaText("ar", e.target.value)}
                      fullWidth
                      sx={fieldSx}
                      inputProps={{ dir: "rtl" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Button Link"
                      value={form.cta?.link || ""}
                      onChange={(e) => updateCtaLink(e.target.value)}
                      fullWidth
                      sx={fieldSx}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 900, color: "rgba(226,232,240,0.92)" }}
                >
                  Collage Items
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "rgba(226,232,240,0.65)",
                    mt: 0.5,
                  }}
                >
                  Manage the 3 images by selecting products + order + badge.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                onClick={addItem}
                sx={{ ...outlineBtnSx, borderRadius: 2.5 }}
              >
                + Add Item
              </Button>
            </Stack>

            <Divider sx={{ ...dividerSx, my: 2 }} />

            {!isProductsLoading && products.length === 0 && (
              <Typography sx={{ color: "rgb(239,68,68)", mb: 2 }}>
                No products found. Check your products/active endpoint response.
              </Typography>
            )}

            <Stack spacing={2}>
              {(form.items || []).map((item, idx) => {
                const productValue =
                  products.find(
                    (p) => String(p._id) === String(item.productId)
                  ) || null;

                const previewUrl = productValue?.mainImage?.secure_url;

                return (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: `1px solid ${border}`,
                      background: "rgba(2, 6, 23, 0.22)",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      gap={1.5}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      sx={{ mb: 1.5 }}
                    >
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Chip
                          label={`Item #${idx + 1}`}
                          sx={chipSx}
                          variant="outlined"
                        />
                        {!!(item.badge?.en || item.badge?.ar) && (
                          <Chip
                            label={item.badge?.en || item.badge?.ar}
                            sx={chipSx}
                          />
                        )}
                      </Stack>

                      <Button
                        color="error"
                        onClick={() => removeItem(idx)}
                        sx={{ borderRadius: 2 }}
                      >
                        Remove
                      </Button>
                    </Stack>

                    <Grid container spacing={2} alignItems="stretch">
                      <Grid item xs={12} md={7}>
                        <Autocomplete
                          options={products}
                          value={productValue}
                          loading={isProductsLoading}
                          getOptionLabel={(option) => option?.name || ""}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          onChange={(_, newValue) => {
                            const pid = newValue?._id || "";
                            updateItemField(idx, "productId", pid);

                            if (newValue?.discount) {
                              const v = `-${newValue.discount}%`;
                              updateItemBadge(idx, "en", v);
                              updateItemBadge(idx, "ar", v);
                            }
                          }}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              {...props}
                              sx={{
                                display: "flex",
                                gap: 1.5,
                                alignItems: "center",
                                py: 1,
                              }}
                            >
                              <Avatar
                                src={option?.mainImage?.secure_url}
                                variant="rounded"
                                sx={optionAvatarSx}
                              />
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 900,
                                    fontSize: 14,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color: "rgba(255,255,255,0.92)",
                                  }}
                                >
                                  {option.name}
                                </Typography>
                                {option?.price != null && (
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "rgba(226,232,240,0.65)",
                                    }}
                                  >
                                    Price: {option.price}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Search product by name"
                              fullWidth
                              sx={fieldSx}
                            />
                          )}
                        />

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Badge (EN)"
                              value={item.badge?.en || ""}
                              onChange={(e) =>
                                updateItemBadge(idx, "en", e.target.value)
                              }
                              fullWidth
                              sx={fieldSx}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Badge (AR)"
                              value={item.badge?.ar || ""}
                              onChange={(e) =>
                                updateItemBadge(idx, "ar", e.target.value)
                              }
                              fullWidth
                              sx={fieldSx}
                              inputProps={{ dir: "rtl" }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={5}>
                            <TextField
                              label="Order"
                              type="number"
                              value={item.order ?? 0}
                              onChange={(e) =>
                                updateItemField(
                                  idx,
                                  "order",
                                  Number(e.target.value)
                                )
                              }
                              fullWidth
                              sx={fieldSx}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <Stack
                          sx={{
                            height: "100%",
                            borderRadius: 3,
                            border: `1px dashed rgba(148,163,184,0.22)`,
                            p: 1.5,
                            justifyContent: "center",
                            alignItems: "center",
                            background: "rgba(2, 6, 23, 0.18)",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 900,
                              mb: 1,
                              color: "rgba(226,232,240,0.85)",
                            }}
                          >
                            Image Preview
                          </Typography>

                          <Box sx={previewFrameSx}>
                            {previewUrl ? (
                              <Box
                                component="img"
                                src={previewUrl}
                                alt="preview"
                                sx={previewImgSx}
                              />
                            ) : (
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  color: "rgba(226,232,240,0.65)",
                                }}
                                align="center"
                              >
                                Select a product to show its image
                              </Typography>
                            )}
                          </Box>

                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "rgba(226,232,240,0.55)",
                              mt: 1,
                            }}
                          >
                            Fixed size preview for consistent collage images.
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ ...dividerSx, my: 2 }} />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                sx={{ ...primaryBtnSx, px: 2.5 }}
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
