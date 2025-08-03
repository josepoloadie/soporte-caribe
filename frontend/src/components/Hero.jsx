// Hero.jsx

// Este componente representa la sección principal (hero) del sitio.
// Se utiliza una imagen de fondo con texto centrado para dar la bienvenida.

import { useEffect, useState } from "react";

// Lista de imágenes
const images = [
  "/carrusel/FieldSupport.jpg",
  "/carrusel/FieldSupport2.jpg",
  "/carrusel/FieldSupport3.jpg",
];
const Hero = () => {
  const [index, setIndex] = useState(0);
  // Cambia la imagen cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center items-center text-center text-white px-4 py-20 overflow-hidden"
    >
      {/* Imagen de fondo carrusel */}
      <img
        src={images[index]}
        alt="Imagen de soporte técnico"
        className="absolute inset-0 w-full h-full object-cover object-center max-h-screen transition-opacity duration-1000"
      />

      {/* Capa de color superpuesta */}
      <div className="absolute inset-0 bg-[var(--color-secondary)]/40 backdrop-blur-sm" />

      {/* Contenido encima */}
      <div className="relative z-10 max-w-3xl">
        <img
          src="/logos/SoporteCaribe.png"
          alt="Logo Soporte Caribe"
          className="w-72 mx-auto mb-6"
          loading="lazy"
        />
        <p className="text-lg md:text-xl mb-8">
          Más de dos décadas de experiencia respaldando garantías HP y proyectos
          tecnológicos en todo el país.
        </p>
        <a
          href="#contacto"
          className="bg-[var(--color-secondary)] hover:bg-[var(--color-quaternary)] text-white px-6 py-3 rounded-full text-base md:text-lg transition duration-300"
        >
          Contáctanos
        </a>
      </div>
    </section>
  );
};

export default Hero;
