import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import styles from "./Register.module.css";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RegisterSchema from "../../validation/RegisterSchema";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AxiosInstance from "../../api/AxiosInstance";

import bg1 from "../../assets/login/1.jpg";
import bg2 from "../../assets/login/2.jpg";
import bg3 from "../../assets/login/3.jpg";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBgIndex((i) => (i + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(t);
  }, [backgrounds.length]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setIsLoading(true);

      const payload = {
        userName: data.userName?.trim?.() ?? data.userName,
        email: data.email?.trim?.() ?? data.email,
        password: data.password,
        confirmpassword: data.confirmpassword,
      };

      const res = await AxiosInstance.post("/auth/register", payload);

      if (res.status >= 200 && res.status < 300) {
        navigate("/verify-email", { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setServerError(message);
      console.log(err.response?.status, err.response?.data);
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
            <Typography className={styles.title}>Create your account </Typography>
            <Typography className={styles.subtitle}>
              Join us to save your favorites, manage orders, and enjoy a smoother checkout.
            </Typography>

            <Box className={styles.pills}>
              <span className={styles.pill}>Wishlist</span>
              <span className={styles.pill}>Exclusive offers</span>
              <span className={styles.pill}>Faster checkout</span>
            </Box>
          </Box>

          <Box className={styles.card}>
            <Typography variant="h5" className={styles.cardTitle}>
              Register
            </Typography>
            <Typography className={styles.cardHint}>
              Fill the details below to create a new account.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              {serverError && (
                <Typography className={styles.serverError}>
                  {serverError}
                </Typography>
              )}

              <TextField
                label="User Name"
                type="text"
                fullWidth
                error={!!errors.userName}
                helperText={errors.userName?.message}
                {...register("userName")}
                onBlur={(e) => setValue("userName", e.target.value.trim())}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

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
                autoComplete="new-password"
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

              <TextField
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                fullWidth
                autoComplete="new-password"
                error={!!errors.confirmpassword}
                helperText={errors.confirmpassword?.message}
                {...register("confirmpassword")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end">
                        {showConfirm ? (
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
                type="submit"
                variant="contained"
                disableElevation
                disabled={isLoading}
                className={styles.btn}
              >
                {isLoading ? <CircularProgress size={22} /> : "Create account"}
              </Button>

              <Typography className={styles.footerText}>
                Already have an account?{" "}
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
