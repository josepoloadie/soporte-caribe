import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const CrearUsuario = () => {
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    correo: "",
    telefono: "",
    contraseña: "",
    rolId: "",
  });

  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  // Obtener roles desde backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setRoles(data);
        } else {
          setMensaje(data.mensaje || "Error al cargar roles");
        }
      } catch (error) {
        console.error("Error:", error);
        setMensaje("Error al conectar con el servidor");
      }
    };
    fetchRoles();
  }, []);

  const validarCampo = (nombre, valor) => {
    switch (nombre) {
      case "identificacion":
        if (!valor) return "La identificación es obligatoria";
        if (!/^\d+$/.test(valor)) return "Debe ser un número entero";
        break;
      case "nombre":
        if (!valor.trim()) return "El nombre es obligatorio";
        break;
      case "correo":
        if (!valor) return "El correo es obligatorio";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(valor))
          return "Correo no válido";
        break;
      case "telefono":
        if (!valor) return "El teléfono es obligatorio";
        if (!/^\d{7,15}$/.test(valor)) return "Teléfono no válido";
        break;
      case "contraseña":
        if (!valor) return "La contraseña es obligatoria";
        break;
      case "rolId":
        if (!valor) return "Seleccione un rol";
        break;
      default:
        break;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const error = validarCampo(name, value);
    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const nuevosErrores = {};
    Object.keys(form).forEach((campo) => {
      const error = validarCampo(campo, form[campo]);
      if (error) nuevosErrores[campo] = error;
    });

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("✅ Usuario creado correctamente");
        setForm({
          identificacion: "",
          nombre: "",
          correo: "",
          telefono: "",
          contraseña: "",
          rolId: "",
        });
        setErrores({});
      } else {
        setMensaje(data.mensaje || "❌ Error al crear usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
        Crear Usuario
      </h2>

      {mensaje && (
        <div className="mb-4 text-sm font-medium text-center text-red-600">
          {mensaje}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <input
            type="text"
            name="identificacion"
            placeholder="Identificación"
            value={form.identificacion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errores.identificacion && (
            <p className="text-sm text-red-600">{errores.identificacion}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errores.nombre && (
            <p className="text-sm text-red-600">{errores.nombre}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errores.correo && (
            <p className="text-sm text-red-600">{errores.correo}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errores.telefono && (
            <p className="text-sm text-red-600">{errores.telefono}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errores.contraseña && (
            <p className="text-sm text-red-600">{errores.contraseña}</p>
          )}
        </div>

        <div>
          <select
            name="rolId"
            value={form.rolId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
          {errores.rolId && (
            <p className="text-sm text-red-600">{errores.rolId}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={cargando}
            className="w-full flex justify-center items-center gap-2 bg-[var(--color-primary)] text-white py-2 rounded hover:bg-[var(--color-secondary)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando && <Loader2 className="animate-spin" size={20} />}
            Crear Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearUsuario;
