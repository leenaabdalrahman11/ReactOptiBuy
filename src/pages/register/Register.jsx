import React, { useState } from 'react'
import { Box, Container, TextField, Typography, Button, CircularProgress } from '@mui/material'
import style from './Register.module.css'
import { useForm } from 'react-hook-form'
import axios from 'axios';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading,setIsLoading] = useState(false);
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
            const res = await axios.post('http://localhost:3000/auth/register', payload);
            console.log(res.data);
        } catch (err) {
            console.log(err.response?.status, err.response?.data);
        }finally{
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
                        <TextField {...register('userName',{required:"Name is required"})} type='text' className={style.Textfield} label="User Name" variant="outlined" 
                        errors={errors.userName}
                        helperText={errors.userName?.message}
                        />
                        <TextField  {...register('email')} type='email' className={style.Textfield} label="Email" variant="filled" />
                        <TextField  {...register('password')} type='password' className={style.Textfield} label="Password" variant="filled" />
                        <TextField  {...register('confirmpassword')} type='password' className={style.Textfield} label="Confirm Password" variant="filled" />
                        <Button type='submit' size='medium' disabled={isLoading}>
                            {isLoading?<CircularProgress color="secondary" /> : "register"}</Button>
                    </Box>
                </Typography>

            </Container>

        </Box>
    )
}
