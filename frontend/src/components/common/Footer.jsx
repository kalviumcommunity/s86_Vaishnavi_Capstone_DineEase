const Footer = () => {
  return (
    <footer className="text-white py-16 mt-16" style={{ backgroundColor: '#2F5249' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#E8D77D' }}>
              DineEase
            </h2>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Simplifying restaurant reservations for diners and restaurant owners across India. 
              Experience seamless booking with real-time availability and instant confirmation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#E8D77D' }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors hover:underline">Features</a></li>
              <li><a href="#restaurants" className="text-gray-300 hover:text-white transition-colors hover:underline">Find Restaurants</a></li>
              <li><a href="/restaurant/auth" className="text-gray-300 hover:text-white transition-colors hover:underline">Partner with Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors hover:underline">Contact Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Help Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#E8D77D' }}>
              Contact Us
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center">
                <span>support@dineease.com</span>
              </div>
              <div className="flex items-center">
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center">
                <span>Hyderabad, India</span>
              </div>
              <div className="flex items-center">
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} DineEase. All rights reserved. | Transforming dining experiences across India.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
