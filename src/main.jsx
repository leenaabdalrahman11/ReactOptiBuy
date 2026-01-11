import "./i18n";
import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import i18n from "i18next";

import App from "./App.jsx";
import baseTheme from "./style/theme.js";

const cache = createCache({ key: "mui" });

function Root() {
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const apply = (lng) => {
      setLang(lng);
      document.documentElement.lang = lng;
      document.documentElement.dir = "ltr"; 
    };

    apply(lang);
    i18n.on("languageChanged", apply);
    return () => i18n.off("languageChanged", apply);
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      ...baseTheme,
      direction: "ltr", 
    });
  }, []);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
