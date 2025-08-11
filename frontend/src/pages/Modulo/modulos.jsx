import { useState } from "react";
import { UserPlus, Users, Menu, X, Link2 } from "lucide-react";

import VerModulos from "../../components/Modulos/verModulos";
import CrearModulo from "../../components/Modulos/crearModulos";
import EditarModulo from "../../components/Modulos/editarModulos";
import ModuloARol from "../../pages/ModuloARol/ModuloARol";

const Modulos = () => {
  const [opcion, setOpcion] = useState("ver");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accionModulo, setAccionModulo] = useState(null); // 'editar' | null
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);

  const renderContenido = () => {
    // Vista de edición
    if (accionModulo === "editar") {
      return (
        <EditarModulo
          moduloId={moduloSeleccionado}
          onCancel={() => setAccionModulo(null)}
        />
      );
    }

    // Vistas principales
    switch (opcion) {
      case "crear":
        return (
          <CrearModulo
            onCreated={() => setOpcion("ver")}
            onCancel={() => setOpcion("ver")}
          />
        );
      case "asignar":
        return <ModuloARol onClose={() => setOpcion("ver")} />;
      case "ver":
      default:
        return (
          <VerModulos
            onEditar={(moduloId) => {
              setModuloSeleccionado(moduloId);
              setAccionModulo("editar");
            }}
          />
        );
    }
  };

  const opcionesMenu = [
    { key: "ver", label: "Ver Módulos", icon: <Users size={18} /> },
    { key: "crear", label: "Crear Módulo", icon: <UserPlus size={18} /> },
    {
      key: "asignar",
      label: "Asignar Módulos a Rol",
      icon: <Link2 size={18} />,
    },
  ];

  return (
    <div className="flex min-h-screen p-4 bg-gray-100 relative">
      {/* Botón hamburguesa en móvil */}
      <button
        className="sm:hidden absolute top-4 right-4 z-50 text-white bg-[var(--color-primary)] p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar-menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar-menu"
        role="navigation"
        className={`fixed sm:static top-16 left-0 w-64 h-[calc(100vh-64px)] bg-[var(--color-primary)] text-white p-4 space-y-2 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4">Módulos</h2>
        {opcionesMenu.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => {
              setOpcion(key);
              setAccionModulo(null);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[var(--color-secondary)] transition ${
              opcion === key ? "bg-[var(--color-secondary)]" : ""
            }`}
            aria-current={opcion === key ? "page" : undefined}
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

export default Modulos;
