import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // ej: http://localhost:3000/v1

const CrearUsuario = () => {
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    correo: "",
    telefono: "",
    contraseña: "",
    rolId: "",
  });
  const [usarCedula, setUsarCedula] = useState(true);
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Cargar roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return navigate("/login");
        if (res.status === 428) return navigate("/cambiar-password");

        const data = await res.json();
        if (res.ok) setRoles(data);
        else
          setMensaje({
            tipo: "error",
            texto: data.mensaje || "Error al cargar roles",
          });
      } catch (error) {
        console.error("Error:", error);
        setMensaje({
          tipo: "error",
          texto: "Error al conectar con el servidor",
        });
      }
    };
    fetchRoles();
  }, [navigate]);

  // Validación por campo
  const validarCampo = (nombre, valor) => {
    switch (nombre) {
      case "identificacion":
        if (!valor) return "La identificación es obligatoria";
        if (!/^\d{4,20}$/.test(valor)) return "Debe tener 4–20 dígitos";
        break;
      case "nombre":
        if (!valor.trim()) return "El nombre es obligatorio";
        break;
      case "correo":
        if (!valor) return "El correo es obligatorio";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(valor))
          return "Correo no válido";
        break;
      case "telefono":
        if (!valor) return "El teléfono es obligatorio";
        if (!/^[0-9+\-()\s]{6,20}$/.test(valor)) return "Teléfono no válido";
        break;
      case "contraseña":
        if (!usarCedula) {
          if (!valor) return "La contraseña es obligatoria";
          if (valor.length < 8) return "Mínimo 8 caracteres";
        }
        break;
      case "rolId":
        if (!valor) return "Seleccione un rol";
        break;
      default:
        break;
    }
    return "";
  };

  // Campos requeridos según si usa cédula
  const requiredFields = useMemo(
    () =>
      usarCedula
        ? ["identificacion", "nombre", "correo", "telefono", "rolId"]
        : [
            "identificacion",
            "nombre",
            "correo",
            "telefono",
            "rolId",
            "contraseña",
          ],
    [usarCedula]
  );

  // ¿Se puede enviar?
  const canSubmit = useMemo(() => {
    return requiredFields.every(
      (campo) => validarCampo(campo, form[campo]) === ""
    );
  }, [form, requiredFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevo = { ...form, [name]: value };
    setForm(nuevo);
    setErrores((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todo antes de enviar
    const nuevosErrores = {};
    requiredFields.forEach((campo) => {
      const error = validarCampo(campo, form[campo]);
      if (error) nuevosErrores[campo] = error;
    });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const token = localStorage.getItem("token");
      const payload = { ...form };
      if (usarCedula) delete payload.contraseña; // el backend pondrá la cédula y marcará mustChangePassword

      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return navigate("/login");
      if (res.status === 428) return navigate("/cambiar-password");

      const data = await res.json();
      if (res.ok) {
        setMensaje({ tipo: "ok", texto: "✅ Usuario creado correctamente" });
        setForm({
          identificacion: "",
          nombre: "",
          correo: "",
          telefono: "",
          contraseña: "",
          rolId: "",
        });
        setUsarCedula(true);
        setErrores({});
      } else {
        setMensaje({
          tipo: "error",
          texto: data.mensaje || "❌ Error al crear usuario",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje({
        tipo: "error",
        texto: "❌ Error al conectar con el servidor",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
        Crear Usuario
      </h2>

      {mensaje.texto && (
        <div
          className={`mb-4 text-sm font-medium text-center p-2 rounded border ${
            mensaje.tipo === "ok"
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-busy={cargando}
      >
        <div>
          <input
            type="text"
            name="identificacion"
            placeholder="Identificación"
            value={form.identificacion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            inputMode="numeric"
            autoComplete="off"
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
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="tel"
          />
          {errores.telefono && (
            <p className="text-sm text-red-600">{errores.telefono}</p>
          )}
        </div>

        {/* Usar cédula como contraseña */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={usarCedula}
              onChange={() => setUsarCedula((v) => !v)}
            />
            <span className="text-sm">
              Usar la cédula como contraseña inicial (se pedirá cambio en el
              primer inicio)
            </span>
          </label>
        </div>

        {/* Contraseña solo si NO usa cédula */}
        {!usarCedula && (
          <div className="md:col-span-2">
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña inicial (mínimo 8)"
              value={form.contraseña}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              autoComplete="new-password"
            />
            {errores.contraseña && (
              <p className="text-sm text-red-600">{errores.contraseña}</p>
            )}
          </div>
        )}

        <div className="md:col-span-2">
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
            disabled={cargando || !canSubmit}
            className={`w-full flex justify-center items-center gap-2 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
              cargando || !canSubmit
                ? "bg-gray-400"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
            }`}
          >
            {cargando && <Loader2 className="animate-spin" size={20} />}
            {cargando ? "Creando..." : "Crear Usuario"}
          </button>
        </div>

        {!cargando && !canSubmit && (
          <div className="md:col-span-2 text-center text-sm text-gray-500">
            Completa los campos requeridos para habilitar el botón.
          </div>
        )}
      </form>
    </div>
  );
};

export default CrearUsuario;
