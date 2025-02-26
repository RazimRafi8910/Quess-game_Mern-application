import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import useAuth from "../Hooks/useAuth";

interface AuthLayoutProps {
  children: JSX.Element;
  requiredRole?: "user" | "admin";
}

function AuthProtect({ children }: AuthLayoutProps) {
  const navigate = useNavigate();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user?.logined == false) {
        navigate("/");
      } else if (user?.logined == true) {
        return;
      }
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return <>{children}</>;
}

export default AuthProtect;
