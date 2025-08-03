import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const NoAutorizado = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <Lock size={48} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-tertiary)] mb-2">
          Acceso Denegado
        </h1>
        <p className="text-gray-600 mb-6">
          No tienes permiso para acceder a esta página.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[var(--color-primary)] text-white px-6 py-2 rounded hover:bg-[var(--color-secondary)] transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NoAutorizado;
