import { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const VerUsuarios = ({ onVer, onEditar }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busquedaId, setBusquedaId] = useState("");
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pagina,
        limit: 10,
      });

      if (busquedaId) params.append("identificacion", busquedaId);
      if (busquedaNombre) params.append("nombre", busquedaNombre);

      const res = await fetch(`${API_URL}/usuarios/paginado?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsuarios(data.usuarios);
        setTotalPaginas(data.totalPaginas || 1);
        setMensaje("");
      } else {
        setMensaje(data.mensaje || "Error al obtener usuarios");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [pagina, busquedaId, busquedaNombre]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
        Lista de Usuarios
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por identificación"
          value={busquedaId}
          onChange={(e) => {
            setBusquedaId(e.target.value);
            setPagina(1);
          }}
          className="border px-3 py-2 rounded w-full sm:w-72"
        />
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busquedaNombre}
          onChange={(e) => {
            setBusquedaNombre(e.target.value);
            setPagina(1);
          }}
          className="border px-3 py-2 rounded w-full sm:w-72"
        />
      </div>

      {mensaje && <p className="text-red-500 font-medium mb-4">{mensaje}</p>}

      {loading ? (
        <p className="text-gray-500">Cargando usuarios...</p>
      ) : (
        <>
          {/* Tarjetas móviles */}
          <div className="grid gap-5 sm:hidden">
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <div
                  key={u.id}
                  className="w-full bg-white shadow-lg rounded-3xl p-8 pr-20 relative text-lg leading-relaxed"
                >
                  <div className="absolute top-4 right-4 flex flex-col items-center gap-4">
                    <button
                      className="text-blue-600 hover:scale-110 transition"
                      onClick={() => onVer && onVer(u)}
                    >
                      <Eye size={26} />
                    </button>
                    <button
                      className="text-yellow-600 hover:scale-110 transition"
                      onClick={() => onEditar && onEditar(u)}
                    >
                      <Edit size={26} />
                    </button>
                    <button className="text-red-600 hover:scale-110 transition">
                      <Trash2 size={26} />
                    </button>
                  </div>
                  <p className="text-base leading-6">
                    <span className="font-semibold">Id:</span>{" "}
                    {u.identificacion}
                  </p>
                  <p className="text-base leading-6">
                    <span className="font-semibold">Nombre:</span> {u.nombre}
                  </p>
                  <p className="text-base leading-6">
                    <span className="font-semibold">Rol:</span> {u.rol.nombre}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No hay usuarios que coincidan.
              </p>
            )}
          </div>

          {/* Tabla escritorio */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full bg-white rounded shadow-md">
              <thead className="bg-[var(--color-primary)] text-white">
                <tr>
                  <th className="p-2 text-left">Identificación</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Rol</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{u.identificacion}</td>
                      <td className="p-2">{u.nombre}</td>
                      <td className="p-2">{u.rol.nombre}</td>
                      <td className="p-2 flex justify-center gap-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => onVer && onVer(u)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-yellow-600 hover:underline"
                          onClick={() => onEditar && onEditar(u)}
                        >
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:underline">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No hay usuarios que coincidan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setPagina((p) => Math.max(p - 1, 1))}
          disabled={pagina === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm font-medium">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VerUsuarios;
