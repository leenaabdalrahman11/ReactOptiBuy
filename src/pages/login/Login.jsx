import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Link,
} from "@mui/material";
import style from "./Login.module.css";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../api/AxiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import LoginSchema from "../../validation/LoginSchema";
import {
  useNavigate,
  useOutletContext,
  Link as RouterLink,
} from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance.jsx";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);

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
          { headers: { Authorization: `Leena ${token}` } }
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
    <Box className="login-form">
      <Container maxWidth="lg">
        <Typography className={style.LoginContent}>
          <Typography
            className={style.LoginPage}
            mt={2}
            component={"h1"}
            variant="h4"
          >
            Login Page
          </Typography>
          <Box
            component="form"
            className={style.LoginForm}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              label="Email"
              type="email"
              variant="filled"
              className={style.Textfield}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
              onBlur={(e) => setValue("email", e.target.value.trim())}
            />

            <TextField
              label="Password"
              type="password"
              variant="filled"
              className={style.Textfield}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />

            <Link
              component={RouterLink}
              to={"/forgot-password"}
              underline="none"
              color="inherit"
            >
              Forgot password!
            </Link>

            <Button type="submit" size="medium" disabled={isLoading}>
              {isLoading ? (
                <CircularProgress size={22} color="secondary" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Typography>
      </Container>
    </Box>
  );
}
