import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import styles from "./Login.module.css";

import { useForm } from "react-hook-form";
import AxiosInstance from "../../api/AxiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import LoginSchema from "../../validation/LoginSchema";
import { useNavigate, useOutletContext, Link as RouterLink } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance.jsx";

import bg1 from "../../assets/login/1.jpg";
import bg2 from "../../assets/login/2.jpg";
import bg3 from "../../assets/login/3.jpg";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(LoginSchema) });

  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);

  const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBgIndex((i) => (i + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(t);
  }, [backgrounds.length]);

  const [showPassword, setShowPassword] = useState(false);

  const syncGuestCart = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    if (guestCart.length === 0) return;

    try {
      const requests = guestCart.map((item) =>
        AxiosUserInstance.post(
          "/cart",
          { productId: item.productId, quantity: item.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(requests);
      localStorage.removeItem("guestCart");
    } catch (err) {
      console.error("Sync guest cart error:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const payload = {
        email: data.email.trim(),
        password: data.password,
      };

      const res = await AxiosInstance.post("/auth/login", payload);

      localStorage.setItem("userToken", res.data.token);
      setIsLoggedIn(true);

      await syncGuestCart();
      navigate("/home");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message?.toLowerCase?.() || "";

      if (status === 400 && msg.includes("confirm your email")) {
        navigate("/verify-email", { state: { email: data.email } });
        return;
      }

      alert(err.response?.data?.message || "Login failed");
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
        sx={{ backgroundImage: `url(${backgrounds[(bgIndex + 1) % backgrounds.length]})` }}
      />

      <Box className={styles.overlay} />

      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.grid}>
          <Box className={styles.left}>
            <Typography className={styles.brand}>OptiBuy</Typography>
            <Typography className={styles.title}>
              Welcome back 
            </Typography>
            <Typography className={styles.subtitle}>
              Sign in to continue shopping, manage your cart, and track your orders.
            </Typography>

            <Box className={styles.pills}>
              <span className={styles.pill}>Fast checkout</span>
              <span className={styles.pill}>Secure payments</span>
              <span className={styles.pill}>Order tracking</span>
            </Box>
          </Box>

          <Box className={styles.card}>
            <Typography variant="h5" className={styles.cardTitle}>
              Login
            </Typography>
            <Typography className={styles.cardHint}>
              Use your email and password to access your account.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              <TextField
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
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
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
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

              <Box className={styles.row}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  underline="none"
                  className={styles.link}
                >
                  Forgot password?
                </Link>

                <Link
                  component={RouterLink}
                  to="/register"
                  underline="none"
                  className={styles.link}
                >
                  Create account
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={isLoading}
                className={styles.btn}
              >
                {isLoading ? <CircularProgress size={22} /> : "Login"}
              </Button>

              <Typography className={styles.footerText}>
                By continuing you agree to our{" "}
                <Link component={RouterLink} to="/terms" underline="hover" className={styles.inlineLink}>
                  Terms
                </Link>{" "}
                &{" "}
                <Link component={RouterLink} to="/privacy" underline="hover" className={styles.inlineLink}>
                  Privacy Policy
                </Link>
                .
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
