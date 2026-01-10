import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#ffffffff",
    },
  },

typography: {
  fontFamily: `"Poppins"`,

    h1: {
      fontSize: "3rem",
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.4rem",
      fontWeight: 800,
      lineHeight: 1.15,
    },
    h3: {
      fontSize: "1.9rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.2rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },

    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.85rem",
      lineHeight: 1.6,
      opacity: 0.85,
    },

    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "0.03em",
    },
  },
});

export default theme;

