import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const Modulos = () => {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setRol(storedUser.rol.nombre);
    const rolId = storedUser.rol.id;

    if (!rolId) {
      setMensaje("No se encontró el rolId en localStorage");
      setLoading(false);
      return;
    }

    const fetchModulos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/roles/${rolId}/modulos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setModulos(data.modulos);
        } else {
          setMensaje(data.mensaje || "Error al obtener módulos");
        }
      } catch (error) {
        console.error("Error:", error);
        setMensaje("Error de red al obtener módulos");
      } finally {
        setLoading(false);
      }
    };

    fetchModulos();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        Cargando módulos...
      </div>
    );

  if (mensaje)
    return (
      <div className="flex items-center justify-center py-10 text-red-500 gap-2">
        <AlertCircle className="w-5 h-5" />
        {mensaje}
      </div>
    );

  if (modulos.length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        No hay módulos asignados a este rol.
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {modulos.map((modulo) => (
        <div
          key={modulo.id}
          onClick={() => navigate(`/${rol}${modulo.ruta}`)}
          className="cursor-pointer rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-transparent hover:border-[var(--color-secondary)] group bg-white"
        >
          <div className="p-5">
            <h2
              className="text-xl font-bold mb-2 transition"
              style={{ color: "var(--color-primary)" }}
            >
              {modulo.nombre}
            </h2>
            <p
              className="text-sm mb-3"
              style={{ color: "var(--color-neutral)" }}
            >
              {modulo.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Modulos;
