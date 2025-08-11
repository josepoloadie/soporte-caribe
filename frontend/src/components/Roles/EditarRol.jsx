import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const EditarRol = ({ rolId, volver }) => {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Obtener datos del rol al montar
  useEffect(() => {
    const obtenerRol = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/roles/${rolId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || "Error al obtener el rol");

        setNombre(data.nombre);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    if (rolId) obtenerRol();
  }, [rolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setGuardando(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/roles/${rolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.mensaje || "Error al actualizar el rol");

      setMensaje("Rol actualizado correctamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <p className="text-center text-gray-500">Cargando datos del rol...</p>
    );
  }

  return (
    <div className="w-full px-4 sm:px-0 max-w-md mx-auto mt-10">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-primary)]">
          Editar Rol
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-sm sm:text-base"
        >
          <div>
            <label className="block font-medium mb-1">Nombre del rol</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
              placeholder="Ej: Supervisor"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}

          <div className="flex justify-between gap-2">
            <button
              type="submit"
              disabled={guardando}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                guardando
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>

            <button
              type="button"
              onClick={volver}
              className="w-full py-2 px-4 rounded-md bg-gray-400 hover:bg-gray-500 text-white font-semibold"
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
