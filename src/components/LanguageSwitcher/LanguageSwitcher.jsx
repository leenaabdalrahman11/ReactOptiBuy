import { useEffect } from "react";
import i18n from "i18next";
import { Box, Switch, Typography } from "@mui/material";

function setDir(lang) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}

export function LanguageSwitcher() {
  useEffect(() => {
    setDir(i18n.language);

    const onLangChanged = (lng) => setDir(lng);
    i18n.on("languageChanged", onLangChanged);

    return () => i18n.off("languageChanged", onLangChanged);
  }, []);

  const isArabic = i18n.language === "ar";

  const handleChange = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.5,
        borderRadius: 20,
        backgroundColor: "#1F2428",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: !isArabic ? "#D97A2B" : "#9CA3AF",
        }}
      >
        EN
      </Typography>

      <Switch
        checked={isArabic}
        onChange={handleChange}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#D97A2B",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#D97A2B",
          },
        }}
      />

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: isArabic ? "#D97A2B" : "#9CA3AF",
        }}
      >
        AR
      </Typography>
    </Box>
  );
}
