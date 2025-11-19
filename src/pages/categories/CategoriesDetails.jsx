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
  console.log('category id:', id);
  // 1) Fetch category details
  const fetchCategoryDetails = async () => {
    const response = await AxiosInstance.get(`/categories/${id}`);
    return response.data;
  };

  // 2) Fetch products for this category
  const fetchProductsByCategory = async () => {
    const response = await AxiosInstance.get('/products/active');
    const filtered = response.data.products.filter(
      (prod) => prod.CategoryId === id
    );
    return filtered;
  };
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useQuery({
    queryKey: ['categoryDetails', id],
    queryFn: fetchCategoryDetails,
    staleTime: 1000 * 60 * 5,
  });
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ['productsByCategory', id],
    queryFn: fetchProductsByCategory,
    staleTime: 1000 * 60 * 5,
  });
  if (isCategoryLoading || isProductsLoading) {
    return <CircularProgress />;
  }
  if (isCategoryError) {
    return <p>Error: {categoryError?.message || 'Failed to load category.'}</p>;
  }
  if (isProductsError) {
    return <p>Error: {productsError?.message || 'Failed to load products.'}</p>;
  }
  const categoryName = categoryData?.category?.name || 'Category';
  return (
    <Box textAlign="center" py={3}>
      <Typography component="h1" variant="h3" gutterBottom>
        {`Welcome to ${categoryName}`}
      </Typography>
      <Typography component="p" variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
        {`Take a look at our awesome collection in the ${categoryName} – stylish, trendy, and made just for you!`}
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
          <SwiperSlide
            key={prod._id}
            style={{ width: 'min(85vw, 280px)' }}
          >
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
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
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}