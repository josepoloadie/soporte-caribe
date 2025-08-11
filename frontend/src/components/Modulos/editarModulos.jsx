import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../ConfirmDialog"; // mismo modal

const API_URL = import.meta.env.VITE_API_URL;

/**
 * EditarModulo
 * - Normaliza y valida ruta.
 * - Maneja 401/428.
 * - Confirma al cancelar si hay cambios (ConfirmDialog).
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
  const [openConfirm, setOpenConfirm] = useState(false);

  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  // Utilidades de ruta (mismas reglas que CrearModulo)
  const normalizarRuta = (v) => {
    const trimmed = String(v ?? "")
      .trim()
      .toLowerCase();
    if (!trimmed) return "";
    let r = trimmed
      .replace(/\s+/g, "")
      .replace(/^\/+/, "")
      .replace(/\/{2,}/g, "/");
    if (r.endsWith("/") && r !== "") r = r.replace(/\/+$/, "");
    return "/" + r;
  };
  const rutaEsValida = (r) =>
    /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(r || "");

  const hayCambios = useMemo(
    () =>
      nombre !== snapshot.nombre ||
      descripcion !== snapshot.descripcion ||
      ruta !== snapshot.ruta,
    [nombre, descripcion, ruta, snapshot]
  );

  // Autolimpia mensajes
  useEffect(() => {
    if (!mensaje && !error) return;
    const t = setTimeout(() => {
      setMensaje("");
      setError("");
    }, 3500);
    return () => clearTimeout(t);
  }, [mensaje, error]);

  // Cargar módulo
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

        if (res.status === 401) return navigate("/login");
        if (res.status === 428) return navigate("/cambiar-password");

        const data = await res.json();
        const m = data?.modulo ?? (Array.isArray(data) ? data[0] : data);
        if (!m || !m.id) throw new Error("No se encontró el módulo");

        // Mantén valores tal cual vienen; normalizamos al enviar / onBlur
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
  }, [moduloId, headers, navigate]);

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

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;

    try {
      setGuardando(true);
      setMensaje("");
      setError("");

      const payload = {
        nombre: nombre.trim().replace(/\s+/g, " "),
        descripcion: descripcion.trim(),
        ruta: normalizarRuta(ruta),
      };

      const res = await fetch(`${API_URL}/modulos/${moduloId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setGuardando(false);
        return navigate("/login");
      }
      if (res.status === 428) {
        setGuardando(false);
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
            : "No se pudo actualizar el módulo");
        throw new Error(msg);
      }

      setSnapshot(payload);
      setNombre(payload.nombre);
      setDescripcion(payload.descripcion);
      setRuta(payload.ruta);

      setMensaje(data?.mensaje || "Módulo actualizado");
      if (typeof onUpdated === "function") onUpdated(data);
    } catch (e) {
      setError(e.message || "Error al actualizar");
    } finally {
      setGuardando(false);
    }
  };

  const rutaPreview = normalizarRuta(ruta);

  const handleCancel = () => {
    if (!onCancel) return;
    if (hayCambios) setOpenConfirm(true);
    else onCancel();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white border rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">
          Editar módulo
        </h2>
        {onCancel && (
          <button
            onClick={handleCancel}
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
              className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${
                errores.nombre ? "border-red-300" : "border-gray-300"
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
              className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${
                errores.descripcion ? "border-red-300" : "border-gray-300"
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
              onBlur={() => setRuta((r) => normalizarRuta(r))}
              className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${
                errores.ruta ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="/ruta-del-modulo"
              maxLength={120}
              disabled={guardando}
            />
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
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={guardando || !hayCambios}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white
                ${
                  guardando || !hayCambios
                    ? "bg-[var(--color-primary)]/60 cursor-not-allowed"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                }`}
            >
              {guardando && (
                <span className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
              )}
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}

      {/* Confirmación al salir con cambios sin guardar */}
      <ConfirmDialog
        open={openConfirm}
        title="Hay cambios sin guardar"
        message="¿Deseas descartar los cambios?"
        confirmText="Descartar"
        cancelText="Seguir editando"
        onConfirm={() => {
          setOpenConfirm(false);
          onCancel?.();
        }}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
}
