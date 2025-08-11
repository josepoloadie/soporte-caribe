import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const VerRoles = ({ onEditar }) => {
  const [roles, setRoles] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pagina,
        limit: 10,
      });

      const res = await fetch(`${API_URL}/roles?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setRoles(data.roles || data);
        setTotalPaginas(data.totalPaginas || 1);
        setMensaje("");
      } else {
        setMensaje(data.mensaje || "Error al obtener roles");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = confirm("¿Deseas eliminar este rol?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/roles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al eliminar");

      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [pagina]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
        Lista de Roles
      </h2>

      {mensaje && <p className="text-red-500 font-medium mb-4">{mensaje}</p>}

      {loading ? (
        <p className="text-gray-500">Cargando roles...</p>
      ) : (
        <>
          {/* Tarjetas móviles */}
          <div className="grid gap-4 sm:hidden">
            {roles.length > 0 ? (
              roles.map((rol) => (
                <div
                  key={rol.id}
                  className="relative bg-white shadow-md rounded-xl p-4 border border-gray-200"
                >
                  <div className="absolute top-4 right-5 flex flex-row gap-2">
                    <button
                      className="text-yellow-600 hover:scale-110 transition"
                      onClick={() => onEditar && onEditar(rol.id)}
                    >
                      <Edit size={22} />
                    </button>
                    <button
                      className="text-red-600 hover:scale-110 transition"
                      onClick={() => handleEliminar(rol.id)}
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>

                  <div className="text-base">
                    <p>
                      <span className="font-semibold">Nombre:</span>{" "}
                      {rol.nombre}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No hay roles disponibles.
              </p>
            )}
          </div>

          {/* Tabla escritorio */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-auto bg-white rounded shadow-md border border-gray-200">
              <thead className="bg-[var(--color-primary)] text-white">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((rol) => (
                    <tr key={rol.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{rol.nombre}</td>
                      <td className="p-3 text-center flex justify-center gap-4">
                        <button
                          className="text-yellow-600 hover:underline"
                          onClick={() => onEditar && onEditar(rol.id)}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleEliminar(rol.id)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center p-4 text-gray-500">
                      No hay roles disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
        <button
          onClick={() => setPagina((p) => Math.max(p - 1, 1))}
          disabled={pagina === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm font-medium">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VerRoles;
