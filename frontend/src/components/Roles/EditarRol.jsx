import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const EditarRol = ({ rolId, volver }) => {
  const [nombre, setNombre] = useState("");
  const [originalNombre, setOriginalNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Mensajes autolimpiables
  useEffect(() => {
    if (!error && !mensaje) return;
    const t = setTimeout(() => {
      setError("");
      setMensaje("");
    }, 3500);
    return () => clearTimeout(t);
  }, [error, mensaje]);

  // Cargar rol
  useEffect(() => {
    const obtenerRol = async () => {
      try {
        setCargando(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/roles/${rolId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) return navigate("/login");
        if (res.status === 428) return navigate("/cambiar-password");

        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || "Error al obtener el rol");

        setNombre(data.nombre || "");
        setOriginalNombre(data.nombre || "");
        setError("");
        requestAnimationFrame(() => inputRef.current?.focus());
      } catch (err) {
        setError(err.message || "Error al obtener el rol");
      } finally {
        setCargando(false);
      }
    };

    if (rolId) obtenerRol();
  }, [rolId, navigate]);

  const validarNombre = (value) => {
    const v = value.trim();
    if (v.length < 2 || v.length > 40)
      return "El nombre debe tener 2–40 caracteres";
    const re = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9 ._-]+$/;
    if (!re.test(v)) return "Solo letras, números, espacios y _ . -";
    return "";
  };

  const hayCambios =
    nombre.trim().replace(/\s+/g, " ") !==
    originalNombre.trim().replace(/\s+/g, " ");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const limpio = nombre.replace(/\s+/g, " ").trim();
    const err = validarNombre(limpio);
    if (err) return setError(err);
    if (!hayCambios) return setMensaje("No hay cambios para guardar");

    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/roles/${rolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: limpio }),
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
        if (res.status === 409)
          throw new Error(data.mensaje || "El rol ya existe");
        throw new Error(data.mensaje || "Error al actualizar el rol");
      }

      setMensaje("Rol actualizado correctamente");
      setOriginalNombre(limpio);
      setNombre(limpio);
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <p className="text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" /> Cargando datos del rol...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-primary)]">
          Editar Rol
        </h2>

        {/* Mensajes */}
        {error && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {mensaje && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>{mensaje}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-sm sm:text-base"
        >
          <div>
            <label className="block font-medium mb-1" htmlFor="nombre">
              Nombre del rol
            </label>
            <input
              id="nombre"
              ref={inputRef}
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              placeholder="Ej: Supervisor"
              maxLength={60}
            />
            <div className="mt-1 text-xs text-gray-500">
              2–40 caracteres. Permite letras, números y _ . -
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={guardando || !hayCambios}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition
                ${
                  guardando || !hayCambios
                    ? "bg-[color:var(--color-primary)]/60 cursor-not-allowed"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                }`}
            >
              {guardando && <Loader2 className="animate-spin" size={18} />}
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>

            <button
              type="button"
              onClick={volver}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarRol;
