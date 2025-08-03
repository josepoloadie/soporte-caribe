import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const EditarUsuario = ({ user, volver }) => {
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    correo: "",
    telefono: "",
    contraseña: "",
    rolId: "",
    status: true,
  });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");

        const [usuarioRes, rolesRes] = await Promise.all([
          fetch(`${API_URL}/usuarios/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/roles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usuarioData = await usuarioRes.json();
        const rolesData = await rolesRes.json();

        if (!usuarioRes.ok) {
          setMensaje(usuarioData.mensaje || "Error al cargar usuario");
          return;
        }

        setUsuario(usuarioData);
        setForm({
          identificacion: usuarioData.identificacion,
          nombre: usuarioData.nombre,
          correo: usuarioData.correo,
          telefono: usuarioData.telefono,
          contraseña: "",
          rolId: usuarioData.rolId,
          status: usuarioData.status,
        });

        setRoles(rolesData);
      } catch (error) {
        setMensaje("Error al conectar con el servidor", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Usuario actualizado correctamente");
      } else {
        setMensaje(data.mensaje || "Error al actualizar");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor", error);
    }
  };

  if (loading) return <p className="p-4">Cargando usuario...</p>;
  if (!usuario) return <p className="p-4 text-red-600">{mensaje}</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
        Editar Usuario
      </h2>

      {mensaje && (
        <div className="mb-4 text-sm text-red-600 font-medium">{mensaje}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="identificacion"
          value={form.identificacion}
          onChange={handleChange}
          placeholder="Identificación"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="contraseña"
          value={form.contraseña}
          onChange={handleChange}
          placeholder="Contraseña (dejar en blanco si no desea cambiar)"
          className="w-full border p-2 rounded"
        />

        <select
          name="rolId"
          value={form.rolId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
          />
          Usuario habilitado
        </label>

        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded hover:bg-[var(--color-secondary)] transition"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={volver}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuario;
