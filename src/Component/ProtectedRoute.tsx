import React from "react";

import {
  Navigate,
  Outlet
} from "react-router-dom";


interface ProtectedRouteProps {
  allowedRole?: "ADMIN" | "USER";
}


const ProtectedRoute: React.FC<
  ProtectedRouteProps
> = ({
  allowedRole,
}) => {


  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");


  // =========================
  // NOT LOGGED IN
  // =========================

  if (!token) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  // =========================
  // COMMON ROUTE
  // USER + ADMIN
  // =========================

  if (!allowedRole) {

    return <Outlet />;

  }


  // =========================
  // ROLE CHECK
  // =========================

  if (role !== allowedRole) {


    // =========================
    // ADMIN
    // =========================

    if (role === "ADMIN") {

      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );

    }


    // =========================
    // USER
    // =========================

    if (role === "USER") {

      return (
        <Navigate
          to="/Dashboard"
          replace
        />
      );

    }


    // =========================
    // UNKNOWN ROLE
    // =========================

    localStorage.removeItem("token");

    localStorage.removeItem("userId");

    localStorage.removeItem("role");


    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  // =========================
  // ACCESS ALLOWED
  // =========================

  return <Outlet />;

};


export default ProtectedRoute;