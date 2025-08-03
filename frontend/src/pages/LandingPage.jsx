// src/public/LandingPage.jsx
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Servicios from "../components/Servicios";
import Nosotros from "../components/Nosotros";
import Contacto from "../components/Contacto";
import Footer from "../components/Footer";
import { FaWhatsapp } from "react-icons/fa";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Servicios />
        <Nosotros />
        <Contacto />
        <Footer />
      </main>
      <a
        href="https://wa.me/+573184870315"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300 z-50"
      >
        <FaWhatsapp size={24} />
      </a>
    </>
  );
};

export default LandingPage;
