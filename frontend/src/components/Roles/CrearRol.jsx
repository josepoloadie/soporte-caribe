import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const CrearRol = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    if (!nombre.trim()) {
      setError("El nombre del rol es obligatorio");
      setCargando(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al crear el rol");
      }

      setMensaje("Rol creado exitosamente");
      setNombre("");
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-0 max-w-md mx-auto mt-10">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-primary)]">
          Crear Rol
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-sm sm:text-base"
        >
          <div>
            <label className="block font-semibold mb-1">Nombre del rol</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
              placeholder="Ej: Administrador"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}

          <button
            type="submit"
            disabled={cargando}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              cargando
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {cargando ? "Creando..." : "Crear Rol"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearRol;
