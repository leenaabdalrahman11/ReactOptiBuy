import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./WhyChooseUs.module.css";

export default function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
        <Typography variant="h4" component="h2" className={styles.title}>
          {t("whyChooseUs.title")}
        </Typography>

        <Typography className={styles.subtitle}>
          {t("whyChooseUs.subtitle")}
        </Typography>
      </Box>

      <Box className={styles.row}>
        <Box className={styles.card}>
          <Typography variant="h6" className={styles.cardTitle}>
            {t("whyChooseUs.cards.quality.title")}
          </Typography>
          <Typography className={styles.cardText}>
            {t("whyChooseUs.cards.quality.text")}
          </Typography>
        </Box>

        <Box className={styles.card}>
          <Typography variant="h6" className={styles.cardTitle}>
            {t("whyChooseUs.cards.price.title")}
          </Typography>
          <Typography className={styles.cardText}>
            {t("whyChooseUs.cards.price.text")}
          </Typography>
        </Box>

        <Box className={styles.card}>
          <Typography variant="h6" className={styles.cardTitle}>
            {t("whyChooseUs.cards.variety.title")}
          </Typography>
          <Typography className={styles.cardText}>
            {t("whyChooseUs.cards.variety.text")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
