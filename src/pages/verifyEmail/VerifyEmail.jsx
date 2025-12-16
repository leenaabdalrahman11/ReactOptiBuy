import React from "react";
import { Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Check Your Email 📩
      </Typography>
      <Typography variant="body1">
        A verification link has been sent to your email. Please confirm your
        email address before logging in.
      </Typography>

      <Button
        variant="contained"
        size="medium"
        sx={{ mt: 3 }}
        onClick={handleGoToLogin}
      >
        Go to Login
      </Button>
    </Container>
  );
}
