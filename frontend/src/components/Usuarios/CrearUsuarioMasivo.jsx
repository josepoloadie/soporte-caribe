import { useEffect, useMemo, useState } from "react";
import { Loader2, Upload, FileDown, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Validaciones de frontend
const reId = /^\d{4,20}$/;
const reEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;
const rePhone = /^[0-9+\-()\s]{6,20}$/;

const HEADERS_OPCIONALES = ["contraseña"]; // si usarCedula = true, no exigimos contraseña
const HEADERS_VALIDOS = [
  "identificacion",
  "nombre",
  "correo",
  "telefono",
  "rolId",
  "rolNombre", // si viene, se mapeará a rolId
  ...HEADERS_OPCIONALES,
];

function parseCSV(texto) {
  const sep = texto.split("\n")[0]?.includes(";") ? ";" : ",";
  const lines = texto
    .replace(/\r/g, "")
    .split("\n")
    .filter((l) => l.trim().length);

  if (!lines.length) return { headers: [], rows: [] };

  const headers = lines[0]
    .split(sep)
    .map((h) => h.trim())
    .map((h) => h.replace(/\uFEFF/g, "")); // BOM

  const rows = lines.slice(1).map((line) => {
    const cols = line.split(sep).map((c) => c.trim());
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ?? "";
    });
    return obj;
  });

  return { headers, rows };
}

