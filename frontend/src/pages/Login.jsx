import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <- corregido
import { Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react";
// Si el logo está en /public/logos/...
const logo = "/logos/SoporteCaribeAzul.png";

const API_URL = import.meta.env.VITE_API_URL; // ej: http://localhost:3000/v1

const Login = () => {
  const [identificacion, setIdentificacion] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!identificacion.trim())
      nuevosErrores.identificacion = "La cédula es obligatoria";
    else if (!/^\d+$/.test(identificacion))
      nuevosErrores.identificacion = "Solo se permiten números";
    if (!contraseña.trim())
      nuevosErrores.contraseña = "La contraseña es obligatoria";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos() || cargando) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificacion, contraseña }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrores((prev) => ({
          ...prev,
          general: data.mensaje || "Credenciales inválidas",
        }));
        return;
      }

      if (data.requirePasswordChange) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.usuario));
        navigate("/cambiar-password");
        return;
      }

      // Guarda sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
      // (opcional) por si lo usas aparte
      localStorage.setItem(
        "modulos",
        JSON.stringify(data.usuario.modulos || [])
      );

      // Redirige siempre al dashboard según el nombre del rol
      const roleName = data?.usuario?.rol?.nombre; // ej: "Admin" | "Tecnico"
      if (roleName) {
        const ROLE_ROUTES = {
          Admin: "/Admin",
          Tecnico: "/Tecnico",
          // agrega más si aparecen nuevos roles
        };
        navigate(ROLE_ROUTES[roleName] || `/${roleName}`);
      } else {
        navigate("/no-autorizado");
      }
    } catch (error) {
      console.error("Error login:", error);
      setErrores((prev) => ({
        ...prev,
        general: "No se pudo conectar con el servidor",
      }));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] px-4">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 bg-white text-[var(--color-primary)] font-medium py-2 px-4 rounded shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-xl animate-fade-in"
      >
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-[var(--color-tertiary)] mb-6">
          Iniciar sesión
        </h2>

        {errores.general && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {errores.general}
          </div>
        )}

        {/* Cédula */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Cédula</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              className={`pl-10 pr-3 py-2 w-full border rounded focus:outline-none focus:ring-2 ${
                errores.identificacion
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[var(--color-primary)]"
              }`}
              value={identificacion}
              onChange={(e) => {
                setIdentificacion(e.target.value);
                if (errores.identificacion) validarCampos();
              }}
              placeholder="Ej: 123456789"
              inputMode="numeric"
              autoComplete="username"
            />
          </div>
          {errores.identificacion && (
            <span className="text-red-500 text-sm">
              {errores.identificacion}
            </span>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type={mostrarContraseña ? "text" : "password"}
              className={`pl-10 pr-10 py-2 w-full border rounded focus:outline-none focus:ring-2 ${
                errores.contraseña
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-[var(--color-primary)]"
              }`}
              value={contraseña}
              onChange={(e) => {
                setContraseña(e.target.value);
                if (errores.contraseña) validarCampos();
              }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setMostrarContraseña((prev) => !prev)}
              aria-label={
                mostrarContraseña ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {mostrarContraseña ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errores.contraseña && (
            <span className="text-red-500 text-sm">{errores.contraseña}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={cargando}
          className={`w-full text-white py-2 rounded transition duration-300 ${
            cargando
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
          }`}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
