import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail.jsx";
import ForgotPassword from "./pages/forgotpassword/Forgotpassword";
import ResetPassword from "./pages/forgotpassword/ResetPassword";
import Categories from "./pages/categories/Categories";
import CategoriesDetails from "./pages/categories/CategoriesDetails.jsx";
import ProtectdRouter from "./components/Protected/ProtectdRouter";
import ProductsDetails from "./pages/productsDetails/ProductsDetails";
import Order from "./pages/order/Order";
import MyOrders from "./pages/order/MyOrder";
import DashboardLayout from "./layout/DashboardLayout";
import AdminProtectedRouter from "./components/Protected/AdminProtectedRouter";
import DashboardHome from "./pages/dashboard/DashboardHome";
import UsersList from "./pages/dashboard/UsersList";
import AdminProducts from "./pages/dashboard/AdminProducts";
import EditProducts from "./pages/dashboard/EditProducts";
import CreateProduct from "./pages/dashboard/CreateProduct";
import AdminCategories from "./pages/dashboard/AdminCategories";
import EditCategory from "./pages/dashboard/EditCategory";
import CreateCategory from "./pages/dashboard/CreateCategory";
import CreateSubCategory from "./pages/dashboard/CreateSubCatgory";
import AdminSubCategory from "./pages/dashboard/AdminSubCategory";
import EditSubCategory from "./pages/dashboard/EditSubCategory";
import CreateAdminSubCategory from "./pages/dashboard/CreateAdminSubCategory";
import AdminOrders from "./pages/dashboard/AdminOrders";
import CreateUsers from "./pages/dashboard/CreateUsers";
import EditUser from "./pages/dashboard/EditUser";
import FeaturedProducts from "./pages/products/FeaturedProducts.jsx";
import subCategories from "./pages/subCategories/subCategories.jsx";
import DashboardHomeTag from "./pages/dashboard/DashboardHomeTag.jsx";
import UserOrder from "./pages/order/UserOreder.jsx";
import SubCategories from "./pages/subCategories/subCategories.jsx";
import EditPromoSection from "./pages/dashboard/EditPromoSection.jsx";
import ProductsPage from "./pages/products/ProductsPage.jsx";
import EditExperienceHighlight from "./pages/dashboard/EditExperienceHighlight.jsx";
import CreateCoupon from "./pages/dashboard/CreateCoupon.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
      { path:"products-page", element:<ProductsPage/>},

      {
        path: "profile",
        element: (
          <ProtectdRouter>
            <Profile />
          </ProtectdRouter>
        ),
      },
      {
        path: "order",
        element: (
          <ProtectdRouter>
            <Order />
          </ProtectdRouter>
        ),
      },
      {
        path: "userOrder",
        element: (
          <ProtectdRouter>
            <UserOrder />
          </ProtectdRouter>
        ),
      },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "categories", element: <Categories /> },
      { path: "category-details/:id", element: <CategoriesDetails /> },
      { path: "subcategory-details/:id", element: <SubCategories /> },
      { path: "product-details/:id", element: <ProductsDetails /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AdminProtectedRouter>
        <DashboardLayout />
      </AdminProtectedRouter>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "users", element: <UsersList /> },
      { path: "products", element: <AdminProducts /> },
      { path: "categories", element: <AdminCategories /> },
      {
        path: "products/update/:id",
        element: <EditProducts />,
        errorElement: <h1>Oops! Something went wrong.</h1>,
      },
      {
        path: "categories/update/:id",
        element: <EditCategory />,
        errorElement: <h1>Oops! Something went wrong.</h1>,
      },
      {
        path: "products/create",
        element: <CreateProduct />,
      },
      {
        path: "categories/create",
        element: <CreateCategory />,
      },
      {
        path: "create-subcategory",
        element: <CreateSubCategory />,
      },
      {
        path: "subcategory",
        element: <AdminSubCategory />,
      },
      {
        path: "adminsubcategory/create",
        element: <CreateAdminSubCategory />,
      },
      {
        path: "subcategories/update/:id",
        element: <EditSubCategory />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users/create",
        element: <CreateUsers />,
      },
      {
        path: "users/:id",
        element: <EditUser />,
      },
      {
        path: "myorders",
        element: (
          <ProtectdRouter>
            <MyOrders />
          </ProtectdRouter>
        ),
      },
      {
        path: "tags",
        element: (
          <ProtectdRouter>
            <DashboardHomeTag />
          </ProtectdRouter>
        ),
      },
      {
        path: "promo-section/:key",
        element: (
          <ProtectdRouter>
            <EditPromoSection />
          </ProtectdRouter>
        ),
      },{
        path:"home-section",
        element:(
          <ProtectdRouter>
            <EditExperienceHighlight />
          </ProtectdRouter>
        )
      },{
        path:"coupons",
                element:(
          <ProtectdRouter>
            <CreateCoupon />
          </ProtectdRouter>
        )
      }
    ],
  },
]);

export default router;
