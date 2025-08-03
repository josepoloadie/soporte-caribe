import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TecnicoDashboard from "./pages/TecnicoDashboard";
import Usuarios from "./pages/Usuarios";
import NoAutorizado from "./pages/NoAutorizado";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
  return (
    <Routes>
      {/* Página pública */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/no-autorizado" element={<NoAutorizado />} />
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
        {/* Rutas anidadas */}
        <Route path="usuarios" element={<Usuarios />} />
        {/* Puedes seguir agregando más como: <Route path="reportes" element={<Reportes />} /> */}
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
    </Routes>
  );
};

export default App;
