import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  BadgeCheck,
  XCircle,
  Shield,
  Calendar,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const VerDetalleUsuario = ({ usuario, volver }) => {
  const [data, setData] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario?.id) {
      setMensaje("No se ha seleccionado ningún usuario.");
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      setLoading(true);
      setMensaje("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });

        if (res.status === 401) return navigate("/login", { replace: true });
        if (res.status === 428)
          return navigate("/cambiar-password", { replace: true });

        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.mensaje || "Error al obtener el usuario");
        setData(json);
      } catch (e) {
        if (e.name !== "AbortError") {
          setMensaje(e.message || "Error al conectar con el servidor");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [usuario?.id, navigate]);

  const formatoFecha = (iso) =>
    iso
      ? new Date(iso).toLocaleString("es-CO", { timeZone: "America/Bogota" })
      : "No ha iniciado sesión";

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-gray-700">
        <Loader2 className="animate-spin" /> Cargando usuario…
      </div>
    );
  }

  if (mensaje) {
    return (
      <div className="p-6 text-red-700 bg-red-50 border border-red-200 rounded">
        {mensaje}
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">No se encontró el usuario.</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
        Detalle del Usuario
      </h2>

      <div className="space-y-2 text-sm">
        <p className="flex items-center gap-2">
          <UserIcon size={16} className="text-gray-500" />
          <strong>Identificación:</strong> {data.identificacion}
        </p>
        <p className="flex items-center gap-2">
          <UserIcon size={16} className="text-gray-500" />
          <strong>Nombre:</strong> {data.nombre}
        </p>
        <p className="flex items-center gap-2">
          <Mail size={16} className="text-gray-500" />
          <strong>Correo:</strong> {data.correo}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={16} className="text-gray-500" />
          <strong>Teléfono:</strong> {data.telefono}
        </p>
        <p className="flex items-center gap-2">
          {data.status ? (
            <BadgeCheck size={16} className="text-green-600" />
          ) : (
            <XCircle size={16} className="text-red-600" />
          )}
          <strong>Estado:</strong> {data.status ? "Activado" : "Desactivado"}
        </p>
        <p className="flex items-center gap-2">
          <Shield size={16} className="text-gray-500" />
          <strong>Rol:</strong> {data.rol?.nombre || "Sin rol"}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <strong>Última Conexión:</strong> {formatoFecha(data.ultima_conexion)}
        </p>
      </div>

      <button
        onClick={volver}
        className="mt-6 w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-secondary)] transition"
      >
        Volver
      </button>
    </div>
  );
};

export default VerDetalleUsuario;
