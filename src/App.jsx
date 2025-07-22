// src/App.jsx

// Importación de componentes principales de la página
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Servicios from "./components/Servicios";
import Nosotros from "./components/Nosotros";
import Contacto from "./components/Contacto";
import Footer from "./components/Footer";

// Ícono de WhatsApp desde react-icons
import { FaWhatsapp } from "react-icons/fa";

/**
 * Componente principal de la aplicación.
 * Renderiza una página de una sola vista con navegación por secciones.
 * Incluye un botón flotante de WhatsApp fijo en la esquina inferior derecha.
 */
function App() {
  return (
    <>
      {/* Barra de navegación superior */}
      <Navbar />

      {/* Contenido principal de la página */}
      <main>
        <Hero /> {/* Sección inicial o portada */}
        <Servicios /> {/* Sección de servicios ofrecidos */}
        <Nosotros /> {/* Sección sobre la empresa */}
        <Contacto /> {/* Sección de contacto con formulario */}
        <Footer /> {/* Pie de página */}
      </main>

      {/* Botón flotante de WhatsApp (enlace directo al chat) */}
      <a
        href="https://wa.me/573001112233" // ← Cambia este número por el de tu empresa (formato internacional sin espacios)
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300 z-50"
      >
        <FaWhatsapp size={24} />
      </a>
    </>
  );
}

export default App;
