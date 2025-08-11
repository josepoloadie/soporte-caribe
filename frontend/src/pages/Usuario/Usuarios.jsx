import { useState } from "react";
import { UserPlus, Upload, Users, Menu, X } from "lucide-react";

import CrearUsuario from "../../components/Usuarios/CrearUsuario";
import CrearUsuarioMasivo from "../../components/Usuarios/CrearUsuarioMasivo";
import VerUsuarios from "../../components/Usuarios/VerUsuarios";
import EditarUsuario from "../../components/Usuarios/EditarUsuario";
import VerDetalleUsuario from "../../components/Usuarios/VerDetalleUsuario";

const Usuarios = () => {
  const [opcion, setOpcion] = useState("crear");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accionUsuario, setAccionUsuario] = useState(null); // 'ver' | 'editar' | null
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const renderContenido = () => {
    if (accionUsuario === "ver") {
      return (
        <VerDetalleUsuario
          usuario={usuarioSeleccionado}
          volver={() => setAccionUsuario(null)}
        />
      );
    }

    if (accionUsuario === "editar") {
      return (
        <EditarUsuario
          user={usuarioSeleccionado}
          volver={() => setAccionUsuario(null)}
        />
      );
    }

    switch (opcion) {
      case "crear":
        return <CrearUsuario />;
      case "masivo":
        return <CrearUsuarioMasivo />;
      case "ver":
        return (
          <VerUsuarios
            onVer={(usuario) => {
              setUsuarioSeleccionado(usuario);
              setAccionUsuario("ver");
            }}
            onEditar={(usuario) => {
              setUsuarioSeleccionado(usuario);
              setAccionUsuario("editar");
            }}
          />
        );
      default:
        return <VerUsuarios />;
    }
  };

  const opcionesMenu = [
    { key: "crear", label: "Crear Usuario", icon: <UserPlus size={18} /> },
    {
      key: "masivo",
      label: "Crear Usuario Masivo",
      icon: <Upload size={18} />,
    },
    { key: "ver", label: "Ver Usuarios", icon: <Users size={18} /> },
  ];

  return (
    <div className="flex min-h-screen p-4 bg-gray-100 relative">
      {/* Botón hamburguesa en móvil */}
      <button
        className="sm:hidden absolute top-4 right-4 z-50 text-white bg-[var(--color-primary)] p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Abrir menú"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-16 left-0 w-64 sm:w-72 h-[calc(100vh-64px)] 
        bg-[var(--color-primary)] text-white p-4 space-y-3 z-40 border-r border-white/10
        shadow-2xl sm:shadow-none rounded-tr-2xl rounded-br-2xl sm:rounded-none
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <h2 className="text-xl font-semibold tracking-wide mb-2">Usuarios</h2>
        <nav className="space-y-2">
          {opcionesMenu.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => {
                setOpcion(key);
                setAccionUsuario(null);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition
                focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[var(--color-primary)]
                ${
                  opcion === key
                    ? "bg-[var(--color-secondary)]/100 shadow-md"
                    : "bg-white/0 hover:bg-white/10 active:bg-white/20"
                }`}
            >
              <span className="opacity-90">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-2 sm:p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6">
          {renderContenido()}
        </div>
      </main>
    </div>
  );
};

export default Usuarios;
