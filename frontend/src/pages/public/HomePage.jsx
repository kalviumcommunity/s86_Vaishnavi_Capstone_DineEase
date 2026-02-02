import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";


import hero from "../../assets/images/hero.png";
import state1 from "../../assets/images/AP.jpeg"
import state2 from "../../assets/images/arunachalpradesh.jpeg";
import state3 from "../../assets/images/telangana.jpeg";
import state4 from "../../assets/images/tamilnadu.jpeg";
import state5 from "../../assets/images/goa.jpeg";



const HomePage = () => {
  const [showAll, setShowAll] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState({ restaurants: 0, bookings: 0, users: 0, cities: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets = { restaurants: 500, bookings: 10000, users: 5000, cities: 25 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        restaurants: Math.floor(targets.restaurants * progress),
        bookings: Math.floor(targets.bookings * progress),
        users: Math.floor(targets.users * progress),
        cities: Math.floor(targets.cities * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Real-Time Table Reservations",
      description: "Book tables effortlessly with updated availability.",
      icon: "⚡",
    },
    {
      title: "Dynamic Restaurant Information",
      description: "View complete details about every restaurant.",
      icon: "🍽️",
    },
    {
      title: "Profile Management",
      description: "Manage bookings as a user or update listings as an owner.",
      icon: "👤",
    },
    {
      title: "Restaurant Listings",
      description: "Browse curated restaurants tailored to your location.",
      icon: "📍",
    },
    {
      title: "Seamless User Experience",
      description: "Navigate an intuitive platform built for every diner.",
      icon: "✨",
    },
  ];

  const states = [
    { name: "Andra Pradesh", img: state1 },
    { name: "Arunachal Pradesh", img: state2 },
    { name: "Telangana", img: state3 },
    { name: "Tamil Nadu", img: state4 },
    { name: "Goa", img: state5 },
    
  ];

  return (
    <div className="pt-16 bg-gradient-to-b from-white via-green-50 to-yellow-50">
        <><Navbar />

      {/* ⭐ HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Left image */}
        <div 
          className="relative group"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
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
          <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#E8D77D', color: '#2F5249' }}>
            🎉 India's Premier Table Booking Platform
          </div>
          
          <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
            Dine the <span style={{ color: '#437057' }}>Smart</span> Way
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Seamlessly book tables at the best restaurants across all states. 
            Experience dining like never before with real-time reservations and exclusive offers.
          </p>

          <div className="flex gap-4 pt-4">
            <a
              href="#joinus"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              style={{ backgroundColor: '#437057' }}
            >
              <span className="relative z-10">Get Started Now</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#2F5249' }}></span>
            </a>
            
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 border-2 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ borderColor: '#437057', color: '#437057', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#97B067'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Learn More →
            </a>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-4 gap-4 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#437057' }}>{stats.restaurants}+</div>
              <div className="text-sm text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#437057' }}>{stats.bookings.toLocaleString()}+</div>
              <div className="text-sm text-gray-600">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#437057' }}>{stats.users}+</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#437057' }}>{stats.cities}+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
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
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-white mb-4">
              Why Choose DineEase?
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#E8D77D' }}>
              Experience the future of restaurant reservations with our cutting-edge features
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 px-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group rounded-2xl shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 p-8 lg:col-span-2 flex flex-col gap-4 ${index === 3 ? "lg:col-start-2" : ""} ${index === 4 ? "lg:col-start-4" : ""}`}
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

      {/* ⭐ JOIN US SECTION */}
      <section id="joinus" className="py-24 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Join DineEase Today
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're a restaurant owner or a food lover, we have the perfect solution for you
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          <Link
            to="/restaurant/auth"
            className="group relative bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-12 flex flex-col gap-6 h-full border-2 overflow-hidden"
            style={{ borderColor: '#97B067' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#437057'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#97B067'}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" style={{ backgroundColor: '#E8D77D' }}></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transform group-hover:rotate-12 transition-transform duration-300" style={{ backgroundColor: '#437057' }}>
                🏪
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Restaurant Owner?</h3>
              <p className="text-lg text-gray-600 mb-6">
                Showcase your venue and manage reservations seamlessly with our powerful dashboard.
              </p>
              <div className="flex items-center font-semibold group-hover:gap-4 gap-2 transition-all" style={{ color: '#437057' }}>
                Get Started <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>

          <Link
            to="/user/auth"
            className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-12 flex flex-col gap-6 h-full border-2 overflow-hidden"
            style={{ borderColor: '#E8D77D' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#97B067'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8D77D'}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" style={{ backgroundColor: '#97B067' }}></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transform group-hover:rotate-12 transition-transform duration-300" style={{ backgroundColor: '#437057' }}>
                🍴
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Food Lover?</h3>
              <p className="text-lg text-gray-600 mb-6">
                Find the perfect spot and confirm your table in seconds. Start your culinary journey today!
              </p>
              <div className="flex items-center font-semibold group-hover:gap-4 gap-2 transition-all" style={{ color: '#437057' }}>
                Book Now <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

{/* ⭐ STATES SECTION */}
<section id="dining" className="py-24 text-white relative overflow-hidden" style={{ backgroundColor: '#437057' }}>
  {/* Decorative background */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl" style={{ backgroundColor: '#97B067' }}></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full filter blur-3xl" style={{ backgroundColor: '#E8D77D' }}></div>
  </div>
  
  <div className="relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-5xl font-extrabold mb-4">
        Explore Restaurants Across India
      </h2>
      <p className="text-xl max-w-2xl mx-auto" style={{ color: '#E8D77D' }}>
        Discover amazing dining experiences in your favorite cities
      </p>
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 px-6">
      {states.map((state, index) => (
        <Link
          key={state.name}
          to={`/restaurants?state=${encodeURIComponent(state.name)}`}
          className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer block"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative overflow-hidden">
            <img
              src={state.img}
              alt={state.name}
              className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-lg font-semibold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" style={{ backgroundColor: '#2F5249' }}>
                Explore →
              </span>
            </div>
          </div>
          
          <div className="relative p-5 bg-gradient-to-br from-white to-green-50 text-gray-900">
            <p className="text-center font-bold text-lg transition-colors" style={{ color: '#2F5249' }}>
              {state.name}
            </p>
            <p className="text-center text-sm text-gray-600 mt-1">
              50+ Restaurants
            </p>
          </div>
          
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#97B067' }}></div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* ⭐ CONTACT SECTION */}
      <section id="contact" className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Left: Form */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full filter blur-2xl opacity-50" style={{ backgroundColor: '#97B067' }}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 border" style={{ borderColor: '#E8D77D' }}>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6">
                Have questions? We'd love to hear from you.
              </p>

              <form className="flex flex-col gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none transition-all duration-300"
                    style={{ '--tw-ring-color': '#437057' }}
                    onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 3px rgba(67, 112, 87, 0.2)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 group-hover:border-purple-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 group-hover:border-purple-300"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 resize-none group-hover:border-purple-300"
                    placeholder="Tell us how we can help you..."
                    rows="4"
                  />
                </div>

                <button 
                  type="button"
                  className="group relative px-6 py-3 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  style={{ backgroundColor: '#437057' }}
                >
                  <span className="relative z-10">Send Message</span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#2F5249' }}></span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Contact Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">
                Let's Connect
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're here to help and answer any question you might have. 
                We look forward to hearing from you!
              </p>
            </div>

            <div className="space-y-4">
              <div className="group flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-x-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#437057' }}>
                  📧
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email Us</p>
                  <p className="font-medium" style={{ color: '#437057' }}>dineease@gmail.com</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-x-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#437057' }}>
                  📞
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Call Us</p>
                  <p className="font-medium" style={{ color: '#437057' }}>+91 9876543210</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-x-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#437057' }}>
                  📍
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Visit Us</p>
                  <p className="font-medium" style={{ color: '#437057' }}>Hyderabad, Telangana</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-gray-600 mb-4 font-semibold">Follow us on social media</p>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg" style={{ backgroundColor: '#437057' }}>
                  f
                </button>
                <button className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg" style={{ backgroundColor: '#437057' }}>
                  𝕏
                </button>
                <button className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg" style={{ backgroundColor: '#437057' }}>
                  in
                </button>
                <button className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg" style={{ backgroundColor: '#437057' }}>
                  📷
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

<Footer />
 </>
    </div>
  );
};

export default HomePage;
