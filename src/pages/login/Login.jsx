import React, { useState } from 'react'
import { Box, Container, TextField, Typography, Button, CircularProgress } from '@mui/material'
import style from './Login.module.css'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import LoginSchema from '../../validation/LoginSchema'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AxiosInstance from '../../api/AxiosInstance';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(LoginSchema)
    });

    const navigate = useNavigate();
    const {setIsLoggedIn} = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = async (data) => {
        console.log('RHF data:', data);
        try {

            setIsLoading(true);
            const payload = {
                email: data.email,
                password: data.password,
            };

            const res = await AxiosInstance.post('/auth/login', payload);
            localStorage.setItem("userToken", res.data.token);

            if (res.status == 200) {
                localStorage.setItem("userToken",res.data.token);
                navigate('/home');
            }
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message?.toLowerCase?.() || '';

            if (status === 400 && msg.includes('confirm your email')) {
                navigate('/verify-email', { state: { email: data.email } });
                return;
            }

            alert(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="login-form" >
            <Container maxWidth='lg' >
                <Typography className={style.LoginContent}>
                    <Typography className={style.LoginPage} mt={2} component={"h1"} variant='h4'>
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
              <Link component={RouterLink} to={'/forgot-password'} underline='none' color='inherit'>Forgot password !</Link>

                        <Button type="submit" size="medium" disabled={isLoading}>
                            {isLoading ? <CircularProgress size={22} color="secondary" /> : "Login"}
                        </Button>

                    </Box>
                </Typography>

            </Container>

        </Box>
    )
}
