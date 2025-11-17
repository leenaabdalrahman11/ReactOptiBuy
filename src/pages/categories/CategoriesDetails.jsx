import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import { EffectCoverflow, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import AxiosInstance from '../../api/AxiosInstance';

export default function CategoriesDetails() {
    const { id } = useParams();
    console.log(id);
    const [categoryDetails, setCategoryDetails] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const getCategories = async () => {
        try {
            const response = await AxiosInstance.get(`/categories/${id}`);
            setCategoryDetails(response.data.category);
            console.log(response.data.category);
        } catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    }
    const getProducts = async () => {
        try {
            const response = await AxiosInstance.get('/products/active');
            const filtered = response.data.products.filter(
                (prod) => prod.CategoryId === id
            );
            setProducts(filtered);
            console.log(filtered);
        } catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getCategories();
        getProducts();
    }, [id]);
    if (isLoading) {
        return (
            <CircularProgress />
        )
    }
    return (
        <>
            <Box textAlign="center">
                <Typography component={'h1'} variant='h3'>
                    {`welcome to ${categoryDetails?.name || ''}`}
                </Typography>
                <Typography component={'p'} variant='p'>
                    {`Take a look at our awesome collection in the ${categoryDetails.name} 
              stylesh , trendy , and made just for you !
           `}

                </Typography>


                <Swiper
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    slidesPerView="auto"
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination
                    modules={[EffectCoverflow, Pagination]}
                    className="mySwiper"
                    style={{ padding: '20px 0' }}
                    breakpoints={{
                        0: { spaceBetween: 8 },
                        600: { spaceBetween: 12 },
                        900: { spaceBetween: 16 },
                        1200: { spaceBetween: 24 },
                    }}
                >
                    
                    {products.map((prod) => (
                        <Link to={'/hom'}>
                        <SwiperSlide
                            key={prod._id}
                            style={{ width: 'min(85vw, 280px)' }}   
                        >
                            <img
                                src={prod?.mainImage?.secure_url || ''}
                                alt={prod.name}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    height: 'clamp(220px, 40vw, 360px)', 
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                }}
                            />
                            <div>
                                <h3 style={{ marginTop: 8, fontSize: 'clamp(14px, 2.5vw, 18px)' }}>
                                    {prod.name}
                                </h3>
                            </div>
                        </SwiperSlide>                        
                        </Link>

                    ))}
                </Swiper>

            </Box>


        </>
    )
}
