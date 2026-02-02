import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

import hero from "../../assets/images/hero.png";
import state1 from "../../assets/images/AP.jpeg";
import state2 from "../../assets/images/arunachalpradesh.jpeg";
import state3 from "../../assets/images/telangana.jpeg";
import state4 from "../../assets/images/tamilnadu.jpeg";
import state5 from "../../assets/images/goa.jpeg";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const features = [
    {
      title: "Restaurant Discovery",
      description: "Explore restaurants with detailed information and locations.",
      icon: "🔍",
    },
    {
      title: "Easy Booking Management",
      description: "View, modify, or cancel your reservations anytime, anywhere.",
      icon: "📅",
    },
    {
      title: "Browse by Location",
      description: "Find restaurants across different states and cities in India.",
      icon: "📍",
    },
    {
      title: "Secure Reservations",
      description: "Book with confidence using our secure booking system.",
      icon: "🔒",
    },
    {
      title: "Profile Management",
      description: "Keep your contact details and booking history in one place.",
      icon: "👤",
    },
  ];

  const states = [
    { name: "Andra Pradesh", img: state1 },
    { name: "Arunachal Pradesh", img: state2 },
    { name: "Telangana", img: state3 },
    { name: "Tamil Nadu", img: state4 },
    { name: "Goa", img: state5 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="pt-24 bg-gradient-to-b from-white via-green-50 to-yellow-50">
      {/* Navbar with Profile */}
      <nav className="w-full text-white fixed top-0 left-0 z-50 shadow-lg backdrop-blur-sm transition-all duration-300" style={{ backgroundColor: '#2F5249' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/user/dashboard" className="text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-300" style={{ color: '#E8D77D' }}>
            DineEase
          </Link>

          {/* Nav Links */}
          <ul className="hidden md:flex gap-10 text-lg font-medium items-center">
            <li>
              <a href="#features" className="transition-all duration-300 hover:scale-110 relative group" style={{ color: '#E8D77D' }}>
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#97B067' }}></span>
              </a>
            </li>
            <li>
              <a href="#dining" className="transition-all duration-300 hover:scale-110 relative group" style={{ color: '#E8D77D' }}>
                Restaurants
                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#97B067' }}></span>
              </a>
            </li>

            {/* Profile Icon */}
            <li className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl py-3 border-2 animate-fade-in" style={{ borderColor: '#97B067' }}>
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-300 rounded-lg mx-2 font-medium"
                    onClick={() => setShowProfileMenu(false)}
                    style={{ color: '#437057' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E8D77D';
                      e.currentTarget.style.color = '#2F5249';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#437057';
                    }}
                  >
                    <span className="text-xl">👤</span>
                    My Profile
                  </Link>
                
                  <div className="h-px my-2 mx-4" style={{ backgroundColor: '#97B06730' }}></div>
                
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-left px-4 py-3 transition-all duration-300 rounded-lg mx-2 font-medium"
                    style={{ color: '#437057', width: 'calc(100% - 16px)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E8D77D';
                      e.currentTarget.style.color = '#2F5249';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#437057';
                    }}
                  >
                    <span className="text-xl">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* ⭐ HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
        {/* Left image */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-2xl opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500" style={{ backgroundColor: '#97B067' }}></div>
          <img
            src={hero}
            alt="DineEase Hero"
            className="relative w-full rounded-2xl shadow-2xl transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-1"
            style={{ boxShadow: '0 25px 50px -12px rgba(67, 112, 87, 0.25)' }}
          />
        </div>

        {/* Right text */}
        <div className="space-y-6 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-2" style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}>
            🎉 Your Personal Dining Hub
          </div>
          
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Dine the <span style={{ color: '#437057' }}>Smart</span> Way
          </h1>

          <p className="text-xl text-gray-600">
            Seamlessly book tables at the best restaurants across all states.
          </p>

          <div className="flex gap-4">
            <Link
              to="/user/bookings"
              className="inline-flex items-center justify-center px-8 py-4 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              style={{ backgroundColor: '#437057' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F5249'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#437057'}
            >
              <span className="relative z-10">View My Bookings →</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#97B067' }}></span>
            </Link>

            <a
              href="#dining"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: '#437057', color: '#437057' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#97B067';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#97B067';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#437057';
                e.currentTarget.style.borderColor = '#437057';
              }}
            >
              Browse Restaurants
            </a>
          </div>
        </div>
      </section>

      {/* ⭐ FEATURES SECTION */}
      <section id="features" className="relative py-24 overflow-hidden" style={{ backgroundColor: '#2F5249' }}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ backgroundColor: '#97B067' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: '#E8D77D' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: '#437057' }}></div>
        
        <div className="relative z-10">
          <h2 className="text-center text-5xl font-extrabold text-white mb-4">
            Our Features
          </h2>
          <p className="text-center text-xl mb-12 max-w-2xl mx-auto" style={{ color: '#E8D77D' }}>
            Everything you need for the perfect dining experience
          </p>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-2xl shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 p-8 flex flex-col gap-4"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  backgroundColor: index % 2 === 0 ? '#97B067' : '#E8D77D',
                  color: '#2F5249'
                }}
              >
                <div className="text-5xl mb-2 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-base font-medium opacity-90">
                  {feature.description}
                </p>
                <div className="mt-auto pt-4">
                  <div className="h-1 w-0 group-hover:w-full transition-all duration-500 rounded-full" style={{ backgroundColor: '#437057' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ BROWSE RESTAURANTS SECTION */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-4" style={{ color: '#2F5249' }}>
              Ready to Discover Amazing Restaurants?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through thousands of restaurants and make your reservation in just a few clicks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Quick Stats Cards */}
            <div className="group rounded-2xl p-8 shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: '#437057' }}>
              <div className="text-5xl mb-4 text-center group-hover:scale-125 transition-transform duration-300">🍽️</div>
              <h3 className="text-4xl font-bold text-center mb-2" style={{ color: '#E8D77D' }}>50+</h3>
              <p className="text-center text-white text-lg">Partner Restaurants</p>
            </div>

            <div className="group rounded-2xl p-8 shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: '#97B067' }}>
              <div className="text-5xl mb-4 text-center group-hover:scale-125 transition-transform duration-300">📍</div>
              <h3 className="text-4xl font-bold text-center mb-2" style={{ color: '#2F5249' }}>5</h3>
              <p className="text-center font-semibold text-lg" style={{ color: '#2F5249' }}>States Covered</p>
            </div>

            <div className="group rounded-2xl p-8 shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: '#E8D77D' }}>
              <div className="text-5xl mb-4 text-center group-hover:scale-125 transition-transform duration-300">⭐</div>
              <h3 className="text-4xl font-bold text-center mb-2" style={{ color: '#2F5249' }}>4.4/5</h3>
              <p className="text-center font-semibold text-lg" style={{ color: '#2F5249' }}>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ STATES SECTION */}
      <section id="dining" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#437057' }}>
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-overlay opacity-10 animate-blob" style={{ backgroundColor: '#E8D77D' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full mix-blend-overlay opacity-10 animate-blob animation-delay-2000" style={{ backgroundColor: '#97B067' }}></div>
        
        <div className="relative z-10">
          <h2 className="text-center text-5xl font-extrabold text-white mb-4">
            Find Restaurants Across States
          </h2>
          <p className="text-center text-xl mb-12" style={{ color: '#E8D77D' }}>
            Explore culinary delights from every corner of India
          </p>

          <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6 px-6">
            {states.map((state) => (
              <Link
                to={`/user/restaurants?state=${encodeURIComponent(state.name)}`}
                key={state.name}
                className="rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 group cursor-pointer"
                style={{ backgroundColor: '#2F5249' }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={state.img}
                    alt={state.name}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300" style={{ backgroundColor: '#437057' }}></div>
                </div>
                <p className="text-center text-white font-semibold py-4 group-hover:scale-110 transition-transform duration-300" style={{ color: '#E8D77D' }}>
                  {state.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserDashboard;
