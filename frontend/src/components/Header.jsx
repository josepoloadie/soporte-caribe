import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../public/logos/LogotipoSoporteCaribe.png";
import BotonVolver from "./BotonVolver";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [usuario, setUsuario] = useState({ nombre: "", rol: "", modulos: [] });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsuario({
        nombre: storedUser.nombre || "",
        rol: storedUser.rol.nombre || "",
        modulos: storedUser.modulos || [],
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isInSubRoute = location.pathname.startsWith(`/${usuario.rol}/`);

  return (
    <header className="bg-[var(--color-primary)] text-white px-4 py-3 sm:px-6 shadow-md  sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BotonVolver />
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-14 object-contain hidden sm:block"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
              DASHBOARD {usuario.rol.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-200 truncate">
              Hola, {usuario.nombre}
            </p>
          </div>
        </div>

        <button
          className="focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-4 top-full mt-2 bg-white text-[var(--color-tertiary)] rounded-xl shadow-lg p-4 w-11/12 sm:w-64 z-50 transition-all duration-300 border border-[var(--color-neutral)]"
        >
          {/* Botón Inicio */}
          {(() => {
            const homePath = `/${usuario.rol}`;
            const isHome = location.pathname === homePath;

            return (
              <button
                onClick={() => {
                  navigate(homePath);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition ${
                  isHome
                    ? "bg-[var(--color-secondary)] text-white font-semibold"
                    : "hover:bg-[var(--color-secondary)] hover:text-white"
                }`}
              >
                Inicio
              </button>
            );
          })()}

          <hr className="border-gray-300 my-2" />

          {/* Módulos */}
          {isInSubRoute && usuario.modulos.length > 0 && (
            <div className="mb-3 space-y-2">
              {usuario.modulos.map((modulo) => {
                const rutaCompleta = `/${usuario.rol}${modulo.ruta}`;
                const isActive = location.pathname === rutaCompleta;

                return (
                  <button
                    key={modulo.id}
                    onClick={() => {
                      navigate(rutaCompleta);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-[var(--color-secondary)] text-white font-semibold"
                        : "hover:bg-[var(--color-secondary)] hover:text-white"
                    }`}
                  >
                    {modulo.nombre}
                  </button>
                );
              })}
              <hr className="border-gray-300 my-2" />
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
