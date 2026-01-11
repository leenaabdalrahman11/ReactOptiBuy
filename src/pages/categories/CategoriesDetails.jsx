import {
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import styles from "./categoriesDetails.module.css";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode, Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import "swiper/css";
import "swiper/css/pagination";
import AxiosInstance from "../../api/AxiosInstance";

export default function CategoriesDetails() {
  const { id } = useParams();

  const fetchCategoryDetails = async () => {
    const response = await AxiosInstance.get(`/categories/${id}`);
    return response.data;
  };

  const fetchSubCategoryDetails = async () => {
    const response = await AxiosInstance.get(`/subcategory/byCategory/${id}`);
    return response.data;
  };

  const fetchProductsByCategory = async () => {
    const response = await AxiosInstance.get("/products/active");
    const filtered = response.data.products.filter((prod) => prod.CategoryId === id);
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

  if (isCategoryLoading || isProductsLoading || isSubCategoryLoading) {
    return (
      <Box className={styles.centerLoading}>
        <CircularProgress />
      </Box>
    );
  }

  if (isCategoryError) return <p>Error: {categoryError?.message || "Failed to load category."}</p>;
  if (isSubCategoryError) return <p>Error: {subCategoryError?.message || "Failed to load subcategories."}</p>;
  if (isProductsError) return <p>Error: {productsError?.message || "Failed to load products."}</p>;

  const category = categoryData?.category;
  const categoryName = category?.name || "Category";
  const heroImage =
    category?.image?.secure_url ||
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop";

  const subCategory = subCategoryData?.subCategories || [];

  return (
    <Box className={styles.page}>
      <Box
        className={styles.hero}
        sx={{ backgroundImage: `url(${heroImage})` }}
        aria-label="category hero"
      >
        <div className={styles.heroOverlay} />
        <Container maxWidth="lg" className={styles.heroInner}>
          <Typography className={styles.heroTitle}>{categoryName}</Typography>
          <Typography className={styles.heroSubtitle}>
            Explore our collection and discover the best items in {categoryName}.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" className={styles.section}>
        <Box className={styles.sectionCard}>
          <Grid container spacing={2}>
            {subCategory.map((cat) => (
              <Grid item xs={6} sm={4} md={3} key={cat._id}>
                <Link to={`/subcategory-details/${cat._id}`} className={styles.subLink}>
                  <Card className={styles.subTile} elevation={0}>
                    <div className={styles.subIconWrap}>
                      <img
                        src={cat?.image?.secure_url || ""}
                        alt={cat?.name || "subcategory"}
                        className={styles.subIcon}
                        loading="lazy"
                      />
                    </div>
                    <Typography className={styles.subName}>{cat?.name}</Typography>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Box>
        <div className={styles.popularBg} />
          <Box className={styles.popularBanner}>
            <Typography className={styles.popularTitle}>POPULAR ITEMS</Typography>
          </Box>
      </Box>

      <Container maxWidth="lg" className={styles.productsSection}>
        <Swiper
          slidesPerView={4}
          spaceBetween={24}
          freeMode={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination, Autoplay]}
          breakpoints={{
    0:   { slidesPerView: 1.2, spaceBetween: 12 },
    480: { slidesPerView: 2,   spaceBetween: 14 },
    900: { slidesPerView: 3,   spaceBetween: 18 },
    1200:{ slidesPerView: 4,   spaceBetween: 20 },
          }}
          className={styles.productsSwiper}
        >
          {products.map((prod) => (
            <SwiperSlide key={prod._id}>
              <Link to={`/product-details/${prod._id}`} className={styles.prodLink}>
                <div className={styles.prodCard}>
                  <div className={styles.prodMedia}>
                    <img
                      src={prod?.mainImage?.secure_url || ""}
                      alt={prod?.name}
                      className={styles.prodImg}
                      loading="lazy"
                    />
                  </div>

                  <div className={styles.prodBody}>
                    <div className={styles.prodName}>{prod?.name}</div>
                    {!!prod?.price && (
                      <div className={styles.prodPrice}>{prod.price} ₪</div>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
}
