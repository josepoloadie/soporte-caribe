import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const VerDetalleUsuario = ({ usuario, volver }) => {
  const [user, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUsuario(data);
          setMensaje("");
        } else {
          setMensaje(data.mensaje || "Error al obtener el usuario");
        }
      } catch (error) {
        setMensaje("Error al conectar con el servidor", error);
      } finally {
        setLoading(false);
      }
    };

    if (usuario.id) {
      fetchUsuario();
    }
  }, [usuario.id]);

  if (!usuario) return <p>No se ha seleccionado ningún usuario.</p>;

  if (loading) return <p>Cargando usuario...</p>;

  if (mensaje) return <p className="text-red-600">{mensaje}</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
        Detalle del Usuario
      </h2>

      <p>
        <strong>Identificación:</strong> {user.identificacion}
      </p>
      <p>
        <strong>Nombre:</strong> {user.nombre}
      </p>
      <p>
        <strong>Correo:</strong> {user.correo}
      </p>
      <p>
        <strong>Telefono:</strong> {user.telefono}
      </p>
      <p>
        <strong>Status:</strong> {user.status ? "Activado" : "Desactivado"}
      </p>
      <p>
        <strong>Rol:</strong> {user.rol?.nombre || "Sin rol"}
      </p>
      <p>
        <strong>Última Conexión:</strong>{" "}
        {user.ultima_conexion
          ? new Date(user.ultima_conexion).toLocaleString("es-CO")
          : "No ha iniciado sesión"}
      </p>

      <button
        onClick={volver}
        className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-secondary)]"
      >
        Volver
      </button>
    </div>
  );
};

export default VerDetalleUsuario;
