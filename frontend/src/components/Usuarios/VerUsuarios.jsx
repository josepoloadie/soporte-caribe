import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Loader2 } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";

const API_URL = import.meta.env.VITE_API_URL;

// Hook simple de debounce
function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const VerUsuarios = ({ onVer, onEditar }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [inputId, setInputId] = useState("");
  const [inputNombre, setInputNombre] = useState("");

  const busquedaId = useDebounced(inputId, 350);
  const busquedaNombre = useDebounced(inputNombre, 350);

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const [confirm, setConfirm] = useState({ open: false, user: null });
  const [deletingId, setDeletingId] = useState(null);

  const abortRef = useRef(null);
  const navigate = useNavigate();

  // ¿Hay filtros activos?
  const hasFilters = !!(inputId?.trim() || inputNombre?.trim());

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(pagina), limit: "10" });
    if (busquedaId) p.set("identificacion", busquedaId.trim());
    if (busquedaNombre) p.set("nombre", busquedaNombre.trim());
    return p.toString();
  }, [pagina, busquedaId, busquedaNombre]);

  // fetchUsuarios permite overrideParams para forzar un fetch inmediato
  const fetchUsuarios = useCallback(
    async (overrideParams) => {
      setLoading(true);
      setMensaje({ tipo: "", texto: "" });

      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const qs = overrideParams ?? params;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/usuarios/paginado?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });

        if (res.status === 401) return navigate("/login", { replace: true });
        if (res.status === 428)
          return navigate("/cambiar-password", { replace: true });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.mensaje || "Error al obtener usuarios");

        setUsuarios(Array.isArray(data.usuarios) ? data.usuarios : []);
        setTotalPaginas(Number(data.totalPaginas || 1));
      } catch (err) {
        if (err.name !== "AbortError") {
          setMensaje({
            tipo: "error",
            texto: err.message || "Error al conectar con el servidor",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [params, navigate]
  );

  // Reset página cuando cambian filtros (debounced)
  useEffect(() => {
    setPagina(1);
  }, [busquedaId, busquedaNombre]);

  useEffect(() => {
    fetchUsuarios();
    return () => abortRef.current?.abort();
  }, [fetchUsuarios]);

  const renderRol = (rol) =>
    typeof rol === "string" ? rol : rol?.nombre || "Sin rol";

  // Confirmación
  const openConfirm = (u) => setConfirm({ open: true, user: u });
  const closeConfirm = () => setConfirm({ open: false, user: null });

  const handleDelete = async (u) => {
    if (!u?.id) return;
    setDeletingId(u.id);
    setMensaje({ tipo: "", texto: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/usuarios/${u.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return navigate("/login", { replace: true });
      if (res.status === 428)
        return navigate("/cambiar-password", { replace: true });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.mensaje || "No se pudo eliminar el usuario");

      // Si eliminaste el último de la página y no estás en la primera, retrocede
      if (usuarios.length === 1 && pagina > 1) {
        setPagina((p) => p - 1);
      } else {
        fetchUsuarios();
      }

      setMensaje({ tipo: "ok", texto: "✅ Usuario eliminado" });
    } catch (e) {
      setMensaje({ tipo: "error", texto: e.message || "Error al eliminar" });
    } finally {
      setDeletingId(null);
      closeConfirm();
    }
  };

  // Limpiar filtros al instante (sin esperar debounce) y forzar fetch inmediato
  const handleClearFilters = () => {
    abortRef.current?.abort(); // Cancela request en curso
    setInputId("");
    setInputNombre("");
    setPagina(1);
    const cleanQS = new URLSearchParams({ page: "1", limit: "10" }).toString();
    fetchUsuarios(cleanQS); // Trae resultados "limpios" ya
  };

  // Atajo de teclado: Esc limpia filtros si hay alguno y no está cargando
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && hasFilters && !loading) {
        handleClearFilters();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasFilters, loading]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
        Lista de Usuarios
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        {/* Identificación con botón "x" */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por identificación"
            value={inputId}
            onChange={(e) => {
              setInputId(e.target.value);
              setPagina(1);
            }}
            className="border px-3 py-2 rounded w-full pr-8"
            inputMode="numeric"
          />
          {inputId && (
            <button
              type="button"
              aria-label="Limpiar identificación"
              onClick={() => {
                // limpiamos este campo y hacemos fetch inmediato respetando el otro filtro (nombre) si existe
                setInputId("");
                setPagina(1);
                const qs = new URLSearchParams({
                  page: "1",
                  limit: "10",
                  ...(busquedaNombre ? { nombre: busquedaNombre.trim() } : {}),
                }).toString();
                fetchUsuarios(qs);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Limpiar identificación"
            >
              ×
            </button>
          )}
        </div>

        {/* Nombre con botón "x" */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={inputNombre}
            onChange={(e) => {
              setInputNombre(e.target.value);
              setPagina(1);
            }}
            className="border px-3 py-2 rounded w-full pr-8"
          />
          {inputNombre && (
            <button
              type="button"
              aria-label="Limpiar nombre"
              onClick={() => {
                // limpiamos este campo y hacemos fetch inmediato respetando el otro filtro (id) si existe
                setInputNombre("");
                setPagina(1);
                const qs = new URLSearchParams({
                  page: "1",
                  limit: "10",
                  ...(busquedaId ? { identificacion: busquedaId.trim() } : {}),
                }).toString();
                fetchUsuarios(qs);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Limpiar nombre"
            >
              ×
            </button>
          )}
        </div>

        {/* Botón Limpiar filtros general */}
        <button
          type="button"
          onClick={handleClearFilters}
          disabled={!hasFilters || loading}
          className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition text-sm disabled:opacity-50"
          title={
            !hasFilters ? "No hay filtros activos" : "Limpiar filtros (Esc)"
          }
        >
          Limpiar filtros
        </button>
      </div>

      {mensaje.texto && (
        <div
          className={`mb-3 text-sm font-medium p-2 rounded border ${
            mensaje.tipo === "ok"
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" /> Cargando usuarios…
        </div>
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
                      onClick={() => onVer?.(u)}
                      title="Ver detalle"
                    >
                      <Eye size={26} />
                    </button>
                    <button
                      className="text-yellow-600 hover:scale-110 transition"
                      onClick={() => onEditar?.(u)}
                      title="Editar"
                    >
                      <Edit size={26} />
                    </button>
                    <button
                      className="text-red-600 hover:scale-110 transition disabled:opacity-50"
                      onClick={() => openConfirm(u)}
                      disabled={deletingId === u.id}
                      title="Eliminar"
                    >
                      {deletingId === u.id ? (
                        <Loader2 size={26} className="animate-spin" />
                      ) : (
                        <Trash2 size={26} />
                      )}
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
                    <span className="font-semibold">Rol:</span>{" "}
                    {renderRol(u.rol)}
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
                      <td className="p-2">{renderRol(u.rol)}</td>
                      <td className="p-2">
                        <div className="flex justify-center gap-3">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => onVer?.(u)}
                            title="Ver detalle"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="text-yellow-600 hover:underline"
                            onClick={() => onEditar?.(u)}
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:underline disabled:opacity-50"
                            onClick={() => openConfirm(u)}
                            disabled={deletingId === u.id}
                            title="Eliminar"
                          >
                            {deletingId === u.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
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
          disabled={pagina === 1 || loading}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm font-medium">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
          disabled={pagina === totalPaginas || loading}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal de confirmación */}
      <ConfirmDialog
        open={confirm.open}
        title="Eliminar usuario"
        message={
          confirm.user
            ? `¿Seguro que deseas eliminar a "${confirm.user.nombre}" (${confirm.user.identificacion})? Esta acción no se puede deshacer.`
            : "¿Seguro que deseas eliminar este usuario?"
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={!!deletingId && confirm.user?.id === deletingId}
        onClose={closeConfirm}
        onConfirm={() => confirm.user && handleDelete(confirm.user)}
      />
    </div>
  );
};

export default VerUsuarios;
