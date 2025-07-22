// Servicios.jsx

// Sección que describe los servicios que ofrece la empresa.
import NuestrosClientes from "./NuestroClientes";
const Servicios = () => {
  const servicios = [
    {
      titulo: "Garantías HP",
      descripcion:
        "Somos un centro de servicios autorizado por HP. Atendemos garantías de equipos HP en Barranquilla y Cartagena, con técnicos certificados y repuestos originales.",
      imagen: "/carrusel/FieldSupport.jpg",
    },
    {
      titulo: "Soporte en Proyectos",
      descripcion:
        "Brindamos soporte técnico diario en proyectos tecnológicos, garantizando seguimiento continuo y altos estándares de calidad.",
      imagen: "/carrusel/FieldSupport2.jpg",
    },
    {
      titulo: "Mantenimiento Preventivo",
      descripcion:
        "Ofrecemos mantenimiento preventivo para equipos de diferentes niveles de criticidad. Cada servicio incluye diagnóstico, limpieza integral, revisión de componentes clave y pruebas de funcionamiento.",
      imagen: "/carrusel/FieldSupport3.jpg",
    },
  ];

  return (
    <section
      id="servicios"
      className="py-20 px-6 bg-gray-100 text-[var(--color-tertiary)]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Nuestros Servicios
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden h-64 shadow-md hover:shadow-xl transition-shadow duration-300 group"
              style={{
                backgroundImage: `url(${servicio.imagen})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Capa de color superpuesta */}
              <div className="absolute inset-0 bg-[var(--color-neutral)]/50 backdrop-blur-md" />

              {/* Contenido */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                <h3 className="text-xl font-semibold mb-2">
                  {servicio.titulo}
                </h3>
                <p className="text-sm">{servicio.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NuestrosClientes />
    </section>
  );
};

export default Servicios;
