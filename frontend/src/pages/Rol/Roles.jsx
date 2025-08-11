import { useState } from "react";
import { UserPlus, Users, Menu, X } from "lucide-react";

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
      default:
        return (
          <VerRoles
            onEditar={(usuario) => {
              setRolSeleccionado(usuario);
              setAccionUsuario("editar");
            }}
          />
        );
    }
  };

  const opcionesMenu = [
    { key: "ver", label: "Ver Roles", icon: <Users size={18} /> },
    { key: "crear", label: "Crear Rol", icon: <UserPlus size={18} /> },
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
        <h2 className="text-xl font-semibold tracking-wide mb-2">Roles</h2>
        <nav className="space-y-2">
          {opcionesMenu.map(({ key, label, icon }) => {
            const active = opcion === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setOpcion(key);
                  setAccionUsuario(null);
                  setSidebarOpen(false);
                }}
                aria-current={active ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition
                  focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[var(--color-primary)]
                  ${
                    active
                      ? "bg-[var(--color-secondary)]/100 shadow-md"
                      : "bg-white/0 hover:bg-white/10 active:bg-white/20"
                  }`}
              >
                <span className="opacity-90">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
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

export default Roles;
