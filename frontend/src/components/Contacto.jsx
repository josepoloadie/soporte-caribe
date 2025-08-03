// src/components/Contacto.jsx
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Contacto = () => {
  return (
    <section
      id="contacto"
      className="py-20 px-6 bg-white text-[var(--color-tertiary)]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Título de la sección */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[var(--color-primary)]">
          Contáctanos
        </h2>

        {/* Contenedor con formulario + info de contacto */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* 📝 Formulario de contacto */}
          <form
            action="https://formsubmit.co/informacion@soportecaribe.com"
            method="POST"
            className="space-y-6"
          >
            {/* Opcional: desactiva captcha y define redirección */}
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_next"
              value="https://soporte-caribe.vercel.app/"
            />

            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block mb-2 font-medium text-[var(--color-tertiary)]"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                className="w-full p-3 border border-[var(--color-neutral)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition"
              />
            </div>

            {/* Correo electrónico */}
            <div>
              <label
                htmlFor="correo"
                className="block mb-2 font-medium text-[var(--color-tertiary)]"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="tunombre@correo.com"
                className="w-full p-3 border border-[var(--color-neutral)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label
                htmlFor="mensaje"
                className="block mb-2 font-medium text-[var(--color-tertiary)]"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="4"
                placeholder="Escribe tu mensaje aquí..."
                className="w-full p-3 border border-[var(--color-neutral)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition"
              />
            </div>

            {/* Botón de enviar */}
            <button
              type="submit"
              className="bg-[var(--color-secondary)] hover:bg-[var(--color-quaternary)] text-white font-medium py-3 px-6 rounded-full transition duration-300"
            >
              Enviar mensaje
            </button>
          </form>

          <div className="flex flex-col space-y-6 text-[var(--color-tertiary)]">
            {/* Correo */}
            <div className="flex items-start gap-3">
              <FiMail className="text-[var(--color-secondary)] mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-1">
                  Correo
                </h3>
                <a
                  href="mailto:informacion@soportecaribe.com"
                  className="hover:underline"
                >
                  informacion@soportecaribe.com
                </a>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-3">
              <FiPhone className="text-[var(--color-secondary)] mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-1">
                  Teléfono
                </h3>
                <a href="tel:+573184870315" className="hover:underline">
                  +57 318 487 0315
                </a>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-start gap-3">
              <FiMapPin className="text-[var(--color-secondary)] mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-1">
                  Ubicación
                </h3>
                <p>Barranquilla, Colombia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
