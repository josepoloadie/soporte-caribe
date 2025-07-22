// Servicios.jsx

// Sección que describe los servicios que ofrece la empresa.
import NuestrosClientes from "./NuestroClientes";
const Servicios = () => {
  const servicios = [
    {
      titulo: "Garantías HP",
      descripcion:
        "Atendemos casos de garantía para equipos HP en todo el país, con técnicos certificados y piezas originales.",
    },
    {
      titulo: "Soporte en Proyectos",
      descripcion:
        "Participamos en proyectos tecnológicos brindando soporte técnico diario, con seguimiento y calidad garantizada.",
    },
    {
      titulo: "Mantenimiento Preventivo",
      descripcion:
        "Programas de mantenimiento para equipos críticos y de uso general, adaptados a la frecuencia requerida.",
    },
  ];

  return (
    <section
      id="servicios"
      className="py-20 px-6 bg-white text-[var(--color-tertiary)]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Nuestros Servicios
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-[var(--color-neutral)] rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-[var(--color-secondary)]">
                {servicio.titulo}
              </h3>
              <p className="text-base text-[var(--color-quaternary)]">
                {servicio.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
      <NuestrosClientes />
    </section>
  );
};

export default Servicios;
