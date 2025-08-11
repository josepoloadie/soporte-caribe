import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CrearRol = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Limpia mensajes luego de unos segundos
  useEffect(() => {
    if (!error && !mensaje) return;
    const t = setTimeout(() => {
      setError("");
      setMensaje("");
    }, 3500);
    return () => clearTimeout(t);
  }, [error, mensaje]);

  const validarNombre = (value) => {
    const v = value.trim();
    if (v.length < 2 || v.length > 40) {
      return "El nombre debe tener entre 2 y 40 caracteres";
    }
    // permite letras, números, espacios y _.- (ajusta si quieres)
    const re = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9 ._-]+$/;
    if (!re.test(v)) {
      return "Solo letras, números, espacios y _ . -";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const limpio = nombre.replace(/\s+/g, " ").trim();
    const err = validarNombre(limpio);
    if (err) {
      setError(err);
      return;
    }

    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: limpio }),
      });

      if (response.status === 401) {
        setCargando(false);
        return navigate("/login");
      }
      if (response.status === 428) {
        setCargando(false);
        return navigate("/cambiar-password");
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // si el backend usa 409 para duplicados
        if (response.status === 409) {
          throw new Error(data.mensaje || "El rol ya existe");
        }
        throw new Error(data.mensaje || "Error al crear el rol");
      }

      setMensaje("Rol creado exitosamente");
      setNombre("");
      // foco al input tras crear
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-primary)]">
          Crear Rol
        </h1>

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
            <label className="block font-semibold mb-1" htmlFor="nombre">
              Nombre del rol
            </label>
            <input
              id="nombre"
              ref={inputRef}
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              placeholder="Ej: Administrador"
              aria-invalid={!!error}
              maxLength={60}
            />
            <div className="mt-1 text-xs text-gray-500">
              2–40 caracteres. Permite letras, números y _ . -
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={cargando}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition
                ${
                  cargando
                    ? "bg-[color:var(--color-primary)]/60 cursor-wait"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                }`}
            >
              {cargando && <Loader2 className="animate-spin" size={18} />}
              {cargando ? "Creando..." : "Crear Rol"}
            </button>

            <button
              type="button"
              disabled={cargando || !nombre}
              onClick={() => {
                setNombre("");
                setError("");
                setMensaje("");
                inputRef.current?.focus();
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearRol;
