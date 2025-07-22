// Hero.jsx

// Este componente representa la sección principal (hero) del sitio.
// Se utiliza una imagen de fondo con texto centrado para dar la bienvenida.
const Hero = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen flex flex-col justify-center items-center text-center bg-[var(--color-primary)] text-white px-4 py-20"
    >
      <img
        src="./public/logos/SoporteCaribe.png"
        alt={"Logo Soporte Caribe"}
        className="w-full max-w-4xl mx-auto h-auto block"
        loading="lazy"
      />
      <p className="text-lg md:text-xl max-w-2xl mb-8">
        23 años brindando soluciones técnicas especializadas en garantías de
        computadores HP y soporte a proyectos en toda Colombia.
      </p>
      <a
        href="#contacto"
        className="bg-[var(--color-secondary)] hover:bg-[var(--color-quaternary)] text-white px-6 py-3 rounded-full text-base md:text-lg transition-colors duration-300"
      >
        Contáctanos
      </a>
    </section>
  );
};

export default Hero;
