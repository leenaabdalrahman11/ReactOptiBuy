import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import VerifyEmail from "./pages/verifyEmail/verifyEmail";
import ForgotPassword from "./pages/forgotpassword/Forgotpassword";
import ResetPassword from "./pages/forgotpassword/ResetPassword";
import Categories from "./pages/categories/Categories";
import CategoriesDetails from "./pages/categories/categoriesDetails";
import ProtectdRouter from "./components/Protected/ProtectdRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[
              {
        index: true,
        element:             
        <ProtectdRouter>
            <Home />
            </ProtectdRouter>
      },
        {
            path: "home",    
            element:           
            <ProtectdRouter>
            <Home />
            </ProtectdRouter>
        },
        {
            path: "register",
            element:<Register />
        },
        {
            path: "login",
            element: <Login />
        },
        {
            path: "cart",
            element: <Cart />
        },
        {
            path :"profile",
            element:<Profile />
        },
        {
            path:"verify-email",
            element: <VerifyEmail />
        },
        {
            path:"/forgot-password" ,
            element:<ForgotPassword/>
        },
        {
             path:"/reset-password",
              element:<ResetPassword />
        },{
            path: "/category-details/:id",
            element:<CategoriesDetails />
        }
    ]
  },
]);

export default router;