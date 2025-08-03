// src/components/BotonVolver.jsx
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
const BotonVolver = ({ ruta = -1 }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(ruta)}>
      <ChevronLeft size={30} strokeWidth={2.25} absoluteStrokeWidth />
    </button>
  );
};

export default BotonVolver;
