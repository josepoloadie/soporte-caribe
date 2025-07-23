// Servicios.jsx

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import NuestrosClientes from "./NuestroClientes";

const Servicios = () => {
  const servicios = [
    {
      titulo: "Garantías HP",
      descripcion:
        "Actuamos como coadministradores de garantías HP, verificando la cobertura, gestionando solicitudes de servicio técnico y coordinando con centros autorizados. Acompañamos al cliente durante todo el proceso para garantizar una atención rápida, transparente y conforme a los lineamientos de HP.",
      imagen: "/carrusel/FieldSupport.jpg",
    },
    {
      titulo: "Soporte TI",
      descripcion:
        "Brindamos soporte técnico integral para equipos, redes, servidores y software, garantizando disponibilidad, seguridad y continuidad operativa. Incluye mantenimiento, monitoreo, gestión de incidentes y asesoría en infraestructura TI, con acompañamiento experto y soluciones oportunas.",
      imagen: "/carrusel/FieldSupport2.jpg",
    },
    {
      titulo: "Migración de Equipos de Cómputo",
      descripcion:
        "Realizamos el traslado, reemplazo o actualización de estaciones de trabajo asegurando continuidad operativa, respaldo seguro de información y configuración completa del entorno. Incluye inventario, backup, instalación de software, pruebas de red y soporte post-migración.",
      imagen: "/carrusel/FieldSupport2.jpg",
    },
    {
      titulo: "Mantenimiento de Equipos",
      descripcion:
        "Realizamos mantenimiento preventivo y correctivo para computadores, impresoras y plotters. Incluye limpieza técnica, revisión de componentes, reparación de fallas y actualización de software. Disponible en Barranquilla y Cartagena.",
      imagen: "/carrusel/FieldSupport3.jpg", // Usa la imagen que represente el servicio
    },
    {
      titulo: "Soporte en Redes de Datos",
      descripcion:
        "Diseñamos, configuramos y damos mantenimiento a redes cableadas e inalámbricas. Solucionamos fallas de conectividad, optimizamos el rendimiento y garantizamos la seguridad de tu infraestructura de red.",
      imagen: "/carrusel/FieldSupport2.jpg", // Asegúrate de tener esta imagen o usa una representativa
    },
  ];

  return (
    <section
      id="servicios"
      className="pt-20 pb-0 px-6 bg-gray-100 text-[var(--color-tertiary)]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Nuestros Servicios
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {servicios.map((servicio, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative rounded-2xl overflow-hidden h-64 shadow-md hover:shadow-xl transition-shadow duration-300 group"
                style={{
                  backgroundImage: `url(${servicio.imagen})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Capa oscura encima de la imagen */}
                <div className="absolute inset-0 bg-[var(--color-neutral)]/50 backdrop-blur-md" />

                <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center text-white">
                  <h3 className="text-xl font-semibold mb-2">
                    {servicio.titulo}
                  </h3>
                  <p className="text-sm">{servicio.descripcion}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <NuestrosClientes />
    </section>
  );
};

export default Servicios;
