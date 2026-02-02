import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import ForgotPasswordModal from "../../components/common/ForgotPasswordModal";
import api from "../../services/Api";

const UserAuth = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState("signup");

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'instant' });
	}, []);
	const [showSignupPassword, setShowSignupPassword] = useState(false);
	const [showLoginPassword, setShowLoginPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [signupData, setSignupData] = useState({
		name: "",
		email: "",
		phoneNumber: "",
		password: "",
		remember: false,
	});
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	const isSignup = activeTab === "signup";

	// Function to handle tab switching and clear error
	const handleTabSwitch = (tab) => {
		setActiveTab(tab);
		setError(""); // Clear error when switching tabs
	};

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
					role: "user",
					userName: signupData.name,
					email: signupData.email,
					phoneNumber: signupData.phoneNumber,
					password: signupData.password,
				});

				if (response.data.token) {
					localStorage.setItem("token", response.data.token);
					localStorage.setItem("user", JSON.stringify(response.data.user));
					navigate("/user/dashboard");
				} else {
					// If no token returned after signup, show success and switch to login
					alert("Account created successfully! Please log in.");
					setActiveTab("login");
				}
			} else {
				// Login
				const response = await api.post("/auth/login", {
					role: "user",
					email: loginData.email,
					password: loginData.password,
				});

				if (response.data.token) {
					localStorage.setItem("token", response.data.token);
					localStorage.setItem("user", JSON.stringify(response.data.user));
					navigate("/user/dashboard");
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

	const handleGoogleAuth = () => {
		window.location.href = "http://localhost:3000/api/auth/google";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
			<Navbar simple />

			<main className="pt-28 pb-16 px-4">
				<div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-[0_35px_60px_-15px_rgba(67,112,87,0.3)] transition-all duration-500">
					<div className="grid md:grid-cols-[1.2fr_1fr]">
						<div className="bg-white p-10 md:p-16">
							<div className="mb-10 -mt-4 md:-mt-6">
								<div className="border rounded-full p-1 grid grid-cols-2 relative overflow-hidden" style={{ backgroundColor: '#E8D77D20', borderColor: '#97B067' }}>
									<div 
										className="absolute top-1 bottom-1 left-1 bg-white rounded-full transition-all duration-300 shadow-md"
										style={{ 
											width: 'calc(50% - 4px)',
											transform: isSignup ? 'translateX(0)' : 'translateX(calc(100% + 8px))'
										}}
									></div>
									<button
										type="button"
										onClick={() => handleTabSwitch("signup")}
										className={`w-full px-6 py-2 text-lg font-semibold rounded-full transition-all duration-300 relative z-10 ${
											isSignup
												? "text-gray-900"
												: "hover:scale-105"
										}`}
										style={{ color: isSignup ? '#437057' : '#97B067' }}
									>
										Sign Up
									</button>
									<button
										type="button"
										onClick={() => handleTabSwitch("login")}
										className={`w-full px-6 py-2 text-lg font-semibold rounded-full transition-all duration-300 relative z-10 ${
											!isSignup
												? "text-gray-900"
												: "hover:scale-105"
										}`}
										style={{ color: !isSignup ? '#437057' : '#97B067' }}
									>
										Log In
									</button>
								</div>
							</div>

							<div className="space-y-3 mb-10 text-center md:text-left">
								<h1
									className={`text-4xl md:text-5xl font-extrabold transition-all duration-300 ${isSignup ? "whitespace-nowrap" : ""}`}
									style={{ color: '#2F5249' }}
								>
									{isSignup ? "Create an account" : "Welcome back"}
								</h1>
								<p className="text-gray-600 text-lg">
									{isSignup
										? "Join DineEase to discover and reserve tables in seconds."
										: "Log in to manage your reservations and dining preferences."}
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								{error && (
									<div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-shake">
										{error}
									</div>
								)}

								{isSignup && (
									<div className="text-left group">
										<label htmlFor="signup-name" className="block font-semibold mb-2 transition-colors" style={{ color: '#437057' }}>
											Full name
										</label>
										<input
											id="signup-name"
											name="name"
											value={signupData.name}
											onChange={handleSignupChange}
											type="text"
											placeholder="Alex Morgan"
											className="w-full border-2 rounded-2xl px-4 py-3 text-lg transition-all duration-300 focus:outline-none focus:shadow-lg"
											style={{ 
												borderColor: '#97B067',
												'--tw-ring-color': '#E8D77D'
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#437057';
												e.target.style.transform = 'scale(1.01)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#97B067';
												e.target.style.transform = 'scale(1)';
											}}
											required
											autoComplete="name"
										/>
									</div>
								)}

								{isSignup && (
									<div className="text-left group">
										<label htmlFor="signup-phone" className="block font-semibold mb-2 transition-colors" style={{ color: '#437057' }}>
											Phone number
										</label>
										<input
											id="signup-phone"
											name="phoneNumber"
											value={signupData.phoneNumber}
											onChange={handleSignupChange}
											type="tel"
											placeholder="+1 234 567 8900"
											className="w-full border-2 rounded-2xl px-4 py-3 text-lg transition-all duration-300 focus:outline-none focus:shadow-lg"
											style={{ 
												borderColor: '#97B067'
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#437057';
												e.target.style.transform = 'scale(1.01)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#97B067';
												e.target.style.transform = 'scale(1)';
											}}
											required
											autoComplete="tel"
										/>
									</div>
								)}

								<div className="text-left group">
									<label
										htmlFor={isSignup ? "signup-email" : "login-email"}
										className="block font-semibold mb-2 transition-colors"
										style={{ color: '#437057' }}
									>
										Email address
									</label>
									<input
										id={isSignup ? "signup-email" : "login-email"}
										name="email"
										value={isSignup ? signupData.email : loginData.email}
										onChange={isSignup ? handleSignupChange : handleLoginChange}
										type="email"
										placeholder="you@example.com"
										className="w-full border-2 rounded-2xl px-4 py-3 text-lg transition-all duration-300 focus:outline-none focus:shadow-lg"
										style={{ 
											borderColor: '#97B067'
										}}
										onFocus={(e) => {
											e.target.style.borderColor = '#437057';
											e.target.style.transform = 'scale(1.01)';
										}}
										onBlur={(e) => {
											e.target.style.borderColor = '#97B067';
											e.target.style.transform = 'scale(1)';
										}}
										required
										autoComplete={isSignup ? "email" : "username"}
									/>
								</div>

								<div className="text-left group">
									<label
										htmlFor={isSignup ? "signup-password" : "login-password"}
										className="block font-semibold mb-2 transition-colors"
										style={{ color: '#437057' }}
									>
										Password
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
											placeholder="Enter a strong password"
											className="w-full border-2 rounded-2xl px-4 py-3 text-lg transition-all duration-300 focus:outline-none focus:shadow-lg pr-32"
											style={{ 
												borderColor: '#97B067'
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#437057';
												e.target.style.transform = 'scale(1.01)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#97B067';
												e.target.style.transform = 'scale(1)';
											}}
											required
											autoComplete={isSignup ? "new-password" : "current-password"}
										/>
										<button
											type="button"
											onClick={() =>
												isSignup
													? setShowSignupPassword((prev) => !prev)
													: setShowLoginPassword((prev) => !prev)
											}
											className="absolute inset-y-0 right-4 inline-flex items-center text-sm font-semibold transition-colors hover:scale-110 duration-200"
											style={{ color: '#437057' }}
											onMouseEnter={(e) => e.target.style.color = '#97B067'}
											onMouseLeave={(e) => e.target.style.color = '#437057'}
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

								{isSignup && (
									<label className="flex items-center gap-3 text-gray-600 text-base cursor-pointer group">
										<input
											type="checkbox"
											name="remember"
											checked={signupData.remember}
											onChange={handleSignupChange}
											className="h-5 w-5 rounded border-2 transition-all duration-200 cursor-pointer"
											style={{ 
												borderColor: '#97B067',
												accentColor: '#437057'
											}}
										/>
										<span className="group-hover:scale-105 transition-transform">Remember me on this device</span>
									</label>
								)}

								{!isSignup && (
									<div className="flex justify-between items-center text-sm">
										<label className="flex items-center gap-2 text-gray-600 cursor-pointer group">
											<input 
												type="checkbox" 
												className="h-4 w-4 rounded border-2 transition-all duration-200 cursor-pointer" 
												style={{ 
													borderColor: '#97B067',
													accentColor: '#437057'
												}}
											/>
											<span className="group-hover:scale-105 transition-transform">Remember me</span>
										</label>
										<button 
											type="button" 
											className="font-semibold transition-all duration-200 hover:scale-110"
											style={{ color: '#437057' }}
											onMouseEnter={(e) => e.target.style.color = '#97B067'}
											onMouseLeave={(e) => e.target.style.color = '#437057'}													onClick={() => setShowForgotPassword(true)}										>
											Reset password?
										</button>
									</div>
								)}

								<button
									type="submit"
									disabled={loading}
									className="w-full text-white text-lg font-semibold py-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
									style={{ backgroundColor: '#437057' }}
									onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2F5249')}
									onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#437057')}
								>
									<span className="relative z-10">{loading ? "Please wait..." : (isSignup ? "Sign Up" : "Log In")}</span>
									{!loading && (
										<span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#97B067' }}></span>
									)}
								</button>

								<div className="flex items-center gap-3">
									<span className="h-px flex-1" style={{ backgroundColor: '#97B067' }} />
									<span className="text-sm font-medium text-gray-500">or continue with</span>
									<span className="h-px flex-1" style={{ backgroundColor: '#97B067' }} />
								</div>

								<button
									type="button"
									onClick={handleGoogleAuth}
									className="w-full border-2 text-gray-700 font-semibold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg transform hover:-translate-y-1"
									style={{ borderColor: '#97B067' }}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = '#437057';
										e.currentTarget.style.backgroundColor = '#E8D77D20';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = '#97B067';
										e.currentTarget.style.backgroundColor = 'transparent';
									}}
								>
									<span className="text-xl">🌐</span>
									Google
								</button>
							</form>

							<div className="mt-8 text-center text-gray-600">
								{isSignup ? (
									<p>
										Already have an account?
										<button
											type="button"
											onClick={() => handleTabSwitch("login")}
											className="font-semibold ml-2 transition-all duration-200 hover:scale-110 inline-block"
											style={{ color: '#437057' }}
											onMouseEnter={(e) => e.target.style.color = '#97B067'}
											onMouseLeave={(e) => e.target.style.color = '#437057'}
										>
											Log in
										</button>
									</p>
								) : (
									<p>
										New to DineEase?
										<button
											type="button"
											onClick={() => handleTabSwitch("signup")}
											className="font-semibold ml-2 transition-all duration-200 hover:scale-110 inline-block"
											style={{ color: '#437057' }}
											onMouseEnter={(e) => e.target.style.color = '#97B067'}
											onMouseLeave={(e) => e.target.style.color = '#437057'}
										>
											Create an account
										</button>
									</p>
								)}
							</div>
						</div>

						<aside className="hidden md:flex flex-col justify-between text-white p-12 relative overflow-hidden" style={{ backgroundColor: '#2F5249' }}>
							{/* Animated decorative blobs */}
							<div className="absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-overlay opacity-20 animate-blob" style={{ backgroundColor: '#97B067' }}></div>
							<div className="absolute bottom-0 left-0 w-64 h-64 rounded-full mix-blend-overlay opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: '#E8D77D' }}></div>
							<div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full mix-blend-overlay opacity-10 animate-blob animation-delay-4000" style={{ backgroundColor: '#437057' }}></div>

							<div className="space-y-5 relative z-10">
								<div className="inline-block">
									<div className="text-5xl mb-4 animate-bounce-slow">🍽️</div>
								</div>
								<h2 className="text-3xl font-bold">Dine smarter with confidence</h2>
								<p className="text-lg opacity-90" style={{ color: '#E8D77D' }}>
									Reserve tables instantly, track your bookings, and explore curated dining experiences tailored to you.
								</p>
							</div>

							<ul className="space-y-4 text-base relative z-10" style={{ color: '#E8D77D' }}>
								<li className="flex items-start gap-3 transform hover:translate-x-2 transition-transform duration-300">
									<span className="mt-1 text-xl">🍽️</span>
									<span>Exclusive restaurant insights at your fingertips.</span>
								</li>
								<li className="flex items-start gap-3 transform hover:translate-x-2 transition-transform duration-300">
									<span className="mt-1 text-xl">⏱️</span>
									<span>Real-time availability and instant confirmations.</span>
								</li>
								<li className="flex items-start gap-3 transform hover:translate-x-2 transition-transform duration-300">
									<span className="mt-1 text-xl">🔒</span>
									<span>Secure account to keep your preferences in sync.</span>
								</li>
							</ul>

							{/* Stats */}
							<div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
								<div className="text-center p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#437057' }}>
									<div className="text-3xl font-bold" style={{ color: '#E8D77D' }}>500+</div>
									<div className="text-sm opacity-90">Restaurants</div>
								</div>
								<div className="text-center p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#437057' }}>
									<div className="text-3xl font-bold" style={{ color: '#E8D77D' }}>10K+</div>
									<div className="text-sm opacity-90">Bookings</div>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</main>

			<Footer/>
			
			{/* Forgot Password Modal */}
			<ForgotPasswordModal 
				isOpen={showForgotPassword} 
				onClose={() => setShowForgotPassword(false)} 
				userType="user" 
			/>
		</div>
	);
};

export default UserAuth;
