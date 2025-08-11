import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";

const API = import.meta.env.VITE_API_URL; // debe incluir /v1

export default function CambiarPassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!oldPassword || !newPassword || !confirm) {
      return setErr("Completa todos los campos.");
    }
    if (newPassword.length < 8) {
      return setErr("La nueva contraseña debe tener al menos 8 caracteres.");
    }
    if (newPassword !== confirm) {
      return setErr("La confirmación no coincide.");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/usuarios/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirm }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return setErr(data.mensaje || "No se pudo cambiar la contraseña.");
      }

      setMsg("Contraseña actualizada. Inicia sesión nuevamente…");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 1200);
    } catch {
      setErr("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Si estás forzando cambio, probablemente quieras volver al login:
    // navigate("/login");
    // O simplemente regresar a la vista anterior:
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
      <div className="w-full max-w-md">
        <button
          onClick={handleCancel}
          className="mb-4 inline-flex items-center gap-2 text-white/90 hover:text-white transition"
        >
          <ArrowLeft size={18} /> Cancelar
        </button>

        <form
          onSubmit={submit}
          className="w-full bg-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <ShieldCheck size={22} />
            </div>
            <h1 className="text-xl font-semibold">Cambiar contraseña</h1>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Por seguridad, usa al menos 8 caracteres. Evita reutilizar tu
            identificación como contraseña.
          </p>

          {err && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-2 rounded">
              {err}
            </div>
          )}
          {msg && (
            <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-2 rounded">
              {msg}
            </div>
          )}

          {/* Contraseña actual */}
          <label className="block text-sm font-medium text-gray-700">
            Contraseña actual
          </label>
          <div className="relative mt-1 mb-3">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              className="w-full border rounded pl-10 pr-10 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOld(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowOld((s) => !s)}
              aria-label={showOld ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Nueva contraseña */}
          <label className="block text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <div className="relative mt-1 mb-3">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              className="w-full border rounded pl-10 pr-10 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNew((s) => !s)}
              aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirmar nueva */}
          <label className="block text-sm font-medium text-gray-700">
            Confirmar nueva
          </label>
          <div className="relative mt-1 mb-6">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              className="w-full border rounded pl-10 pr-10 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={
                showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 text-white py-2 rounded transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
              }`}
            >
              {loading ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
