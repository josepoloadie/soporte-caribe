import { useEffect, useMemo, useState } from "react";
import { Edit, Trash2, RefreshCcw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 10;

/**
 * VerModulos (mejorado)
 * - Lista responsiva con paginación
 * - Maneja múltiples formatos de respuesta del backend
 * - Mensajes/errores consistentes
 * - Refetch inteligente tras eliminar (si queda vacía la página, retrocede)
 */
export default function VerModulos({ onEditar }) {
  const [modulos, setModulos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  const fetchModulos = async (opts = {}) => {
    const page = opts.page ?? pagina;
    setCargando(true);
    try {
      setMensaje("");
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      const res = await fetch(`${API_URL}/modulos?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.mensaje || "Error al obtener módulos");

      // Normalizar lista
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.modulos)
        ? data.modulos
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : [];

      // Normalizar total de páginas
      const tp =
        data?.totalPaginas ??
        (typeof data?.total === "number" && typeof data?.limit === "number"
          ? Math.max(1, Math.ceil(data.total / data.limit))
          : data?.meta?.totalPages ?? 1);

      setModulos(lista);
      setTotalPaginas(tp);
    } catch (err) {
      setMensaje(err.message);
      setModulos([]);
      setTotalPaginas(1);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = confirm("¿Deseas eliminar este módulo?");
    if (!confirmar) return;
    try {
      const res = await fetch(`${API_URL}/modulos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.mensaje || "Error al eliminar");

      // Si eliminamos el último de la página, retrocedemos una página (si es posible)
      const quedan = modulos.length - 1;
      if (quedan === 0 && pagina > 1) {
        setPagina((p) => Math.max(1, p - 1));
        // fetch se disparará por el useEffect de pagina
      } else {
        // Refrescar en la misma página
        fetchModulos();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchModulos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          Lista de Módulos
        </h2>
        <button
          onClick={() => fetchModulos({ page: pagina })}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
          disabled={cargando}
          title="Refrescar"
        >
          <RefreshCcw size={18} />
          Refrescar
        </button>
      </div>

      {mensaje && (
        <div className="mb-4 rounded-xl p-3 text-sm bg-red-50 text-red-700 border border-red-200">
          {mensaje}
        </div>
      )}

      {cargando ? (
        <p className="text-gray-500">Cargando módulos…</p>
      ) : (
        <>
          {/* Tarjetas móviles */}
          <div className="grid gap-4 sm:hidden">
            {modulos.length > 0 ? (
              modulos.map((modulo) => (
                <div
                  key={modulo.id}
                  className="relative bg-white shadow-md rounded-xl p-4 border border-gray-200"
                >
                  <div className="absolute top-4 right-5 flex flex-row gap-2">
                    <button
                      className="text-yellow-600 hover:scale-110 transition"
                      onClick={() => onEditar?.(modulo.id)}
                    >
                      <Edit size={22} />
                    </button>
                    <button
                      className="text-red-600 hover:scale-110 transition"
                      onClick={() => handleEliminar(modulo.id)}
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>

                  <div className="text-base space-y-1">
                    <p>
                      <span className="font-semibold">Nombre:</span>{" "}
                      {modulo.nombre}
                    </p>
                    {modulo.descripcion && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Descripción:</span>{" "}
                        {modulo.descripcion}
                      </p>
                    )}
                    {modulo.ruta && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Ruta:</span>{" "}
                        {modulo.ruta}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No hay módulos disponibles.
              </p>
            )}
          </div>

          {/* Tabla escritorio */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-auto bg-white rounded shadow-md border border-gray-200">
              <thead className="bg-[var(--color-primary)] text-white">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Descripción</th>
                  <th className="p-3 text-left">Ruta</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {modulos.length > 0 ? (
                  modulos.map((modulo) => (
                    <tr key={modulo.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{modulo.nombre}</td>
                      <td className="p-3 text-gray-700">
                        {modulo.descripcion || "—"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {modulo.ruta || "—"}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-yellow-600 hover:underline"
                            onClick={() => onEditar?.(modulo.id)}
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleEliminar(modulo.id)}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No hay módulos disponibles.
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
          disabled={pagina === 1 || cargando}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm font-medium">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
          disabled={pagina === totalPaginas || cargando}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
