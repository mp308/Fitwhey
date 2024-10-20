import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import ProductPage from './pages/ProductPage';
import StatusPage from './pages/StatusPage';
import ShoppingCart from './pages/ShoppingCart';
import LoginPage from './pages/LoginPage';
import SingUp from './pages/SignUpPage';
import CheckOutPage from './pages/CheckOutPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/Admin-Page/AdminPage';
import ProductdetailPage from './pages/ProductdetailPage';
import { UserAuthContextProvider } from './gobal/UserAuthContext';
import { ProductProvider } from './gobal/ProductContext';
import { CartProvider } from './gobal/CartContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/Products",
    element: <ProductPage />,
  },
  {
    path: "/Status",
    element: <StatusPage />,
  },
  {
    path: "/Shopping",
    element: <ShoppingCart />,
  },
  {
    path: "/Login",
    element: <LoginPage />,
  },
  {
    path: "/Register",
    element: <SingUp />,
  },
  {
    path: "/CheckOut",
    element: <CheckOutPage />,
  },
  {
    path: "/Profile",
    element: <ProfilePage />,
  },
  {
    path: "/Admin",
    element: <AdminPage />,
  },
  {
    path: "/Products/:id",
    element: <ProductdetailPage />,
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(


  <UserAuthContextProvider>
    <ProductProvider>
      <CartProvider> {/* Add the CartProvider here */}
          <RouterProvider router={router} />       
      </CartProvider>
    </ProductProvider>
  </UserAuthContextProvider>

)
