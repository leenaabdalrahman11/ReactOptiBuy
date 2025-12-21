import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import styles from "./categories.module.css";
import Avatar from "@mui/material/Avatar";
import { Link, useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { Virtual, Autoplay } from "swiper/modules";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import AxiosInstance from "../../api/AxiosInstance";

export default function CategoriesDetails() {
  const { id } = useParams();
  console.log("category id:", id);
  const fetchCategoryDetails = async () => {
    const response = await AxiosInstance.get(`/categories/${id}`);
    return response.data;
  };
  const fetchSubCategoryDetails = async () => {
    const response = await AxiosInstance.get(`/subcategory/byCategory/${id}`);
    console.log("subcategories response:", response.data);
    return response.data;
  };

  const fetchProductsByCategory = async () => {
    const response = await AxiosInstance.get("/products/active");
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
    queryKey: ["categoryDetails", id],
    queryFn: fetchCategoryDetails,
    staleTime: 1000 * 60 * 5,
  });
  const {
    data: subCategoryData = [],
    isLoading: isSubCategoryLoading,
    isError: isSubCategoryError,
    error: subCategoryError,
  } = useQuery({
    queryKey: ["subCategoryDetails", id],
    queryFn: fetchSubCategoryDetails,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ["productsByCategory", id],
    queryFn: fetchProductsByCategory,
    staleTime: 1000 * 60 * 5,
  });
  if (isCategoryLoading || isProductsLoading) {
    return <CircularProgress />;
  }
  if (isCategoryError) {
    return <p>Error: {categoryError?.message || "Failed to load category."}</p>;
  }
  if (isProductsError) {
    return <p>Error: {productsError?.message || "Failed to load products."}</p>;
  }
  const categoryName = categoryData?.category?.name || "Category";
  const subCategory = subCategoryData?.subCategories || [];
  return (
    <Box textAlign="center" py={3}>
      <Typography component="h1" variant="h3" gutterBottom>
        {`Welcome to ${categoryName}`}
      </Typography>
      <Typography
        component="p"
        variant="body1"
        sx={{ maxWidth: 600, mx: "auto", mb: 3 }}
      >
        {`Take a look at our awesome collection in the ${categoryName} – stylish, trendy, and made just for you!`}
      </Typography>

      <Box className={styles.swiperContainer}>
        <Swiper
          modules={[Virtual, Autoplay]}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          spaceBetween={16}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            600: { slidesPerView: 3, spaceBetween: 15 },
            900: { slidesPerView: 5, spaceBetween: 18 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className={styles.categoriesSwiper}
        >
          {subCategory.map((cat, index) => (
            <SwiperSlide key={cat._id} virtualIndex={index}>
              <Card elevation={0} className={styles.categoryCard}>
                <Link
                  to={`/subcategory-details/${cat._id}`}
                  className={styles.categoryLink}
                >
                  <Avatar
                    className={styles.categoryAvatar}
                    alt={cat?.name || "category"}
                    src={cat?.image?.secure_url || ""}
                  />
                  <Typography variant="body1">{cat.name}</Typography>
                </Link>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <div dir="ltr" style={{ width: "100%" }}>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            freeMode={true}
            pagination={{
              clickable: true,
            }}
            modules={[FreeMode, Pagination]}
            className={styles.mySwiper}
          >
            {products.map((prod) => (
              <SwiperSlide key={prod._id}>
                <Link
                  to={`/product-details/${prod._id}`}
                  className={styles.prodSlideLink}
                >
                  <div className={styles.prodCard}>
                    <div className={styles.prodMedia}>
                      <img
                        src={prod?.mainImage?.secure_url || ""}
                        alt={prod.name}
                        className={styles.prodImg}
                        loading="lazy"
                      />
                      <div className={styles.prodGradient} />
                    </div>

                    <div className={styles.prodBody}>
                      <div className={styles.prodName}>{prod.name}</div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Box>
    </Box>
  );
}
