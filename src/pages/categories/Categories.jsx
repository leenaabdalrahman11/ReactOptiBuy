import { Box, Card, CardMedia, CircularProgress, Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/virtual';
import { Link } from 'react-router';
import AxiosInstance from '../../api/AxiosInstance';
export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const getCategories = async () => {
        try {
            const response = await AxiosInstance.get(`/categories/active`);
            setCategories(response.data.categories);
            console.log(response.data.categories);
        } catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);
    if (isLoading) {
        return (
            <CircularProgress />
        )
    }
    return (
        <Box py={2} textAlign="center">
            <Typography variant='h5' component={'h2'}>
                Categories
            </Typography>
            <Box mt={4}>
                <Swiper
                    modules={[Virtual, Autoplay]}
                    loop={true}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    spaceBetween={16}
                    slidesPerView={4}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 10 },
                        600: { slidesPerView: 3, spaceBetween: 15 },
                        900: { slidesPerView: 4, spaceBetween: 18 },
                        1200: { slidesPerView: 4, spaceBetween: 20 },
                    }}
                    style={{ padding: "10px 0" }}
                >
                    {categories.map((cat, index) => (
                        <SwiperSlide key={cat._id} virtualIndex={index}>
                            <Card sx={{ p: 2, textAlign: 'center' }} elevation={0}>
                                <Link to={`/category-details/${cat._id}`} >
                                    <Avatar
                                        sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}
                                        alt={cat?.name || 'category'}
                                        src={cat?.image?.secure_url || ''}
                                    />
                                    <Typography variant="body1">{cat.name}</Typography>

                                </Link>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

        </Box>
    )
}
