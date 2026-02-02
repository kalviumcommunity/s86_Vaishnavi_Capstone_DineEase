import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import ForgotPasswordModal from "../../components/common/ForgotPasswordModal";


const RestaurantAuth = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("signup");

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'instant' });
	}, []);
	const [showSignupPassword, setShowSignupPassword] = useState(false);
	const [showLoginPassword, setShowLoginPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

	
	const [signupData, setSignupData] = useState({
		name: "",
		email: "",
		restaurantName: "",
		phoneNumber: "",
		city: "",
		state: "",
		password: "",
		remember: false,
	});
	
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	const isSignup = activeTab === "signup";

	const handleSignupChange = (event) => {
		const { name, value, type, checked } = event.target;
		setSignupData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleLoginChange = (event) => {
		const { name, value } = event.target;
		setLoginData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (isSignup) {
				// Signup
				const response = await api.post("/auth/signup", {
					role: "restaurant",
					name: signupData.name,
					email: signupData.email,
					restaurantName: signupData.restaurantName,
					phoneNumber: signupData.phoneNumber,
					city: signupData.city,
					state: signupData.state,
					password: signupData.password,
				});

				if (response.data.token) {
					localStorage.setItem("token", response.data.token);
					localStorage.setItem("user", JSON.stringify(response.data.user));
					navigate("/restaurant/dashboard");
				} else {
					alert("Account created successfully! Please log in.");
					setActiveTab("login");
				}
			} else {
				// Login
				const response = await api.post("/auth/login", {
					role: "restaurant",
					email: loginData.email,
					password: loginData.password,
				});

				if (response.data.token) {
					localStorage.setItem("token", response.data.token);
					localStorage.setItem("user", JSON.stringify(response.data.user));
					navigate("/restaurant/dashboard");
				}
			}
		} catch (err) {
			console.error("Auth error:", err);
			setError(
				err.response?.data?.message || 
				"An error occurred. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
	
		
			<div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-50 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#97B067' }}></div>
			<div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#E8D77D' }}></div>
			<div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#437057' }}></div>
			
			<div className="relative flex items-center justify-center min-h-screen py-12 px-4">
				<div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
					{/* Left Side - Branding & Info */}
					<div className="hidden md:block space-y-8">
						<div>
							<h1 className="text-6xl font-extrabold mb-4" style={{ color: '#2F5249' }}>
								DineEase
							</h1>
							<p className="text-2xl font-semibold mb-2" style={{ color: '#437057' }}>
								Restaurant Partner Portal
							</p>
							<p className="text-lg text-gray-600">
								Join India's fastest-growing restaurant reservation platform
							</p>
						</div>

						<div className="space-y-6">
							<div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(151, 176, 103, 0.1)' }}>
								<div className="text-4xl">📊</div>
								<div>
									<h3 className="font-bold text-lg mb-1" style={{ color: '#2F5249' }}>Real-Time Analytics</h3>
									<p className="text-gray-600">Track bookings and customer insights instantly</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(232, 215, 125, 0.2)' }}>
								<div className="text-4xl">🎯</div>
								<div>
									<h3 className="font-bold text-lg mb-1" style={{ color: '#2F5249' }}>Easy Management</h3>
									<p className="text-gray-600">Manage tables, bookings, and menus effortlessly</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(67, 112, 87, 0.1)' }}>
								<div className="text-4xl">🚀</div>
								<div>
									<h3 className="font-bold text-lg mb-1" style={{ color: '#2F5249' }}>Grow Your Business</h3>
									<p className="text-gray-600">Reach thousands of hungry customers daily</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-8 text-center">
							<div>
								<div className="text-4xl font-bold" style={{ color: '#437057' }}>500+</div>
								<div className="text-sm text-gray-600">Partner Restaurants</div>
							</div>
							<div>
								<div className="text-4xl font-bold" style={{ color: '#437057' }}>10K+</div>
								<div className="text-sm text-gray-600">Daily Bookings</div>
							</div>
							<div>
								<div className="text-4xl font-bold" style={{ color: '#437057' }}>25+</div>
								<div className="text-sm text-gray-600">Cities</div>
							</div>
						</div>
					</div>

					{/* Right Side - Auth Form */}
					<div className="w-full">
						{/* Mobile Logo */}
						<div className="md:hidden text-center mb-8">
							<h1 className="text-5xl font-extrabold mb-3" style={{ color: '#2F5249' }}>
								DineEase
							</h1>
							<p className="text-xl text-gray-600 font-medium">
								Restaurant Partner Portal
							</p>
						</div>

						{/* Tab Switcher */}
						<div className="flex justify-center mb-8">
							<div className="inline-flex rounded-full p-1.5 shadow-lg" style={{ backgroundColor: '#2F5249' }}>
								<button
									type="button"
									onClick={() => setActiveTab("signup")}
									className={`px-8 py-3 text-base font-semibold rounded-full transition-all duration-300 ${
										isSignup
											? "text-gray-900 shadow-md"
											: "text-white hover:text-yellow-200"
									}`}
									style={isSignup ? { backgroundColor: '#E8D77D' } : {}}
								>
									Sign Up
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("login")}
									className={`px-8 py-3 text-base font-semibold rounded-full transition-all duration-300 ${
										!isSignup
											? "text-gray-900 shadow-md"
											: "text-white hover:text-yellow-200"
									}`}
									style={!isSignup ? { backgroundColor: '#E8D77D' } : {}}
								>
									Log In
								</button>
							</div>
						</div>

						<div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2" style={{ borderColor: '#97B067' }}>
							{/* Header */}
							<div className="relative text-white px-10 py-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2F5249 0%, #437057 100%)' }}>
								<div className="absolute inset-0 opacity-10">
									<div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32" style={{ backgroundColor: '#E8D77D' }}></div>
									<div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24" style={{ backgroundColor: '#97B067' }}></div>
								</div>
								
								<div className="relative z-10">
									<div className="flex justify-center mb-4">
										<div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: '#E8D77D' }}>
											🍽️
										</div>
									</div>
									<h2 className="text-3xl font-extrabold mb-3 text-center">
										{isSignup ? "Partner With Us" : "Welcome Back"}
									</h2>
									<p className="text-base text-center max-w-lg mx-auto" style={{ color: '#E8D77D' }}>
										{isSignup
											? "Join DineEase and manage your restaurant reservations effortlessly"
											: "Sign in to access your restaurant dashboard"}
									</p>
								</div>
							</div>

					{/* Form */}
					<div className="px-10 py-10">
						<form onSubmit={handleSubmit} className="space-y-6">{error && (
								<div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm flex items-center gap-3">
									<span className="text-2xl">⚠️</span>
									<span>{error}</span>
								</div>
							)}

						{isSignup && (
							<div>
								<label htmlFor="signup-name" className="block font-semibold text-gray-700 mb-2 text-sm">
									Full Name:
								</label>
								<input
									id="signup-name"
									name="name"
									value={signupData.name}
									onChange={handleSignupChange}
									type="text"
									placeholder="John Doe"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 transition outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
									required
								/>
							</div>
						)}

						<div>
							<label
								htmlFor={isSignup ? "signup-email" : "login-email"}
								className="block font-semibold text-gray-700 mb-2 text-sm"
							>
								Email:
							</label>
							<input
								id={isSignup ? "signup-email" : "login-email"}
								name="email"
								value={isSignup ? signupData.email : loginData.email}
								onChange={isSignup ? handleSignupChange : handleLoginChange}
								type="email"
								placeholder="admin@restaurant.com"
								className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 transition outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
								required
							/>
						</div>

						{isSignup && (
							<div>
								<label htmlFor="signup-restaurant" className="block font-semibold text-gray-700 mb-2 text-sm">
									Restaurant Name:
								</label>
								<input
									id="signup-restaurant"
									name="restaurantName"
									value={signupData.restaurantName}
									onChange={handleSignupChange}
									type="text"
									placeholder="The Grand Dining"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 transition outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
									required
								/>
							</div>
						)}

						{isSignup && (
							<div>
								<label htmlFor="signup-phone" className="block font-semibold text-gray-700 mb-2 text-sm">
									Restaurant Phone No:
								</label>
								<input
									id="signup-phone"
									name="phoneNumber"
									value={signupData.phoneNumber}
									onChange={handleSignupChange}
									type="tel"
									placeholder="+91 98765 43210"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 transition outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
									required
								/>
							</div>
						)}

						{isSignup && (
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label htmlFor="signup-city" className="block font-semibold text-gray-700 mb-2 text-sm">
										City:
									</label>
									<input
										id="signup-city"
										name="city"
										value={signupData.city}
										onChange={handleSignupChange}
										type="text"
										placeholder="Mumbai"
										className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 transition outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
										required
									/>
								</div>
								<div>
									<label htmlFor="signup-state" className="block font-semibold text-gray-700 mb-2 text-sm">
										State:
									</label>
									<select
										id="signup-state"
										name="state"
										value={signupData.state}
										onChange={handleSignupChange}
										className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 transition outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
										required
									>
										<option value="">Select State</option>
										<option value="Andhra Pradesh">Andhra Pradesh</option>
										<option value="Arunachal Pradesh">Arunachal Pradesh</option>
										<option value="Telangana">Telangana</option>
										<option value="Tamil Nadu">Tamil Nadu</option>
										<option value="Goa">Goa</option>
									</select>
								</div>
							</div>
						)}

						<div>
							<label
								htmlFor={isSignup ? "signup-password" : "login-password"}
								className="block font-semibold text-gray-700 mb-2 text-sm"
							>
								Password:
							</label>
							<div className="relative">
								<input
									id={isSignup ? "signup-password" : "login-password"}
									name="password"
									value={isSignup ? signupData.password : loginData.password}
									onChange={isSignup ? handleSignupChange : handleLoginChange}
									type={
										isSignup
											? showSignupPassword
												? "text"
												: "password"
											: showLoginPassword
											? "text"
											: "password"
									}
									placeholder="••••••••"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-12 transition outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
									required
								/>
								<button
									type="button"
									onClick={() =>
										isSignup
											? setShowSignupPassword((prev) => !prev)
											: setShowLoginPassword((prev) => !prev)
									}
									className="absolute inset-y-0 right-4 flex items-center text-sm font-semibold hover:scale-110 transition-transform"
									style={{ color: '#437057' }}
								>
									{isSignup
										? showSignupPassword
											? "Hide"
											: "Show"
										: showLoginPassword
										? "Hide"
										: "Show"}
								</button>
							</div>
						</div>

						{!isSignup && (
							<div className="text-right">
								<button
									type="button"
									onClick={() => setShowForgotPasswordModal(true)}
									className="text-sm font-medium hover:underline transition-colors"
									style={{ color: '#97B067' }}
									onMouseEnter={(e) => e.target.style.color = '#437057'}
									onMouseLeave={(e) => e.target.style.color = '#97B067'}
								>
									Reset password?
								</button>
							</div>
						)}

						{isSignup && (
							<label className="flex items-center gap-3 text-gray-700 cursor-pointer">
								<input
									type="checkbox"
									name="remember"
									checked={signupData.remember}
									onChange={handleSignupChange}
									className="h-5 w-5 rounded border-gray-300 cursor-pointer"
									style={{ accentColor: '#437057' }}
								/>
								<span className="text-sm font-medium">Remember me for future logins</span>
							</label>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-0.5"
							style={{ backgroundColor: loading ? '#94a3b8' : '#437057' }}
							onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2F5249')}
							onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#437057')}
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Processing...
								</span>
							) : (
								<span>{isSignup ? "🚀 Create Account" : "🔐 Sign In"}</span>
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
		</div>

	{/* Forgot Password Modal */}
	<ForgotPasswordModal
		isOpen={showForgotPasswordModal}
		onClose={() => setShowForgotPasswordModal(false)}
		userType="restaurant"
	/>
	</div>
	);
};

export default RestaurantAuth;
