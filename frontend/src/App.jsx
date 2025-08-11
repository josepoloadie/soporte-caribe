import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TecnicoDashboard from "./pages/TecnicoDashboard";
import NoAutorizado from "./pages/NoAutorizado";
import PrivateRoute from "./auth/PrivateRoute";

import Usuarios from "./pages/Usuario/Usuarios";
import Roles from "./pages/Rol/Roles";
import Modulos from "./pages/Modulo/modulos";
import AsignarModuloARol from "./pages/ModuloARol/ModuloARol";
import CambiarPassword from "./pages/CambiarPassword";

const App = () => {
  return (
    <Routes>
      {/* Página pública */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/no-autorizado" element={<NoAutorizado />} />
      <Route path="/cambiar-password" element={<CambiarPassword />} />
      {/*Rutas Privadas*/}

      {/*Rutas Admin */}
      <Route
        path="/Admin"
        element={
          <PrivateRoute rolRequerido="Admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Modulos />} /> {/* 👈 se renderiza en /Admin */}
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="roles" element={<Roles />} />
        <Route path="modulos" element={<Modulos />} />{" "}
        {/* si tienes otra página */}
        <Route path="modulosarol" element={<AsignarModuloARol />} />
      </Route>

      {/*Rutas Tecnico */}
      <Route
        path="/Tecnico"
        element={
          <PrivateRoute rolRequerido="Tecnico">
            <TecnicoDashboard />
          </PrivateRoute>
        }
      />
      {/* Rutas anidadas */}
      {/* <Route path="usuarios" element={<Usuarios />} />
      <Route path="usuarios" element={<Usuarios />} /> */}
    </Routes>
  );
};

export default App;
