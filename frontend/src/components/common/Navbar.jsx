import { Link } from "react-router-dom";

const Navbar = ({ simple = false }) => {
  return (
    <nav className="w-full text-white fixed top-0 left-0 z-50 shadow-xl" style={{ backgroundColor: '#2F5249' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform">
          DineEase
        </Link>

        {/* Nav Links */}
        {simple ? (
          <Link
            to="/"
            className="text-lg font-semibold hover:opacity-80 transition"
          >
            Home
          </Link>
        ) : (
          <ul className="hidden md:flex gap-10 text-lg font-medium">
            <li>
              <a href="#features" className="hover:opacity-80 transition">
                Features
              </a>
            </li>

            <li>
              <a href="#joinus" className="hover:opacity-80 transition">
                Join Us
              </a>
            </li>

            <li>
              <a href="#dining" className="hover:opacity-80 transition">
                Dining
              </a>
            </li>

            <li>
              <a href="#contact" className="hover:opacity-80 transition">
                Contact
              </a>
            </li>
          </ul>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
