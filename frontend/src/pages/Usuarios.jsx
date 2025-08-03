import { useState } from "react";
import { UserPlus, Upload, Users, Search, Trash2, Menu, X } from "lucide-react";

import CrearUsuario from "../components/Usuarios/CrearUsuario";
import CrearUsuarioMasivo from "../components/Usuarios/CrearUsuarioMasivo";
import VerUsuarios from "../components/Usuarios/VerUsuarios";
import EditarUsuario from "../components/Usuarios/EditarUsuario";
import VerDetalleUsuario from "../components/Usuarios/VerDetalleUsuario";

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
    <div className="flex min-h-screen p bg-gray-100 relative">
      {/* Botón hamburguesa en móvil */}
      <button
        className="sm:hidden absolute top-4 right-4 z-50 text-white bg-[var(--color-primary)] p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-16 left-0 w-64 h-[calc(100vh-64px)] bg-[var(--color-primary)] text-white p-4 space-y-2 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4">Usuarios</h2>
        {opcionesMenu.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => {
              setOpcion(key);
              setAccionUsuario(null);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[var(--color-secondary)] transition ${
              opcion === key ? "bg-[var(--color-secondary)]" : ""
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6">{renderContenido()}</main>
    </div>
  );
};

export default Usuarios;
