import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const reId = /^\d{4,20}$/;
const reEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;
const rePhone = /^[0-9+\-()\s]{6,20}$/;

const EditarUsuario = ({ user, volver }) => {
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [cargando, setCargando] = useState(true); // carga inicial
  const [guardando, setGuardando] = useState(false); // al guardar

  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    correo: "",
    telefono: "",
    contraseña: "", // opcional: si se deja vacío, no se cambia
    rolId: "",
    status: true,
    mustChangePassword: false, // toggle para forzar cambio
  });

  // --- Validación por campo
  const validarCampo = (nombre, valor) => {
    switch (nombre) {
      case "identificacion":
        if (!valor) return "La identificación es obligatoria";
        if (!reId.test(valor)) return "Debe tener 4–20 dígitos";
        break;
      case "nombre":
        if (!valor.trim()) return "El nombre es obligatorio";
        break;
      case "correo":
        if (!valor) return "El correo es obligatorio";
        if (!reEmail.test(valor)) return "Correo no válido";
        break;
      case "telefono":
        if (!valor) return "El teléfono es obligatorio";
        if (!rePhone.test(valor)) return "Teléfono no válido";
        break;
      case "contraseña":
        // Solo validamos si el admin quiere cambiarla (no está vacía)
        if (valor && valor.length < 8) return "Mínimo 8 caracteres";
        break;
      case "rolId":
        if (!valor) return "Seleccione un rol";
        break;
      default:
        break;
    }
    return "";
  };

  const [errores, setErrores] = useState({});

  const canSubmit = useMemo(() => {
    // Campos requeridos siempre
    const requeridos = [
      "identificacion",
      "nombre",
      "correo",
      "telefono",
      "rolId",
    ];
    // Si hay contraseña escrita, debe ser válida
    if (form.contraseña) requeridos.push("contraseña");
    return requeridos.every((c) => validarCampo(c, form[c]) === "");
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevo = { ...form, [name]: type === "checkbox" ? checked : value };
    setForm(nuevo);
    setErrores((prev) => ({
      ...prev,
      [name]: validarCampo(name, nuevo[name]),
    }));
  };

  // --- Carga inicial: usuario + roles
  useEffect(() => {
    const fetchDatos = async () => {
      setCargando(true);
      setMensaje({ tipo: "", texto: "" });
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

        if (usuarioRes.status === 401 || rolesRes.status === 401) {
          return (window.location.href = "/login");
        }
        if (usuarioRes.status === 428 || rolesRes.status === 428) {
          return (window.location.href = "/cambiar-password");
        }

        const usuarioData = await usuarioRes.json();
        const rolesData = await rolesRes.json();

        if (!usuarioRes.ok) {
          setMensaje({
            tipo: "error",
            texto: usuarioData.mensaje || "Error al cargar usuario",
          });
          return;
        }

        setUsuario(usuarioData);
        setForm({
          identificacion: usuarioData.identificacion ?? "",
          nombre: usuarioData.nombre ?? "",
          correo: usuarioData.correo ?? "",
          telefono: usuarioData.telefono ?? "",
          contraseña: "",
          rolId: usuarioData.rolId ?? usuarioData?.rol?.id ?? "",
          status: usuarioData.status ?? true,
          mustChangePassword: usuarioData.mustChangePassword ?? false,
        });

        if (Array.isArray(rolesData)) setRoles(rolesData);
        else
          setMensaje({
            tipo: "error",
            texto: rolesData.mensaje || "Error al cargar roles",
          });
      } catch (error) {
        setMensaje(
          {
            tipo: "error",
            texto: "Error al conectar con el servidor",
          },
          error
        );
      } finally {
        setCargando(false);
      }
    };

    if (user?.id) fetchDatos();
  }, [user?.id]);

  // --- Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todo
    const nuevosErrores = {};
    ["identificacion", "nombre", "correo", "telefono", "rolId"].forEach((c) => {
      const err = validarCampo(c, form[c]);
      if (err) nuevosErrores[c] = err;
    });
    if (form.contraseña) {
      const err = validarCampo("contraseña", form.contraseña);
      if (err) nuevosErrores.contraseña = err;
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const token = localStorage.getItem("token");

      // Construir payload: si contraseña viene vacía, no enviarla
      const payload = {
        identificacion: form.identificacion,
        nombre: form.nombre,
        correo: form.correo,
        telefono: form.telefono,
        rolId: form.rolId,
        status: form.status,
        mustChangePassword: form.mustChangePassword, // permite forzar cambio
      };
      if (form.contraseña) payload.contraseña = form.contraseña;

      const res = await fetch(`${API_URL}/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return (window.location.href = "/login");
      if (res.status === 428)
        return (window.location.href = "/cambiar-password");

      const data = await res.json();
      if (res.ok) {
        setMensaje({
          tipo: "ok",
          texto: "✅ Usuario actualizado correctamente",
        });
        // limpia la contraseña tras guardar
        setForm((f) => ({ ...f, contraseña: "" }));
      } else {
        setMensaje({
          tipo: "error",
          texto: data.mensaje || "❌ Error al actualizar",
        });
      }
    } catch (error) {
      setMensaje(
        {
          tipo: "error",
          texto: "❌ Error al conectar con el servidor",
        },
        error
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center gap-2 text-gray-700">
        <Loader2 className="animate-spin" /> Cargando usuario…
      </div>
    );
  }
  if (!usuario) {
    return (
      <div className="p-6 text-red-700 bg-red-50 border border-red-200 rounded">
        {mensaje.texto || "No se encontró el usuario"}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
        Editar Usuario
      </h2>

      {mensaje.texto && (
        <div
          className={`mb-4 text-sm font-medium p-2 rounded border ${
            mensaje.tipo === "ok"
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="identificacion"
            value={form.identificacion}
            onChange={handleChange}
            placeholder="Identificación"
            className="w-full border p-2 rounded"
            inputMode="numeric"
            required
          />
          {errores.identificacion && (
            <p className="text-sm text-red-600">{errores.identificacion}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border p-2 rounded"
            required
          />
          {errores.nombre && (
            <p className="text-sm text-red-600">{errores.nombre}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Correo"
            className="w-full border p-2 rounded"
            autoComplete="email"
            required
          />
          {errores.correo && (
            <p className="text-sm text-red-600">{errores.correo}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full border p-2 rounded"
            autoComplete="tel"
            required
          />
          {errores.telefono && (
            <p className="text-sm text-red-600">{errores.telefono}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="contraseña"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Nueva contraseña (dejar vacío para no cambiar)"
            className="w-full border p-2 rounded"
            autoComplete="new-password"
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
            required
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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
          />
          Usuario habilitado
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="mustChangePassword"
            checked={form.mustChangePassword}
            onChange={handleChange}
          />
          Forzar cambio de contraseña en el próximo inicio
        </label>

        <div className="flex justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={guardando || !canSubmit}
            className={`flex-1 flex justify-center items-center gap-2 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
              guardando || !canSubmit
                ? "bg-gray-400"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
            }`}
          >
            {guardando && <Loader2 className="animate-spin" size={18} />}
            {guardando ? "Guardando…" : "Guardar Cambios"}
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
