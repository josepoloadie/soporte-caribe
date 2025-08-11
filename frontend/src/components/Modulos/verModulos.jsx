import { useEffect, useMemo, useState } from "react";
import { Edit, Trash2, RefreshCcw } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog"; // ← mismo modal

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 10;

/**
 * VerModulos (con ConfirmDialog)
 */
export default function VerModulos({ onEditar }) {
  const [modulos, setModulos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Modal de confirmación
  const [openConfirm, setOpenConfirm] = useState(false);
  const [moduloAEliminar, setModuloAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

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

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.modulos)
        ? data.modulos
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : [];

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

  useEffect(() => {
    fetchModulos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const solicitarEliminar = (modulo) => {
    setModuloAEliminar(modulo);
    setOpenConfirm(true);
  };

  const confirmarEliminar = async () => {
    if (!moduloAEliminar?.id) return;
    setEliminando(true);
    try {
      const res = await fetch(`${API_URL}/modulos/${moduloAEliminar.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.mensaje || "Error al eliminar");

      // Si eliminamos el último de la página, retrocedemos (si se puede)
      const quedan = modulos.length - 1;
      if (quedan === 0 && pagina > 1) {
        setPagina((p) => Math.max(1, p - 1));
      } else {
        fetchModulos();
      }

      setMensaje("Módulo eliminado correctamente");
      setOpenConfirm(false);
      setModuloAEliminar(null);
    } catch (err) {
      setMensaje(err.message || "No se pudo eliminar el módulo");
    } finally {
      setEliminando(false);
    }
  };

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
        <div className="mb-4 rounded-xl p-3 text-sm bg-gray-50 text-gray-800 border border-gray-200">
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
                      aria-label={`Editar módulo ${modulo.nombre}`}
                    >
                      <Edit size={22} />
                    </button>
                    <button
                      className="text-red-600 hover:scale-110 transition"
                      onClick={() => solicitarEliminar(modulo)}
                      aria-label={`Eliminar módulo ${modulo.nombre}`}
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
                            aria-label={`Editar módulo ${modulo.nombre}`}
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => solicitarEliminar(modulo)}
                            aria-label={`Eliminar módulo ${modulo.nombre}`}
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

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={openConfirm}
        title="Confirmar eliminación"
        message={
          moduloAEliminar
            ? `¿Deseas eliminar el módulo "${moduloAEliminar.nombre}"?`
            : "¿Deseas eliminar este módulo?"
        }
        confirmText={eliminando ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        disabled={eliminando}
        onConfirm={confirmarEliminar}
        onClose={() => {
          if (eliminando) return;
          setOpenConfirm(false);
          setModuloAEliminar(null);
        }}
      />
    </div>
  );
}
