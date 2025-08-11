import { useState, useMemo } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * CrearModulo (mejorado)
 * - Normaliza la ruta (sin dobles "/", minúsculas, empieza por "/")
 * - Deshabilita el botón si el formulario no es válido
 * - Mapea errores de campo provenientes del backend (data.errores)
 * - onCreated(data) se llama al terminar OK
 */
export default function CrearModulo({ onCreated, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ruta, setRuta] = useState("");

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const normalizarRuta = (v) => {
    const trimmed = (v ?? "").trim();
    if (!trimmed) return "";
    return (
      "/" +
      trimmed
        .replace(/^\/+/, "")
        .replace(/\/{2,}/g, "/")
        .toLowerCase()
    );
  };

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!ruta.trim()) e.ruta = "La ruta es obligatoria";
    else if (!normalizarRuta(ruta).startsWith("/"))
      e.ruta = "La ruta debe iniciar con '/'";
    if (descripcion.length > 200) e.descripcion = "Máximo 200 caracteres";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const esValido = useMemo(() => {
    const n = nombre.trim();
    const r = normalizarRuta(ruta);
    return Boolean(n && r && r.startsWith("/"));
  }, [nombre, ruta]);

  const limpiar = () => {
    setNombre("");
    setDescripcion("");
    setRuta("");
    setErrores({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    try {
      setCargando(true);
      setMensaje("");
      setErrores({});

      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        ruta: normalizarRuta(ruta),
      };

      const res = await fetch(`${API_URL}/modulos`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.errores && typeof data.errores === "object") {
          setErrores((prev) => ({ ...prev, ...data.errores }));
        }
        const msg =
          data?.mensaje ||
          (res.status === 409
            ? "Ya existe un módulo con ese nombre o ruta"
            : "No se pudo crear el módulo");
        throw new Error(msg);
      }

      setMensaje("Módulo creado correctamente");
      limpiar();
      if (typeof onCreated === "function") onCreated(data);
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      setMensaje("");
      setErrores((prev) => ({ ...prev, general: err.message }));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white border rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Crear módulo</h2>

      {errores.general && (
        <div className="mb-4 rounded-xl p-3 text-sm bg-red-50 text-red-700 border border-red-200">
          {errores.general}
        </div>
      )}
      {mensaje && (
        <div className="mb-4 rounded-xl p-3 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
          {mensaje}
        </div>
      )}

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
            placeholder="Asignar Modulos"
            maxLength={80}
            disabled={cargando}
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
            placeholder="Asignar modulos a los diferentes roles"
            rows={3}
            maxLength={200}
            disabled={cargando}
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
            onBlur={() => setRuta((r) => normalizarRuta(r))}
            className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errores.ruta ? "border-red-300" : ""
            }`}
            placeholder="/modulos"
            maxLength={120}
            disabled={cargando}
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
            disabled={cargando || !esValido}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
          >
            {cargando && (
              <span className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
            )}
            {cargando ? "Guardando…" : "Crear módulo"}
          </button>
        </div>
      </form>
    </div>
  );
}
