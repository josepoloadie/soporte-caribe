// Nosotros.jsx

// Sección que describe la historia y experiencia de la empresa.
const Nosotros = () => {
  return (
    <section
      id="nosotros"
      className="py-20 px-6 bg-gray-100 text-[var(--color-tertiary)]"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Sobre Nosotros
        </h2>

        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
          En <strong>Soporte Caribe</strong> llevamos más de 23 años prestando
          servicios técnicos especializados. Nuestra experiencia nos permite
          garantizar atención eficiente, confiable y con altos estándares de
          calidad.
        </p>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          <div>
            <h3 className="text-2xl font-semibold text-[var(--color-secondary)] mb-3">
              Misión
            </h3>
            <p>
              Brindar soluciones técnicas oportunas y efectivas en tecnología,
              generando confianza y respaldo a nuestros clientes a nivel
              nacional.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-[var(--color-secondary)] mb-3">
              Visión
            </h3>
            <p>
              Ser la empresa líder en soporte técnico especializado en Colombia,
              reconocida por su compromiso, experiencia y excelencia en el
              servicio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
