import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/home",
            element: <Home />
        },
        {
            path: "/register",
            element:<Register />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/cart",
            element: <Cart />
        },
        {
            path :"/profile",
            element:<Profile />
        }
    ]
  },
]);

export default router;