const CrearUsuarioMasivo = () => {
  const [roles, setRoles] = useState([]);
  const [usarCedula, setUsarCedula] = useState(true);
  const [textoPegado, setTextoPegado] = useState("");
  const [archivoNombre, setArchivoNombre] = useState("");
  const [headers, setHeaders] = useState([]);
  const [filas, setFilas] = useState([]); // filas originales
  const [erroresFila, setErroresFila] = useState([]); // array de arrays con mensajes por fila
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  // Cargar roles para mapear rolNombre -> rolId
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return navigate("/login");
        if (res.status === 428) return navigate("/cambiar-password");

        const data = await res.json();
        if (res.ok) setRoles(data || []);
        else
          setMensaje({
            tipo: "error",
            texto: data.mensaje || "Error al cargar roles",
          });
      } catch {
        setMensaje({
          tipo: "error",
          texto: "Error al conectar con el servidor",
        });
      }
    })();
  }, [navigate]);

  const mapaRolesPorNombre = useMemo(() => {
    const m = {};
    roles.forEach((r) => {
      if (r?.nombre) m[r.nombre.toLowerCase()] = r.id;
    });
    return m;
  }, [roles]);

  // Validar todas las filas cada que cambien dependencias
  useEffect(() => {
    const errs = filas.map((f) =>
      validarFila(f, usarCedula, mapaRolesPorNombre, headers)
    );
    setErroresFila(errs);
  }, [filas, usarCedula, mapaRolesPorNombre, headers]);

  const resumen = useMemo(() => {
    const total = filas.length;
    const invalidas = erroresFila.filter((e) => e.length > 0).length;
    const validas = total - invalidas;
    return { total, validas, invalidas };
  }, [filas, erroresFila]);

  function validarFila(fila, usarCed, rolesMap, hdrs) {
    const errs = [];

    // Normaliza keys
    const f = {};
    Object.keys(fila || {}).forEach(
      (k) => (f[k.trim()] = (fila[k] ?? "").toString().trim())
    );

    // Debe tener al menos los headers conocidos
    const tieneHeaderDesconocido = Object.keys(f).some(
      (k) => !HEADERS_VALIDOS.includes(k)
    );
    if (tieneHeaderDesconocido) {
      // no bloquea, solo advertimos
    }

    // Identificación
    if (!f.identificacion) errs.push("identificación requerida");
    else if (!reId.test(f.identificacion))
      errs.push("identificación 4–20 dígitos");

    // Nombre
    if (!f.nombre) errs.push("nombre requerido");

    // Correo
    if (!f.correo) errs.push("correo requerido");
    else if (!reEmail.test(f.correo)) errs.push("correo inválido");

    // Teléfono
    if (!f.telefono) errs.push("teléfono requerido");
    else if (!rePhone.test(f.telefono)) errs.push("teléfono inválido");

    // Rol: acepta rolId o rolNombre
    if (!f.rolId && !f.rolNombre) {
      errs.push("rolId o rolNombre requerido");
    } else if (!f.rolId && f.rolNombre) {
      const id = rolesMap[f.rolNombre.toLowerCase()];
      if (!id) errs.push(`rolNombre '${f.rolNombre}' no existe`);
    }

    // Contraseña (solo si NO usa cédula)
    if (!usarCed) {
      if (!f.contraseña) errs.push("contraseña requerida");
      else if (f.contraseña.length < 8)
        errs.push("contraseña mínimo 8 caracteres");
    }

    // Si el CSV trae columnas inesperadas, no bloqueamos

    // Si faltan columnas clave en header, marcamos error general
    const reqHeaders = ["identificacion", "nombre", "correo", "telefono"];
    const faltan = reqHeaders.filter((h) => !hdrs.includes(h));
    if (faltan.length) errs.push(`faltan columnas: ${faltan.join(", ")}`);

    return errs;
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoNombre(file.name);
    const text = await file.text();
    consumirTexto(text);
  };

  const consumirTexto = (text) => {
    const { headers: hdrs, rows } = parseCSV(text);
    setHeaders(hdrs);
    setFilas(rows);
    setTextoPegado(text);
    setMensaje({ tipo: "", texto: "" });
  };

  const limpiar = () => {
    setArchivoNombre("");
    setTextoPegado("");
    setHeaders([]);
    setFilas([]);
    setErroresFila([]);
    setMensaje({ tipo: "", texto: "" });
  };

  const descargarPlantilla = () => {
    const ejemplo =
      "identificacion,nombre,correo,telefono,rolId,rolNombre,contraseña\n" +
      "1001,Ana Admin,ana@sc.com,+573000000001,,Admin,\n" +
      "1002,Camilo Tecnico,camilo@sc.com,3000000002,,Tecnico,\n";
    const blob = new Blob([ejemplo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_usuarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const payloadValido = useMemo(() => {
    // transforma filas válidas a objetos esperados por backend
    return filas
      .map((fila, idx) => {
        const errs = erroresFila[idx] || [];
        if (errs.length) return null;

        const f = {};
        Object.keys(fila).forEach(
          (k) => (f[k.trim()] = (fila[k] ?? "").toString().trim())
        );

        // rolId desde rolNombre si aplica
        let rolId = f.rolId;
        if (!rolId && f.rolNombre) {
          rolId = mapaRolesPorNombre[f.rolNombre.toLowerCase()];
        }

        const o = {
          identificacion: f.identificacion,
          nombre: f.nombre,
          correo: f.correo,
          telefono: f.telefono,
          rolId,
        };

        if (!usarCedula && f.contraseña) {
          o.contraseña = f.contraseña;
        }
        return o;
      })
      .filter(Boolean);
  }, [filas, erroresFila, usarCedula, mapaRolesPorNombre]);

  const puedeEnviar = useMemo(
    () => payloadValido.length > 0 && !enviando,
    [payloadValido, enviando]
  );

  const enviar = async () => {
    setMensaje({ tipo: "", texto: "" });
    setEnviando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/usuarios/masivo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuarios: payloadValido }),
      });

      if (res.status === 401) {
        setEnviando(false);
        return navigate("/login");
      }
      if (res.status === 428) {
        setEnviando(false);
        return navigate("/cambiar-password");
      }

      const data = await res.json();
      if (!res.ok) {
        setMensaje({
          tipo: "error",
          texto: data.mensaje || "Error en carga masiva",
        });
        setEnviando(false);
        return;
      }

      // Mostrar resumen
      const c = data?.resultados?.creados?.length || 0;
      const d = data?.resultados?.duplicados?.length || 0;
      const e = data?.resultados?.errores?.length || 0;
      setMensaje({
        tipo: "ok",
        texto: `✅ Carga completada. Creados: ${c} · Duplicados: ${d} · Errores: ${e}`,
      });

      // Opcional: permitir descargar reporte de errores
      setReporteErrores(buildReporteErrores(data?.resultados));
    } catch {
      setMensaje({ tipo: "error", texto: "Error de red al enviar" });
    } finally {
      setEnviando(false);
    }
  };

  const [reporteErrores, setReporteErrores] = useState("");
  function buildReporteErrores(resultados) {
    const filasErr = (resultados?.errores || []).map((r) => ({
      identificacion: r?.usuario?.identificacion ?? "",
      nombre: r?.usuario?.nombre ?? "",
      correo: r?.usuario?.correo ?? "",
      telefono: r?.usuario?.telefono ?? "",
      rolId: r?.usuario?.rolId ?? "",
      error: r?.error ?? "",
    }));
    const dups = (resultados?.duplicados || []).map((r) => ({
      identificacion: r?.identificacion ?? "",
      error: "Duplicado",
    }));

    const all = [
      "identificacion,nombre,correo,telefono,rolId,error",
      ...filasErr.map(
        (r) =>
          `${r.identificacion},${r.nombre},${r.correo},${r.telefono},${
            r.rolId
          },"${(r.error || "").replace(/"/g, '""')}"`
      ),
      ...dups.map((r) => `${r.identificacion},,,,,${r.error}`),
    ].join("\n");

    return all;
  }

  const descargarReporte = () => {
    if (!reporteErrores) return;
    const blob = new Blob([reporteErrores], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_errores_carga_usuarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          Crear Usuario Masivo
        </h2>
        <div className="flex gap-2">
          <button
            onClick={descargarPlantilla}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50"
            type="button"
          >
            <FileDown size={16} /> Plantilla CSV
          </button>
          <label className="flex items-center gap-2 px-3 py-2 text-sm border rounded cursor-pointer hover:bg-gray-50">
            <Upload size={16} /> Cargar CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={onFile}
            />
          </label>
          <button
            onClick={limpiar}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50"
            type="button"
          >
            <Trash2 size={16} /> Limpiar
          </button>
        </div>
      </div>

      {archivoNombre && (
        <p className="text-sm text-gray-600 mb-2">
          Archivo: <span className="font-medium">{archivoNombre}</span>
        </p>
      )}

      <div className="mb-4">
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

      <textarea
        className="w-full h-40 border rounded p-2 font-mono text-sm"
        placeholder="Pega aquí tu CSV con encabezados: identificacion,nombre,correo,telefono,rolId,rolNombre,contraseña"
        value={textoPegado}
        onChange={(e) => consumirTexto(e.target.value)}
      />

      {mensaje.texto && (
        <div
          className={`mt-4 mb-2 text-sm font-medium p-2 rounded border ${
            mensaje.tipo === "ok"
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Resumen */}
      <div className="flex flex-wrap items-center gap-3 text-sm my-3">
        <span className="px-2 py-1 rounded bg-gray-100">
          Total: {resumen.total}
        </span>
        <span className="px-2 py-1 rounded bg-green-100 text-green-800">
          Válidas: {resumen.validas}
        </span>
        <span className="px-2 py-1 rounded bg-red-100 text-red-800">
          Inválidas: {resumen.invalidas}
        </span>
      </div>

      {/* Previsualización */}
      {filas.length > 0 && (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left">#</th>
                {headers.map((h) => (
                  <th key={h} className="px-2 py-2 text-left">
                    {h}
                  </th>
                ))}
                <th className="px-2 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, idx) => {
                const errores = erroresFila[idx] || [];
                const ok = errores.length === 0;
                return (
                  <tr key={idx} className={ok ? "" : "bg-red-50"}>
                    <td className="px-2 py-2">{idx + 1}</td>
                    {headers.map((h) => (
                      <td key={h} className="px-2 py-2">
                        {(fila[h] ?? "").toString()}
                      </td>
                    ))}
                    <td className="px-2 py-2">
                      {ok ? "✅ OK" : `❌ ${errores.join("; ")}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Acciones */}
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          disabled={!puedeEnviar}
          onClick={enviar}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white transition 
            ${
              puedeEnviar
                ? "bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          {enviando && <Loader2 className="animate-spin" size={18} />}
          {enviando
            ? "Enviando..."
            : `Enviar (${payloadValido.length} válidas)`}
        </button>

        {reporteErrores && (
          <button
            onClick={descargarReporte}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50"
            type="button"
          >
            <FileDown size={16} /> Descargar reporte de errores
          </button>
        )}
      </div>
    </div>
  );
};

export default CrearUsuarioMasivo;
