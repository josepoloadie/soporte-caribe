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
        scrolled ? "bg-[var(--color-primary)] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">Soporte Caribe</h1>

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
        <ul className="md:hidden bg-[var(--color-primary)] px-6 pb-4 text-white space-y-4 text-base">
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
      )}
    </nav>
  );
};

export default Navbar;
