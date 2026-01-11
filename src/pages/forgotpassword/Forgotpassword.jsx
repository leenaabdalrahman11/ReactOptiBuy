import { Container, TextField, Button, Alert, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../api/AxiosInstance";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setMsg("");
    try {
      const res = await AxiosInstance.post("/auth/sendCode", data);
      setMsg(res.data.message);
      navigate("/reset-password");
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 15 }}>
      {msg && <Alert sx={{ mb: 2 }}>{msg}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "grid", gap: 2 }}
      >
        <TextField label="Email" {...register("email")} required />
        <Button variant="contained" type="submit">
          Send Code
        </Button>
      </Box>
    </Container>
  );
}
