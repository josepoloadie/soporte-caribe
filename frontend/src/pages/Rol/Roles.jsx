import { useState } from "react";
import { UserPlus, Upload, Users, Search, Trash2, Menu, X } from "lucide-react";

import CrearRol from "../../components/Roles/CrearRol";
import EditarRol from "../../components/Roles/EditarRol";
import VerRoles from "../../components/Roles/VerRoles";

const Roles = () => {
  const [opcion, setOpcion] = useState("ver");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accionUsuario, setAccionUsuario] = useState(null); // 'ver' | 'editar' | null
  const [rolSeleccionado, setRolSeleccionado] = useState(null);

  const renderContenido = () => {
    if (accionUsuario === "editar") {
      return (
        <EditarRol
          rolId={rolSeleccionado}
          volver={() => setAccionUsuario(null)}
        />
      );
    }

    switch (opcion) {
      case "crear":
        return <CrearRol />;

      case "ver":
        return (
          <VerRoles
            onEditar={(usuario) => {
              setRolSeleccionado(usuario);
              setAccionUsuario("editar");
            }}
          />
        );

      default:
        return <VerRoles />;
    }
  };

  const opcionesMenu = [
    { key: "ver", label: "Ver Roles", icon: <Users size={18} /> },
    { key: "crear", label: "Crear Rol", icon: <UserPlus size={18} /> },
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
        <h2 className="text-xl font-bold mb-4">Roles</h2>
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

export default Roles;
