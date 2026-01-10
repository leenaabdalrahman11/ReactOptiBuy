import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Alert,
  Typography,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AxiosInstance from "../../api/AxiosInstance";

import styles from "./ResetPassword.module.css";

import bg1 from "../../assets/login/1.jpg";
import bg2 from "../../assets/login/2.jpg";
import bg3 from "../../assets/login/3.jpg";

export default function ResetPassword() {
  const { register, handleSubmit, setValue } = useForm();
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBgIndex((i) => (i + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(t);
  }, [backgrounds.length]);

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setMsg("");
    setSeverity("info");

    try {
      setIsLoading(true);

      const payload = {
        email: data.email?.trim?.() ?? data.email,
        code: data.code?.trim?.() ?? data.code,
        newPassword: data.newPassword,
      };

      const res = await AxiosInstance.patch("/auth/resetPassword", payload);
      setSeverity("success");
      setMsg(res.data.message || "Password reset successfully");

      navigate("/login");
    } catch (err) {
      setSeverity("error");
      setMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={styles.page}>
      <Box
        className={`${styles.bg} ${styles.bgA}`}
        sx={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
      />
      <Box
        className={`${styles.bg} ${styles.bgB}`}
        sx={{
          backgroundImage: `url(${
            backgrounds[(bgIndex + 1) % backgrounds.length]
          })`,
        }}
      />

      <Box className={styles.overlay} />

      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.grid}>
          <Box className={styles.left}>
            <Typography className={styles.brand}>OptiBuy</Typography>
            <Typography className={styles.title}>Reset your password 🔐</Typography>
            <Typography className={styles.subtitle}>
              Enter your email and the verification code, then set a new password.
            </Typography>

            <Box className={styles.pills}>
              <span className={styles.pill}>Secure</span>
              <span className={styles.pill}>Fast</span>
              <span className={styles.pill}>Easy</span>
            </Box>
          </Box>

          <Box className={styles.card}>
            <Typography variant="h5" className={styles.cardTitle}>
              Reset Password
            </Typography>
            <Typography className={styles.cardHint}>
              We’ll update your password once you submit the correct code.
            </Typography>

            {msg && (
              <Alert severity={severity} className={styles.alert}>
                {msg}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              className={styles.form}
              noValidate
            >
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                {...register("email")}
                onBlur={(e) => setValue("email", e.target.value.trim())}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Code"
                fullWidth
                required
                {...register("code")}
                onBlur={(e) => setValue("code", e.target.value.trim())}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                {...register("newPassword")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                type="submit"
                disableElevation
                disabled={isLoading}
                className={styles.btn}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <Typography className={styles.footerText}>
                Back to{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  className={styles.inlineLink}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
