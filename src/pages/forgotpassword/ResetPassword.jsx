import { Container, TextField, Button, Alert, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { register, handleSubmit } = useForm();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setMsg("");
    try {
      const res = await axios.patch("http://localhost:3000/auth/resetPassword", data);
      setMsg(res.data.message);
      navigate('/login');
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {msg && <Alert sx={{ mb: 2 }}>{msg}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2 }}>
        <TextField label="Email" {...register("email")} required />
        <TextField label="Code" {...register("code")} required />
        <TextField label="New Password" type="password" {...register("newPassword")} required />
        <Button variant="contained" type="submit">Reset Password</Button>
      </Box>
    </Container>
  );
}
