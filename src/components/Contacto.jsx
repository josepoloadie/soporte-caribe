// src/components/Contacto.jsx

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
          <form className="space-y-6">
            {/* Campo: Nombre */}
            <div>
              <label className="block mb-2 font-medium" htmlFor="nombre">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="w-full p-3 border rounded-lg border-[var(--color-neutral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Tu nombre"
              />
            </div>

            {/* Campo: Correo electrónico */}
            <div>
              <label className="block mb-2 font-medium" htmlFor="correo">
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="w-full p-3 border rounded-lg border-[var(--color-neutral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="tunombre@correo.com"
              />
            </div>

            {/* Campo: Mensaje */}
            <div>
              <label className="block mb-2 font-medium" htmlFor="mensaje">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="4"
                className="w-full p-3 border rounded-lg border-[var(--color-neutral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>

            {/* Botón de enviar */}
            <button
              type="submit"
              className="bg-[var(--color-secondary)] hover:bg-[var(--color-quaternary)] text-white font-medium py-3 px-6 rounded-full transition duration-300"
            >
              Enviar mensaje
            </button>
          </form>

          {/* 📍 Información de contacto */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-1">
                Correo
              </h3>
              <p>soporte@soportecaribe.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-1">
                Teléfono
              </h3>
              <p>+57 301 234 5678</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-secondary)] mb-1">
                Ubicación
              </h3>
              <p>Barranquilla, Colombia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
