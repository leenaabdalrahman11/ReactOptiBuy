import React, { useState } from 'react'
import { Box, Container, TextField, Typography, Button, CircularProgress } from '@mui/material'
import style from './Register.module.css'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import RegisterSchema from '../../validation/RegisterSchema'
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../api/AxiosInstance';
export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(RegisterSchema)
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const onSubmit = async (data) => {
        console.log('RHF data:', data);
        try {

            setIsLoading(true);
            const payload = {
                userName: data.userName,
                email: data.email,
                password: data.password,
                confirmpassword: data.confirmpassword,
            };
            const res = await AxiosInstance.post('/auth/register', payload);
            console.log(res.data);
            if (res.status >= 200 && res.status < 300) {
                     navigate('/verify-email', { replace: true });
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
        <Box className="register-form" >
            <Container maxWidth='lg' >

                <Typography className={style.RegisterContent}>
                    <Typography className={style.Registerpage} mt={2} component={"h1"} variant='h4'>
                        Register Page
                    </Typography>


                    <Box component={"form"} className={style.RegiserForm} onSubmit={handleSubmit(onSubmit)}>
                         {serverError && (
  <Typography color="error" sx={{ mb: 2 }}>
    {serverError}
  </Typography>
)}
                        <TextField
                            {...register('userName')}
                            type="text"
                            className={style.Textfield}
                            label="User Name"
                            variant="outlined"
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                        />

                        <TextField
                            {...register('email')}
                            type="email"
                            className={style.Textfield}
                            label="Email"
                            variant="filled"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            {...register('password')}
                            type="password"
                            className={style.Textfield}
                            label="Password"
                            variant="filled"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <TextField
                            {...register('confirmpassword')}
                            type="password"
                            className={style.Textfield}
                            label="Confirm Password"
                            variant="filled"
                            error={!!errors.confirmpassword}
                            helperText={errors.confirmpassword?.message}
                        />
                        <Button type='submit' size='medium' disabled={isLoading}>
                            {isLoading ? <CircularProgress color="secondary" /> : "register"}</Button>
                    </Box>
                </Typography>

            </Container>

        </Box>
    )
}
