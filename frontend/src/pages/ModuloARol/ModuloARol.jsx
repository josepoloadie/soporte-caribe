import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AsignarModuloARol({ onClose }) {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cargandoAsignados, setCargandoAsignados] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [roles, setRoles] = useState([]);
  const [modulos, setModulos] = useState([]);

  const [rolId, setRolId] = useState("");
  const [asignados, setAsignados] = useState(new Set());
  const [asignadosInicial, setAsignadosInicial] = useState(new Set());

  const [q, setQ] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  useEffect(() => {
    const cargarBasicos = async () => {
      try {
        setCargando(true);
        setError("");
        const [rRoles, rModulos] = await Promise.all([
          fetch(`${API_URL}/roles`, { headers: authHeaders }),
          fetch(`${API_URL}/modulos`, { headers: authHeaders }),
        ]);

        const [dRoles, dModulos] = await Promise.all([
          rRoles.json(),
          rModulos.json(),
        ]);
        if (!Array.isArray(dRoles))
          throw new Error("Formato inesperado de roles");
        if (!Array.isArray(dModulos))
          throw new Error("Formato inesperado de módulos");

        setRoles(dRoles);
        setModulos(dModulos);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    };
    cargarBasicos();
  }, [authHeaders]);

  const cargarAsignados = useCallback(async () => {
    if (!rolId) {
      setAsignados(new Set());
      setAsignadosInicial(new Set());
      return;
    }
    try {
      setCargandoAsignados(true);
      setError("");
      const res = await fetch(`${API_URL}/roles/${rolId}/modulos`, {
        headers: authHeaders,
      });
      const data = await res.json();
      const lista = Array.isArray(data?.modulos) ? data.modulos : [];
      const ids = new Set(lista.map((m) => m.id));
      setAsignados(ids);
      setAsignadosInicial(new Set(ids));
    } catch (e) {
      setError(e.message);
      setAsignados(new Set());
      setAsignadosInicial(new Set());
    } finally {
      setCargandoAsignados(false);
    }
  }, [rolId, authHeaders]);

  useEffect(() => {
    cargarAsignados();
  }, [cargarAsignados]);

  const modulosFiltrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return modulos;
    return modulos.filter((m) => `${m.nombre}`.toLowerCase().includes(term));
  }, [q, modulos]);

  const porAgregar = useMemo(
    () => Array.from(asignados).filter((id) => !asignadosInicial.has(id)),
    [asignados, asignadosInicial]
  );
  const porEliminar = useMemo(
    () => Array.from(asignadosInicial).filter((id) => !asignados.has(id)),
    [asignados, asignadosInicial]
  );
  const hayCambios = porAgregar.length > 0 || porEliminar.length > 0;

  const toggleModulo = (id) => {
    setAsignados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const seleccionarTodos = () => {
    setAsignados(new Set(modulosFiltrados.map((m) => m.id)));
  };

  const limpiarSeleccion = () => setAsignados(new Set());

  const aplicarCambios = async () => {
    const peticionesCambios = [];

    if (porAgregar.length) {
      peticionesCambios.push(
        fetch(`${API_URL}/roles/${rolId}/modulos`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ moduloIds: porAgregar }),
        })
      );
    }

    if (porEliminar.length) {
      for (const id of porEliminar) {
        peticionesCambios.push(
          fetch(`${API_URL}/roles/${rolId}/modulos/${id}`, {
            method: "DELETE",
            headers: authHeaders,
          })
        );
      }
    }

    if (!peticionesCambios.length) return { ok: true };

    const resultados = await Promise.allSettled(peticionesCambios);
    const errores = [];

    for (const r of resultados) {
      if (r.status === "fulfilled") {
        if (!r.value.ok) {
          try {
            const data = await r.value.json();
            errores.push(data?.mensaje || `Error ${r.value.status}`);
          } catch {
            errores.push(`Error ${r.value.status}`);
          }
        }
      } else {
        errores.push(r.reason?.message || "Fallo de red");
      }
    }

    if (errores.length) throw new Error(errores.join(" · "));
    return { ok: true };
  };

  const guardar = async () => {
    if (!rolId) {
      setError("Selecciona un rol primero");
      return;
    }
    try {
      setGuardando(true);
      setError("");
      await aplicarCambios();
      await cargarAsignados();
      setMensaje("Cambios aplicados");
      setTimeout(() => setMensaje(""), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const listaBloqueada = cargando || guardando || cargandoAsignados;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Asignar módulos a un rol</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border hover:bg-gray-50"
          >
            Cerrar
          </button>
        )}
      </div>

      {cargando ? (
        <div className="animate-pulse p-6 border rounded-2xl">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-10 w-full bg-gray-200 rounded mb-4" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      ) : (
        <div className="space-y-6">
          {(error || mensaje) && (
            <div
              className={`rounded-xl p-3 text-sm ${
                error
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {error || mensaje}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-600">Rol</span>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                value={rolId}
                onChange={(e) => setRolId(e.target.value)}
                disabled={guardando || cargandoAsignados}
              >
                <option value="">— Selecciona un rol —</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Buscar módulos</span>
              <input
                type="text"
                placeholder="Escribe para filtrar…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                disabled={listaBloqueada}
              />
            </label>
          </div>

          <div className="relative border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>
                  {modulosFiltrados.length} módulo(s) · seleccionados{" "}
                  {asignados.size}
                </span>
                {rolId && (
                  <span>
                    · cambios:{" "}
                    <span className="font-medium">+{porAgregar.length}</span> /{" "}
                    <span className="font-medium">-{porEliminar.length}</span>
                  </span>
                )}
                {cargandoAsignados && (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                    Refrescando…
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={seleccionarTodos}
                  disabled={listaBloqueada}
                  className="text-sm px-2 py-1 rounded-lg border hover:bg-white disabled:opacity-50"
                >
                  Seleccionar filtrados
                </button>
                <button
                  onClick={limpiarSeleccion}
                  disabled={listaBloqueada}
                  className="text-sm px-2 py-1 rounded-lg border hover:bg-white disabled:opacity-50"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <ul
              className={`max-h-80 overflow-auto divide-y ${
                listaBloqueada
                  ? "pointer-events-none select-none opacity-60"
                  : ""
              }`}
              aria-busy={listaBloqueada}
            >
              {modulosFiltrados.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between px-4 py-2"
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={asignados.has(m.id)}
                      onChange={() => toggleModulo(m.id)}
                      className="h-4 w-4 rounded"
                      disabled={listaBloqueada}
                    />
                    <span className="font-medium">{m.nombre}</span>
                  </label>
                  <code className="text-xs text-gray-400 hidden sm:block">
                    {m.id}
                  </code>
                </li>
              ))}
              {!modulosFiltrados.length && (
                <li className="px-4 py-6 text-center text-sm text-gray-500">
                  No hay módulos que coincidan con el filtro.
                </li>
              )}
            </ul>

            {listaBloqueada && (
              <div className="absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="h-5 w-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                  Procesando…
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              disabled={!rolId || !hayCambios || guardando}
              onClick={guardar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
            >
              {guardando && (
                <span className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
              )}
              {guardando ? "Aplicando…" : "Aplicar cambios"}
            </button>
          </div>

          <div className="border rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Módulos seleccionados</h3>
            {asignados.size ? (
              <div className="flex flex-wrap gap-2">
                {Array.from(asignados).map((id) => {
                  const mod = modulos.find((m) => m.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full"
                    >
                      {mod?.nombre || id}
                      <button
                        onClick={() => toggleModulo(id)}
                        className="hover:opacity-70"
                        title="Quitar"
                        disabled={listaBloqueada}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Aún no has seleccionado módulos.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
