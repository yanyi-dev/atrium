import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect, ReactNode } from "react";
import SpinnerFullPage from "./SpinnerFullPage";

interface ProtectedRoute {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRoute) {
  const navigate = useNavigate();

  //加载经过验证的用户,没有验证通过直接就重定向到登陆页面
  const { isLoading, isAuthenticated } = useUser();

  //如果验证过期的同时没有在登陆中，则重新登陆
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate],
  );

  if (isLoading) return <SpinnerFullPage />;

  if (isAuthenticated) return children;

  return null;
}

export default ProtectedRoute;
