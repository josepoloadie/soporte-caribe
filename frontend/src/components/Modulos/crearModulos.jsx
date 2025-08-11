import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * CrearModulo
 * - Normaliza la ruta (minúsculas, sin dobles "//", sin slash final salvo "/")
 * - Valida formato de ruta: ^/(|[a-z0-9-]+(/[a-z0-9-]+)*)$
 * - Maneja 401/428 con navigate
 * - Autolimpia mensajes/errores
 */
export default function CrearModulo({ onCreated, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ruta, setRuta] = useState("");

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  // Borra mensajes/errores a los 3.5s
  useEffect(() => {
    if (!mensaje && !errores.general) return;
    const t = setTimeout(() => {
      setMensaje("");
      setErrores((e) => ({ ...e, general: "" }));
    }, 3500);
    return () => clearTimeout(t);
  }, [mensaje, errores.general]);

  const normalizarRuta = (v) => {
    const trimmed = String(v ?? "")
      .trim()
      .toLowerCase();
    if (!trimmed) return "";
    // quita espacios internos, múltiples / y trailing /
    let r = trimmed
      .replace(/\s+/g, "") // sin espacios
      .replace(/^\/+/, "") // sin / iniciales repetidos
      .replace(/\/{2,}/g, "/"); // sin dobles slash
    if (r.endsWith("/") && r !== "") r = r.replace(/\/+$/, "");
    return "/" + r;
  };

  const rutaEsValida = (r) => {
    if (!r) return false;
    // permite "/" o segmentos tipo "/admin/usuarios-externos"
    const re = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/;
    return re.test(r);
  };

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es obligatorio";

    const r = normalizarRuta(ruta);
    if (!r) e.ruta = "La ruta es obligatoria";
    else if (!rutaEsValida(r))
      e.ruta = "Usa solo letras/números y guiones. Ej: /admin/usuarios";
    if (descripcion.length > 200) e.descripcion = "Máximo 200 caracteres";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const esValido = useMemo(() => {
    const n = nombre.trim();
    const r = normalizarRuta(ruta);
    return Boolean(n && r && rutaEsValida(r));
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
        nombre: nombre.trim().replace(/\s+/g, " "),
        descripcion: descripcion.trim(),
        ruta: normalizarRuta(ruta),
      };

      const res = await fetch(`${API_URL}/modulos`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setCargando(false);
        return navigate("/login");
      }
      if (res.status === 428) {
        setCargando(false);
        return navigate("/cambiar-password");
      }

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
      if (typeof onCreated === "function") onCreated(data);
      limpiar();
    } catch (err) {
      setMensaje("");
      setErrores((prev) => ({ ...prev, general: err.message }));
    } finally {
      setCargando(false);
    }
  };

  const rutaPreview = normalizarRuta(ruta);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white border rounded-2xl shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-primary)]">
        Crear módulo
      </h2>

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
            className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${
              errores.nombre ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Asignar Módulos"
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
            className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${
              errores.descripcion ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Asignar módulos a los diferentes roles"
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
            className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${
              errores.ruta ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="/modulos"
            maxLength={120}
            disabled={cargando}
          />
          {/* Vista previa de la ruta normalizada */}
          {ruta && (
            <div className="mt-1 text-xs text-gray-500">
              Ruta final:{" "}
              <span className="font-mono">{rutaPreview || "/"}</span>
            </div>
          )}
          {errores.ruta && (
            <p className="text-xs text-red-600 mt-1">{errores.ruta}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={cargando || !esValido}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white
              ${
                cargando || !esValido
                  ? "bg-[var(--color-primary)]/60 cursor-not-allowed"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
              }`}
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
