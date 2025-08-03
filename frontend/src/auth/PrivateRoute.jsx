import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, rolRequerido }) => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("user"));

  // Si no hay token o usuario, redirige al login
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no coincide, redirige a página no autorizada
  if (rolRequerido && usuario.rol.nombre !== rolRequerido) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default PrivateRoute;
