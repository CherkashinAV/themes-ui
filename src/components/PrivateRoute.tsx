import {Navigate, Outlet} from "react-router-dom";

const PrivateRoute = () => {
  return localStorage.getItem("accessToken") ? <Outlet /> : <Navigate to={"/auth/login"} replace />;
};

export default PrivateRoute;