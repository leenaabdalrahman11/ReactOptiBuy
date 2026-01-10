import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function EditExperienceHighlight() {
  const key = "experience-highlight";
  const qc = useQueryClient();

  const [form, setForm] = React.useState({
    titleSmall_en: "",
    titleSmall_ar: "",
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    buttonText_en: "",
    buttonText_ar: "",
    buttonLink: "",
    image: null,
    preview: "",
  });

  const [error, setError] = React.useState("");

  const accent = "#22d3ee";
  const bg = "#070B12";
  const panel = "rgba(15, 23, 42, 0.55)";
  const border = "rgba(148, 163, 184, 0.12)";
  const grid = "rgba(148, 163, 184, 0.08)";

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

  const glassCardSx = {
    background: `linear-gradient(180deg, ${panel} 0%, rgba(15, 23, 42, 0.35) 100%)`,
    border: `1px solid ${border}`,
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    borderRadius: 3,
    backdropFilter: "blur(10px)",
  };

  const dividerSx = { borderColor: "rgba(148,163,184,0.12)" };

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

  const {
    data: section,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["homeSection", key],
    queryFn: async () =>
      (await AxiosInstance.get(`/api/home-sections/${key}`)).data.section,
  });

  React.useEffect(() => {
    if (!section) return;

    setForm({
      titleSmall_en: section.titleSmall?.en || "",
      titleSmall_ar: section.titleSmall?.ar || "",
      title_en: section.title?.en || "",
      title_ar: section.title?.ar || "",
      description_en: section.description?.en || "",
      description_ar: section.description?.ar || "",
      buttonText_en: section.buttonText?.en || "",
      buttonText_ar: section.buttonText?.ar || "",
      buttonLink: section.buttonLink || "",
      image: null,
      preview: section.image?.secure_url || "",
    });
  }, [section]);

  React.useEffect(() => {
    return () => {
      if (form.preview?.startsWith("blob:")) URL.revokeObjectURL(form.preview);
    };
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      setError("");

      const missing = [];
      if (!form.title_en) missing.push("Title (EN)");
      if (!form.title_ar) missing.push("Title (AR)");
      if (!form.description_en) missing.push("Description (EN)");
      if (!form.description_ar) missing.push("Description (AR)");

      if (missing.length) {
        setError(`Please fill: ${missing.join(", ")}`);
        throw new Error("Validation error");
      }

      const fd = new FormData();
      fd.append("titleSmall_en", form.titleSmall_en);
      fd.append("titleSmall_ar", form.titleSmall_ar);
      fd.append("title_en", form.title_en);
      fd.append("title_ar", form.title_ar);
      fd.append("description_en", form.description_en);
      fd.append("description_ar", form.description_ar);
      fd.append("buttonText_en", form.buttonText_en);
      fd.append("buttonText_ar", form.buttonText_ar);
      fd.append("buttonLink", form.buttonLink);
      if (form.image) fd.append("image", form.image);

      return AxiosUserInstance.put(`/api/home-sections/${key}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["homeSection", key] });
    },
    onError: (err) => {
      if (err?.message === "Validation error") return;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save changes";
      setError(msg);
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ ...pageWrapSx, display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: accent }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={pageWrapSx}>
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 1100, mx: "auto" }}>
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              backgroundColor: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "rgba(255,255,255,0.9)",
              "& .MuiAlert-icon": { color: "rgb(239,68,68)" },
            }}
          >
            {queryError?.message || "Failed to load section"}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={pageWrapSx}>
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 1100, mx: "auto" }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
            Edit Highlight Section
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
            Admin can change image, title, description and button.
          </Typography>
        </Box>

        <Card sx={glassCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.22)",
                  color: "rgba(255,255,255,0.9)",
                  "& .MuiAlert-icon": { color: "rgb(239,68,68)" },
                }}
              >
                {error}
              </Alert>
            )}

            <Divider sx={{ ...dividerSx, mb: 2 }} />

            <Box sx={{ display: "grid", gap: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Small Title (EN)"
                  value={form.titleSmall_en}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, titleSmall_en: e.target.value }))
                  }
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Small Title (AR)"
                  value={form.titleSmall_ar}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, titleSmall_ar: e.target.value }))
                  }
                  fullWidth
                  sx={fieldSx}
                  inputProps={{ dir: "rtl" }}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Title (EN)"
                  value={form.title_en}
                  onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Title (AR)"
                  value={form.title_ar}
                  onChange={(e) => setForm((p) => ({ ...p, title_ar: e.target.value }))}
                  fullWidth
                  sx={fieldSx}
                  inputProps={{ dir: "rtl" }}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Description (EN)"
                  value={form.description_en}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description_en: e.target.value }))
                  }
                  fullWidth
                  multiline
                  minRows={4}
                  sx={fieldSx}
                />
                <TextField
                  label="Description (AR)"
                  value={form.description_ar}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description_ar: e.target.value }))
                  }
                  fullWidth
                  multiline
                  minRows={4}
                  sx={fieldSx}
                  inputProps={{ dir: "rtl" }}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Button Text (EN)"
                  value={form.buttonText_en}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, buttonText_en: e.target.value }))
                  }
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Button Text (AR)"
                  value={form.buttonText_ar}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, buttonText_ar: e.target.value }))
                  }
                  fullWidth
                  sx={fieldSx}
                  inputProps={{ dir: "rtl" }}
                />
              </Box>

              <TextField
                label="Button Link"
                value={form.buttonLink}
                onChange={(e) =>
                  setForm((p) => ({ ...p, buttonLink: e.target.value }))
                }
                fullWidth
                sx={fieldSx}
              />

              <Divider sx={{ ...dividerSx, my: 0.5 }} />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button variant="outlined" component="label" sx={outlineBtnSx}>
                  Upload Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setForm((prev) => {
                        if (prev.preview?.startsWith("blob:")) {
                          URL.revokeObjectURL(prev.preview);
                        }
                        return {
                          ...prev,
                          image: file,
                          preview: URL.createObjectURL(file),
                        };
                      });
                    }}
                  />
                </Button>

                {!!form.preview && (
                  <Box
                    component="img"
                    src={form.preview}
                    alt="preview"
                    sx={{
                      width: 240,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 3,
                      border: `1px solid ${border}`,
                      boxShadow: "0 18px 55px rgba(0,0,0,0.45)",
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                  sx={{ ...primaryBtnSx, px: 3 }}
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  variant="outlined"
                  sx={outlineBtnSx}
                  onClick={() =>
                    setForm((p) => {
                      if (p.preview?.startsWith("blob:")) URL.revokeObjectURL(p.preview);
                      return {
                        ...p,
                        image: null,
                        preview: section?.image?.secure_url || p.preview,
                      };
                    })
                  }
                >
                  Clear New Image
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
