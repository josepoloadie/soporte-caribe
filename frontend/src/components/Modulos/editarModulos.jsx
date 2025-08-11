import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * EditarModulo
 * Formulario para editar un módulo existente: { nombre, descripcion, ruta }
 *
 * Requisitos de backend asumidos (ajusta si difiere):
 *   GET  /modulos/:id              -> { id, nombre, descripcion, ruta }
 *   PUT  /modulos/:id              -> { mensaje, ...moduloActualizado }
 *
 * Props:
 *   - moduloId: string (requerido)
 *   - onUpdated?: (data) => void
 *   - onCancel?: () => void
 */
export default function EditarModulo({ moduloId, onUpdated, onCancel }) {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ruta, setRuta] = useState("");
  const [snapshot, setSnapshot] = useState({
    nombre: "",
    descripcion: "",
    ruta: "",
  });

  const [errores, setErrores] = useState({});

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const hayCambios = useMemo(
    () =>
      nombre !== snapshot.nombre ||
      descripcion !== snapshot.descripcion ||
      ruta !== snapshot.ruta,
    [nombre, descripcion, ruta, snapshot]
  );

  useEffect(() => {
    const cargar = async () => {
      if (!moduloId) {
        setError("Falta el ID del módulo");
        setCargando(false);
        return;
      }
      try {
        setError("");
        setCargando(true);
        const res = await fetch(`${API_URL}/modulos/${moduloId}`, { headers });
        const data = await res.json();
        // Soportar varias formas {modulo: {...}} | {...} | [{...}]
        const m = data?.modulo ?? (Array.isArray(data) ? data[0] : data);
        if (!m || !m.id) throw new Error("No se encontró el módulo");

        setNombre(m.nombre ?? "");
        setDescripcion(m.descripcion ?? "");
        setRuta(m.ruta ?? "");
        setSnapshot({
          nombre: m.nombre ?? "",
          descripcion: m.descripcion ?? "",
          ruta: m.ruta ?? "",
        });
      } catch (e) {
        setError(e.message || "Error al cargar el módulo");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [moduloId, headers]);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!ruta.trim()) e.ruta = "La ruta es obligatoria";
    if (ruta && !ruta.startsWith("/")) e.ruta = "La ruta debe iniciar con '/'";
    if (descripcion.length > 200) e.descripcion = "Máximo 200 caracteres";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;

    try {
      setGuardando(true);
      setMensaje("");
      setError("");

      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        ruta: ruta.trim(),
      };

      const res = await fetch(`${API_URL}/modulos/${moduloId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.mensaje ||
          (res.status === 409
            ? "Ya existe un módulo con ese nombre o ruta"
            : "No se pudo actualizar el módulo");
        throw new Error(msg);
      }

      setSnapshot({
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        ruta: payload.ruta,
      });
      setMensaje(data?.mensaje || "Módulo actualizado");
      if (typeof onUpdated === "function") onUpdated(data);
      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      setError(e.message || "Error al actualizar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white border rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Editar módulo</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl border hover:bg-gray-50"
          >
            Volver
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl p-3 text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}
      {mensaje && (
        <div className="mb-4 rounded-xl p-3 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
          {mensaje}
        </div>
      )}

      {cargando ? (
        <div className="animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-10 w-full bg-gray-200 rounded mb-4" />
          <div className="h-24 w-full bg-gray-200 rounded mb-4" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm text-gray-600">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errores.nombre ? "border-red-300" : ""
              }`}
              placeholder="Nombre del módulo"
              maxLength={80}
              disabled={guardando}
            />
            {errores.nombre && (
              <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errores.descripcion ? "border-red-300" : ""
              }`}
              placeholder="Descripción"
              rows={3}
              maxLength={200}
              disabled={guardando}
            />
            <div className="text-xs text-gray-500 text-right">
              {descripcion.length}/200
            </div>
            {errores.descripcion && (
              <p className="text-xs text-red-600 mt-1">{errores.descripcion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Ruta *</label>
            <input
              type="text"
              value={ruta}
              onChange={(e) => setRuta(e.target.value)}
              className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errores.ruta ? "border-red-300" : ""
              }`}
              placeholder="/ruta-del-modulo"
              maxLength={120}
              disabled={guardando}
            />
            {errores.ruta && (
              <p className="text-xs text-red-600 mt-1">{errores.ruta}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl border hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={guardando || !hayCambios}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
            >
              {guardando && (
                <span className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
              )}
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
