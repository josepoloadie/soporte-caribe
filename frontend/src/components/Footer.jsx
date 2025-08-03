// Footer.jsx

// Pie de página con derechos reservados
const Footer = () => {
  return (
    <footer className="bg-[var(--color-tertiary)] text-white py-6 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Soporte Caribe. Todos los derechos
        reservados.
      </p>
    </footer>
  );
};

export default Footer;
