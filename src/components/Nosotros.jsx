// Nosotros.jsx

// Sección que describe la historia y experiencia de la empresa.
const Nosotros = () => {
  return (
    <section
      id="nosotros"
      className="pt-20 pb-0 px-6 bg-white text-[var(--color-tertiary)]"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Sobre Nosotros
        </h2>

        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
          Brindamos <strong>servicios integrales</strong> en{" "}
          <strong>soluciones de equipos de cómputo</strong>, garantizando{" "}
          <strong>altos estándares de calidad</strong> para satisfacer
          plenamente las expectativas de nuestros clientes. Nos enfocamos en{" "}
          <strong>ampliar nuestra cobertura a nivel nacional</strong>,{" "}
          <strong>
            promover el desarrollo continuo de nuestros colaboradores
          </strong>{" "}
          y{" "}
          <strong>
            asegurar resultados eficientes en operación y rentabilidad
          </strong>
          .
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
              Ser reconocidos en Colombia como la <strong>mejor opción</strong>{" "}
              en{" "}
              <strong>servicios de equipos de cómputo y comunicaciones</strong>,
              destacándonos por nuestra <strong>confiabilidad</strong>,{" "}
              <strong>innovación constante</strong>,{" "}
              <strong>excelencia operativa</strong> y{" "}
              <strong>
                compromiso con el desarrollo integral de nuestro talento humano
              </strong>
              .
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
