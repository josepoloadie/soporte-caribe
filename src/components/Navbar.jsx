import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Usa lucide-react para íconos modernos

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-primary)] shadow-md"
          : "bg-[var(--color-primary)] md:bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#inicio">
          <img
            src="/logos/LetrasSoporteCaribeBlancas.png"
            alt="Soporte Caribe Logo"
            className={`h-10 md:h-12 object-contain transition-opacity duration-500 ${
              scrolled
                ? "opacity-100 cursor-pointer"
                : "opacity-0 cursor-default "
            }`}
          />
        </a>

        {/* Botón hamburguesa para móviles */}
        <button
          className="text-white md:hidden"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú escritorio */}
        <ul className="hidden md:flex space-x-6 text-white font-medium text-sm">
          <li>
            <a href="#inicio" className="hover:underline">
              Inicio
            </a>
          </li>
          <li>
            <a href="#servicios" className="hover:underline">
              Servicios
            </a>
          </li>
          <li>
            <a href="#nosotros" className="hover:underline">
              Nosotros
            </a>
          </li>
          <li>
            <a href="#contacto" className="hover:underline">
              Contacto
            </a>
          </li>
        </ul>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[var(--color-primary)] text-white py-6 px-6 z-40 shadow-lg">
          <ul className="space-y-4 text-base">
            <li>
              <a href="#inicio" onClick={toggleMenu}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#servicios" onClick={toggleMenu}>
                Servicios
              </a>
            </li>
            <li>
              <a href="#nosotros" onClick={toggleMenu}>
                Nosotros
              </a>
            </li>
            <li>
              <a href="#contacto" onClick={toggleMenu}>
                Contacto
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
