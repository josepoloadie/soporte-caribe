// NuestroClientes.jsx

// Muestra una lista de logotipos de clientes con nombre. Están centrados y animados al hacer hover.
import { motion } from "framer-motion";
function NuestrosClientes() {
  const clientes = [
    { nombre: "Soporte SA", logo: "/logos/SoporteSA.webp" },
    { nombre: "Cabot Colombiana", logo: "/logos/Cabot.png" },
    { nombre: "Vygon Colombia", logo: "/logos/VygonColombia.png" },
  ];

  return (
    <section className="py-16 px-4 bg-white text-center" id="clientes">
      <h2 className="text-3xl font-bold text-[#004A97] mb-12">
        Nuestros Clientes
      </h2>

      <div className="flex flex-wrap justify-center gap-20">
        {clientes.map((cliente, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="transition-transform md:hover:scale-125">
              <img
                src={cliente.logo}
                alt={cliente.nombre}
                className="bg-primary/40 p-4 rounded-lg h-20 mb-2 object-contain"
              />

              <p className="text-sm font-semibold text-[#3C3C3B] text-center">
                {cliente.nombre}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default NuestrosClientes;
