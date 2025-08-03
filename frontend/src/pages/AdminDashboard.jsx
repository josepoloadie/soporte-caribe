import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Modulos from "../components/Modulos";
const AdminDashboard = () => {
  const location = useLocation();

  // Solo muestra <Modulos /> si está exactamente en /Admin
  const isRoot = location.pathname === "/Admin";
  return (
    <>
      <Header />
      {isRoot ? <Modulos /> : <Outlet />}
    </>
  );
};

export default AdminDashboard;
