import React from "react";

import Login from "./Pages/Login";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ForgotPassword from "./Component/ForgotPassword";
import ProtectedRoute from "./Component/ProtectedRoute";

import Register from "./Pages/Register";

import Products from "./Pages/Products";
import Categories from "./Pages/Categories";

import AddProduct from "./Pages/AddProduct";

import Checkout from "./Pages/Checkout";
import PaymentPage from "./Pages/PaymentPage";

import OrderPage from "./Pages/OrderPage";
import CartItem from "./Pages/CartItem";

import ContactUs from "./Pages/ContactUs";

import Profile from "./Pages/Profile";
import Account from "./Pages/Account";

import Dashboard from "./Pages/Dashboard";

import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminCategory from "./Pages/AdminCategory";
import AdminUsers from "./Pages/AdminUsers";
import AdminContacts from "./Pages/AdminContacts";
import AdminOrders from "./Pages/AdminOrders";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/forgotpassword"
          element={<ForgotPassword />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ========================= */}
        {/* COMMON ROUTES */}
        {/* USER + ADMIN */}
        {/* ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/Account"
            element={<Account />}
          />

        </Route>


        {/* ========================= */}
        {/* USER ROUTES */}
        {/* ========================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="USER"
            />
          }
        >

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/cartitem"
            element={<CartItem />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/payment/:orderId"
            element={<PaymentPage />}
          />

          <Route
            path="/orders"
            element={<OrderPage />}
          />

          <Route
            path="/ContactUs"
            element={<ContactUs />}
          />

          <Route
            path="/Dashboard"
            element={<Dashboard />}
          />

        </Route>


        {/* ========================= */}
        {/* ADMIN ROUTES */}
        {/* ========================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="ADMIN"
            />
          }
        >

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/add-product"
            element={<AddProduct />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/categories"
            element={<AdminCategory />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/contacts"
            element={<AdminContacts />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

        </Route>


      </Routes>

    </BrowserRouter>

  );

}


export default App;