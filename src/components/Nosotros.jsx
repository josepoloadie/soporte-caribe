// Nosotros.jsx

// Sección que describe la historia y experiencia de la empresa.
const Nosotros = () => {
  return (
    <section
      id="nosotros"
      className="py-20 px-6 bg-white text-[var(--color-tertiary)]"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Sobre Nosotros
        </h2>

        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
          En <strong>Soporte Caribe</strong> contamos con más de{" "}
          <strong>23 años de experiencia</strong> brindando servicios técnicos
          especializados. Nos destacamos por ofrecer una atención{" "}
          <strong>eficiente, confiable</strong> y con{" "}
          <strong>altos estándares de calidad</strong> en cada solución que
          entregamos.
          <br className="hidden md:block" />
          <span className="block mt-4 text-[var(--color-secondary)] font-semibold text-sm">
            Con nosotros, tu tecnología está en manos seguras.
          </span>
        </p>
        <br></br>
        <div className="grid md:grid-cols-2 gap-12 text-left">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[var(--color-secondary)] mb-3">
              Misión
            </h3>
            <p className="text-base text-[var(--color-tertiary)] leading-relaxed">
              Brindar <strong>soluciones técnicas oportunas y efectivas</strong>{" "}
              en el campo de la tecnología, generando <strong>confianza</strong>{" "}
              y <strong>respaldo</strong> a nuestros clientes a nivel nacional.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[var(--color-secondary)] mb-3">
              Visión
            </h3>
            <p className="text-base text-[var(--color-tertiary)] leading-relaxed">
              Ser la{" "}
              <strong>
                empresa líder en soporte técnico especializado en Colombia
              </strong>
              , reconocida por su <strong>compromiso</strong>,{" "}
              <strong>experiencia</strong> y{" "}
              <strong>excelencia en el servicio</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
