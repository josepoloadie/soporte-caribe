import { motion } from "framer-motion";

function NuestrosClientes() {
  const clientes = [
    { nombre: "Soporte SA", logo: "/logos/SoporteSA.png" },
    { nombre: "Cabot Colombiana", logo: "/logos/Cabot.png" },
    { nombre: "Vygon Colombia", logo: "/logos/VygonColombia.png" },
  ];

  return (
    <section
      id="clientes"
      className="py-20 px-6 bg-gray-100 text-[var(--color-tertiary)]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[var(--color-primary)]">
          Nuestros Clientes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {clientes.map((cliente, index) => (
            <motion.div
              key={index}
              className="rounded-2xl overflow-hidden h-32 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center p-4 group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={cliente.logo}
                alt={cliente.nombre}
                className="h-24 md:h-28 object-contain mb-4 transition-transform duration-300 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NuestrosClientes;
