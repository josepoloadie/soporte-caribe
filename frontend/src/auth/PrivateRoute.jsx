// src/auth/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, rolRequerido }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Sin sesión → login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const payload = jwtDecode(token); // { sub, rol, exp, mustChangePassword, ... }
    const now = Math.floor(Date.now() / 1000);

    // Token vencido
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return (
        <Navigate
          to="/login"
          replace
          state={{ sessionExpired: true, from: location }}
        />
      );
    }

    // Flujo "debe cambiar contraseña"
    const isPasswordChangeRoute = location.pathname === "/cambiar-password";
    if (payload.mustChangePassword && !isPasswordChangeRoute) {
      return <Navigate to="/cambiar-password" replace />;
    }

    // Chequeo de rol (si se requiere uno específico)
    if (rolRequerido && payload?.rol?.nombre !== rolRequerido) {
      return <Navigate to="/no-autorizado" replace />;
    }
  } catch {
    // Token malformado
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
