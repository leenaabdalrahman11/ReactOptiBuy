import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance.jsx";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";

export default function PromoCollageSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  const tr = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    return v?.[lang] ?? v?.en ?? v?.ar ?? "";
  };

  const fetchSection = async () => {
    const { data } = await AxiosInstance.get(`/api/promo-sections/featured-collage`);
    return data.section;
  };

  const { data: section, isLoading, isError } = useQuery({
    queryKey: ["homeSection", "featured-collage"],
    queryFn: fetchSection,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading || isError || !section) return null;

  const items = [...(section.items || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 0 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1.05fr" },
        gap: { xs: 3, md: 5 },
        alignItems: "center",
      }}
    >
      <Box sx={{ maxWidth: 560 }}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2.2,
            color: "text.secondary",
            fontWeight: 800,
          }}
        >
          {tr(section.heading?.small)}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            mt: 1,
            lineHeight: 1.1,
            letterSpacing: -0.2,
          }}
        >
          {tr(section.heading?.title)}
        </Typography>

        <Typography
          sx={{
            mt: 1.5,
            color: "text.secondary",
            lineHeight: 1.75,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {tr(section.heading?.desc)}
        </Typography>

        {!!tr(section.cta?.text) && (
          <Button
            href={section.cta?.link || "#"}
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 2.5,
              textTransform: "none",
              fontWeight: 800,
              borderRadius: 2.5,
              px: 1.5,
              py: 0.75,
              minWidth: "unset",
              alignSelf: "flex-start",
            }}
          >
            {tr(section.cta?.text)}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: { xs: "180px 180px", sm: "220px 220px" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {items.slice(0, 3).map((it, idx) => {
          const img = it.image?.url || "";
          const badgeText = tr(it.badge);

          return (
            <Box
              key={idx}
              component="a"
              href={it.buttonLink || "#"}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                textDecoration: "none",
                backgroundColor: "rgba(2, 6, 23, 0.06)",

                ...(idx === 0 && { gridColumn: "1 / 2", gridRow: "1 / 2" }),
                ...(idx === 1 && { gridColumn: "1 / 2", gridRow: "2 / 3" }),
                ...(idx === 2 && { gridColumn: "2 / 3", gridRow: "1 / 3" }),

                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  transition: "transform .35s ease",
                },
                "&:hover img": { transform: "scale(1.05)" },

                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
                  pointerEvents: "none",
                },
              }}
            >
              {img ? (
                <img src={img} alt={t("common.promoAlt", "promo")} loading="lazy" />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    color: "text.secondary",
                    fontWeight: 800,
                    zIndex: 1,
                  }}
                >
                  {t("common.noImage", "No image")}
                </Box>
              )}

              {!!badgeText && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: 12,
                    fontWeight: 900,
                    bgcolor: "rgba(15, 23, 42, 0.75)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(8px)",
                    zIndex: 2,
                    maxWidth: "80%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {badgeText}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
