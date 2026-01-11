import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";
import { Box, Typography, Button, Container, Skeleton } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useTranslation } from "react-i18next";

export default function ExperienceHighlightSection() {
  const key = "experience-highlight";
  const { t, i18n } = useTranslation();

  const { data: section, isLoading, isError } = useQuery({
    queryKey: ["homeSection", key],
    queryFn: async () =>
      (await AxiosInstance.get(`api/home-sections/${key}`)).data.section,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4 }} />
        </Box>
      </Container>
    );
  }

  if (isError || !section) return null;

  const lang = i18n.language === "ar" ? "ar" : "en";

  const tr = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value?.[lang] ?? value?.en ?? value?.ar ?? "";
  };

  const imgSrc = section.image?.secure_url || "";

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
          gap: { xs: 3, md: 6 },
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
            position: "relative",
            height: { xs: 240, md: 360 },
            bgcolor: "#f3f4f6",
          }}
        >
          {imgSrc ? (
            <Box
              component="img"
              src={imgSrc}
              alt={tr(section.title) || t("common.sectionImageAlt")}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: "text.secondary",
                fontWeight: 600,
              }}
            >
              {t("common.noImage")}
            </Box>
          )}
        </Box>

        <Box sx={{ maxWidth: 520 }}>
          <Typography
            sx={{
              color: "warning.main",
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: 12,
              mb: 1,
              textTransform: "uppercase",
            }}
          >
            {tr(section.titleSmall)}
          </Typography>

          <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 36 }, mb: 2 }}>
            {tr(section.title)}
          </Typography>

          <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 2.5 }}>
            {tr(section.description)}
          </Typography>

          {!!tr(section.buttonText) && (
            <Button
              href={section.buttonLink || "#"}
              variant="text"
              endIcon={<ArrowRightAltIcon />}
              sx={{ fontWeight: 700, p: 0, minWidth: "unset" }}
            >
              {tr(section.buttonText)}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
