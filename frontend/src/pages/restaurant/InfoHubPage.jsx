import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateInfoHub, getCurrentRestaurant, getRestaurantProfile } from "../../services/RestaurantServices";
import Loader from "../../components/common/Loader";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";

const InfoHubPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [restaurantData, setRestaurantData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    aboutUs: "",
    city: "",
    state: "",
    location: "",
    timings: "",
    phoneNumber: "",
    menuimages: [],
    restaurantImages: [],
  });
  const [menuImageURLs, setMenuImageURLs] = useState([]);
  const [restaurantImageURLs, setRestaurantImageURLs] = useState([]);
  const [menuImageFiles, setMenuImageFiles] = useState([]);
  const [restaurantImageFiles, setRestaurantImageFiles] = useState([]);
  const [deletedMenuImages, setDeletedMenuImages] = useState([]);
  const [deletedRestaurantImages, setDeletedRestaurantImages] = useState([]);

  useEffect(() => {
    console.log("=== InfoHub Page Loading ===");
    // Load existing restaurant data
    const token = localStorage.getItem('token');
    const userData = getCurrentRestaurant();
    
    console.log("Token exists:", !!token);
    console.log("User data from localStorage:", userData);
    
    // Verify user is authenticated and is a restaurant
    if (!token || !userData) {
      console.error("Authentication failed - no token or user data");
      setMessage("Please login as a restaurant owner to access this page");
      setMessageType("error");
      setTimeout(() => navigate("/restaurant/auth"), 2000);
      return;
    }
    
    // Verify user has restaurant role
    if (userData.role !== 'restaurant') {
      console.error("Access denied - user role is:", userData.role);
      setMessage("Access denied. This page is for restaurant owners only.");
      setMessageType("error");
      setTimeout(() => navigate("/"), 2000);
      return;
    }
    
    // Fetch fresh data from API
    fetchRestaurantData(userData.id || userData._id);
  }, [navigate]);

  const fetchRestaurantData = async (restaurantId) => {
    try {
      console.log("Fetching restaurant data from API for ID:", restaurantId);
      const data = await getRestaurantProfile(restaurantId);
      console.log("Fetched restaurant data:", data);
      console.log("Data structure:", {
        aboutUs: data.aboutUs,
        city: data.city,
        state: data.state,
        location: data.location,
        timings: data.timings,
        phoneNumber: data.phoneNumber,
        menuimages: data.menuimages,
        restaurantImages: data.restaurantImages
      });
      
      setRestaurantData(data);
      
      const newFormData = {
        aboutUs: data.aboutUs || "",
        city: data.city || "",
        state: data.state || "",
        location: data.location || "",
        timings: data.timings || "",
        phoneNumber: data.phoneNumber || "",
        menuimages: data.menuimages || [],
        restaurantImages: data.restaurantImages || [],
      };
      
      console.log("Setting form data to:", newFormData);
      setFormData(newFormData);
      
      // Clear any temporary states
      setMenuImageURLs([]);
      setRestaurantImageURLs([]);
      setMenuImageFiles([]);
      setRestaurantImageFiles([]);
      setDeletedMenuImages([]);
      setDeletedRestaurantImages([]);
      
      console.log("=== InfoHub Page Loaded Successfully ===");
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      setMessage("Failed to load restaurant data");
      setMessageType("error");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMenuImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    
    // Add to preview URLs
    setMenuImageURLs(prev => [...prev, ...urls]);
    // Store actual file objects for upload
    setMenuImageFiles(prev => [...prev, ...files]);
  };

  const handleRestaurantImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    
    // Add to preview URLs
    setRestaurantImageURLs(prev => [...prev, ...urls]);
    // Store actual file objects for upload
    setRestaurantImageFiles(prev => [...prev, ...files]);
  };

  const removeMenuImage = (index) => {
    setMenuImageURLs(prev => prev.filter((_, i) => i !== index));
    setMenuImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeRestaurantImage = (index) => {
    setRestaurantImageURLs(prev => prev.filter((_, i) => i !== index));
    setRestaurantImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeSavedMenuImage = (index) => {
    const imageToDelete = formData.menuimages[index];
    setDeletedMenuImages(prev => [...prev, imageToDelete]);
    setFormData(prev => ({
      ...prev,
      menuimages: prev.menuimages.filter((_, i) => i !== index)
    }));
  };

  const removeSavedRestaurantImage = (index) => {
    const imageToDelete = formData.restaurantImages[index];
    setDeletedRestaurantImages(prev => [...prev, imageToDelete]);
    setFormData(prev => ({
      ...prev,
      restaurantImages: prev.restaurantImages.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setMessage("");
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setMessage("");
    // Reset form data to original restaurant data
    setFormData({
      aboutUs: restaurantData.aboutUs || "",
      city: restaurantData.city || "",
      state: restaurantData.state || "",
      location: restaurantData.location || "",
      timings: restaurantData.timings || "",
      phoneNumber: restaurantData.phoneNumber || "",
      menuimages: restaurantData.menuimages || [],
      restaurantImages: restaurantData.restaurantImages || [],
    });
    setMenuImageURLs([]);
    setRestaurantImageURLs([]);
    setMenuImageFiles([]);
    setRestaurantImageFiles([]);
    setDeletedMenuImages([]);
    setDeletedRestaurantImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("=== InfoHub Save Started ===");
    console.log("Restaurant Data:", restaurantData);
    console.log("Form Data:", formData);

    try {
      // Validate required fields
      if (!formData.aboutUs || !formData.city || !formData.state || !formData.timings || !formData.location) {
        console.error("Validation failed - missing required fields");
        setMessage("Please fill in all required fields");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Call API to update restaurant information
      const restaurantId = restaurantData.id || restaurantData._id;
      console.log("Restaurant ID:", restaurantId);
      
      if (!restaurantId) {
        console.error("No restaurant ID found");
        throw new Error("Restaurant ID not found. Please login again.");
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('aboutUs', formData.aboutUs);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('timings', formData.timings);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      
      // Append existing images to keep (already filtered by deletion)
      formData.menuimages.forEach(image => {
        formDataToSend.append('existingMenuImages', image);
      });
      formData.restaurantImages.forEach(image => {
        formDataToSend.append('existingRestaurantImages', image);
      });
      
      console.log("Existing menu images to keep:", formData.menuimages);
      console.log("Existing restaurant images to keep:", formData.restaurantImages);
      console.log("Deleted menu images:", deletedMenuImages);
      console.log("Deleted restaurant images:", deletedRestaurantImages);
      
      // Append menu image files
      menuImageFiles.forEach(file => {
        formDataToSend.append('menuimages', file);
      });
      
      // Append restaurant image files
      restaurantImageFiles.forEach(file => {
        formDataToSend.append('restaurantImages', file);
      });
      
      console.log("Sending FormData to API with files:", {
        menuImagesCount: menuImageFiles.length,
        restaurantImagesCount: restaurantImageFiles.length,
        existingMenuImagesCount: formData.menuimages.length,
        existingRestaurantImagesCount: formData.restaurantImages.length
      });
      
      const response = await updateInfoHub(restaurantId, formDataToSend);
      console.log("API Response:", response);

      // Refetch the restaurant data from API to get the updated images
      await fetchRestaurantData(restaurantId);

      console.log("=== InfoHub Save Completed Successfully ===");
      setMessage("Restaurant information updated successfully! 🎉");
      setMessageType("success");
      setIsEditMode(false);
      
      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setMessage("");
      }, 6000);
      
      // Don't auto-redirect, let user see the success message and saved data
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("=== InfoHub Save Error ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      setMessage(error.message || "Failed to update information. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 text-white shadow-2xl border-b-4" style={{ background: 'linear-gradient(to right, #2F5249, #437057, #2F5249)', borderBottomColor: 'rgba(151, 176, 103, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate("/restaurant/dashboard")}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-all mb-2 group px-4 py-2 rounded-lg"
            style={{ ':hover': { backgroundColor: 'rgba(151, 176, 103, 0.2)' } }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(151, 176, 103, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 backdrop-blur-lg rounded-2xl shadow-lg" style={{ backgroundColor: 'rgba(232, 215, 125, 0.2)' }}>
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
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Restaurant Info Hub</h1>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#E8D77D' }}>Update your restaurant details and showcase your venue</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200/50 backdrop-blur-sm">
          <div className="rounded-2xl p-6 sm:p-8 mb-8 shadow-inner" style={{ background: 'linear-gradient(to right, #E8D77D33, #97B06733, #E8D77D33)', border: '2px solid #97B067' }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #437057, #2F5249)' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  Complete Your Restaurant Profile
                  <span className="text-xs font-normal text-white px-2 py-1 rounded-full" style={{ backgroundColor: '#437057' }}>Essential</span>
                </h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Provide comprehensive information about your restaurant to attract more customers. 
                  This information will be displayed on your public restaurant page and help diners 
                  discover what makes your establishment special.
                </p>
              </div>
              {!isEditMode && (
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  style={{ background: 'linear-gradient(to right, #437057, #2F5249)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit Info
                </button>
              )}
            </div>
          </div>

          {message && (
            <div
              className={`mb-8 px-6 py-4 rounded-xl border-2 flex items-center gap-3 ${
                messageType === "success"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 flex-shrink-0"
              >
                {messageType === "success" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                )}
              </svg>
              <span className="font-medium">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* About Us Section */}
            <div className="space-y-3 p-6 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, white, rgba(151, 176, 103, 0.1))', border: '1px solid rgba(151, 176, 103, 0.3)' }}>
              <label className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                  style={{ color: '#437057' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                About Your Restaurant {isEditMode && <span className="text-red-500">*</span>}
              </label>
              {!isEditMode && (
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  Your restaurant description
                </p>
              )}
              {isEditMode ? (
                <>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                    Tell your story - what makes your restaurant unique, cuisine specialty, and atmosphere
                  </p>
                  <textarea
                    name="aboutUs"
                    value={formData.aboutUs}
                    onChange={handleChange}
                    rows="7"
                    placeholder="Example: At [Your Restaurant Name], we believe that food is more than just nourishment — it's an experience. Nestled in the heart of the city, our restaurant blends contemporary style with a warm, inviting atmosphere. We specialize in authentic [cuisine type] with a modern twist, using only the freshest locally-sourced ingredients. Whether you're here for a casual lunch or a special celebration, our dedicated team ensures every visit is memorable..."
                    className="w-full border-2 rounded-xl px-4 py-3 transition-all outline-none resize-none text-gray-800 shadow-sm hover:shadow-md"
                    style={{ borderColor: '#97B067' }}
                    onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 4px rgba(151, 176, 103, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#97B067'; e.target.style.boxShadow = ''; }}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      {formData.aboutUs.length} characters {formData.aboutUs.length < 50 && '(Minimum 50 recommended)'}
                    </p>
                    {formData.aboutUs.length >= 200 && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Great length!
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl px-4 py-3 border-2 min-h-[150px]" style={{ borderColor: '#97B067' }}>
                  <p className="text-gray-800 whitespace-pre-wrap">{formData.aboutUs || "No description provided yet"}</p>
                </div>
              )}
            </div>

            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-6 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, white, rgba(151, 176, 103, 0.1))', border: '1px solid rgba(151, 176, 103, 0.3)' }}>
                <label className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                    style={{ color: '#437057' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  City {isEditMode && <span className="text-red-500">*</span>}
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Hyderabad, Mumbai, Delhi"
                    className="w-full border-2 rounded-xl px-4 py-3 transition-all outline-none text-gray-800 shadow-sm hover:shadow-md"
                    style={{ borderColor: '#97B067' }}
                    onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 4px rgba(151, 176, 103, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#97B067'; e.target.style.boxShadow = ''; }}
                    required
                  />
                ) : (
                  <div className="bg-white rounded-xl px-4 py-3 border-2" style={{ borderColor: '#97B067' }}>
                    <p className="text-gray-800">{formData.city || "Not specified"}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-6 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, white, rgba(151, 176, 103, 0.1))', border: '1px solid rgba(151, 176, 103, 0.3)' }}>
                <label className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                    style={{ color: '#437057' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    />
                  </svg>
                  State {isEditMode && <span className="text-red-500">*</span>}
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., Telangana, Maharashtra, Karnataka"
                    className="w-full border-2 rounded-xl px-4 py-3 transition-all outline-none text-gray-800 shadow-sm hover:shadow-md"
                    style={{ borderColor: '#97B067' }}
                    onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 4px rgba(151, 176, 103, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#97B067'; e.target.style.boxShadow = ''; }}
                    required
                  />
                ) : (
                  <div className="bg-white rounded-xl px-4 py-3 border-2" style={{ borderColor: '#97B067' }}>
                    <p className="text-gray-800">{formData.state || "Not specified"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Full Address Location */}
            <div className="space-y-3 p-6 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, white, rgba(151, 176, 103, 0.1))', border: '1px solid rgba(151, 176, 103, 0.3)' }}>
              <label className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                  style={{ color: '#437057' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                Full Address / Location {isEditMode && <span className="text-red-500">*</span>}
              </label>
              {isEditMode && (
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  Provide complete address including street, area, and nearby landmarks
                </p>
              )}
              {isEditMode ? (
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., 123, Jubilee Hills Road, Near Inorbit Mall, Madhapur, Hyderabad - 500081"
                  className="w-full border-2 rounded-xl px-4 py-3 transition-all outline-none resize-none text-gray-800 shadow-sm hover:shadow-md"
                  style={{ borderColor: '#97B067' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 4px rgba(151, 176, 103, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#97B067'; e.target.style.boxShadow = ''; }}
                  required
                />
              ) : (
                <div className="bg-white rounded-xl px-4 py-3 border-2 min-h-[80px]" style={{ borderColor: '#97B067' }}>
                  <p className="text-gray-800 whitespace-pre-wrap">{formData.location || "No address provided yet"}</p>
                </div>
              )}
            </div>

            {/* Timings */}
            <div className="space-y-3 p-6 bg-gradient-to-br from-white to-green-50/30 rounded-2xl border border-green-200/50">
              <label className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Operating Hours {isEditMode && <span className="text-red-500">*</span>}
              </label>
              {isEditMode && (
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  Specify your restaurant's daily operating hours (e.g., lunch and dinner timings)
                </p>
              )}
              {isEditMode ? (
                <input
                  type="text"
                  name="timings"
                  value={formData.timings}
                  onChange={handleChange}
                  placeholder="e.g., 11:00 AM - 11:00 PM (Mon-Sun) or 12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM"
                  className="w-full border-2 border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl px-4 py-3 transition-all outline-none text-gray-800 shadow-sm hover:shadow-md"
                  required
                />
              ) : (
                <div className="bg-white rounded-xl px-4 py-3 border-2 border-green-300">
                  <p className="text-gray-800">{formData.timings || "Not specified"}</p>
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-3 p-6 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, white, rgba(151, 176, 103, 0.1))', border: '1px solid rgba(151, 176, 103, 0.3)' }}>
              <label className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                  style={{ color: '#437057' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                Contact Number
              </label>
              {isEditMode && (
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  </svg>
                  Primary contact number for customer inquiries and reservations
                </p>
              )}
              {isEditMode ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g., +91 98765 43210 or +1 (555) 123-4567"
                  className="w-full border-2 rounded-xl px-4 py-3 transition-all outline-none text-gray-800 shadow-sm hover:shadow-md"
                  style={{ borderColor: '#97B067' }}
                  onFocus={(e) => { e.target.style.borderColor = '#437057'; e.target.style.boxShadow = '0 0 0 4px rgba(151, 176, 103, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#97B067'; e.target.style.boxShadow = ''; }}
                />
              ) : (
                <div className="bg-white rounded-xl px-4 py-3 border-2" style={{ borderColor: '#97B067' }}>
                  <p className="text-gray-800">{formData.phoneNumber || "Not specified"}</p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-6 py-2 text-sm font-semibold text-gray-600 rounded-full shadow-md border-2 border-gray-200">
                  Visual Content & Media
                </span>
              </div>
            </div>

            {/* Menu Images */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-900 font-bold text-lg mb-2">
                  Menu Images
                </label>
                <p className="text-gray-600 text-sm mb-4">
                  {isEditMode ? 'Upload images of your menu to help customers see your offerings' : 'Your menu images'}
                </p>
              </div>
              
              {isEditMode && (
                <label className="inline-flex items-center gap-3 px-6 py-3 text-white rounded-xl font-semibold transition cursor-pointer shadow-md hover:shadow-lg" style={{ backgroundColor: '#437057' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F5249'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#437057'}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  Upload Menu Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMenuImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              
              {(formData.menuimages.length > 0 || menuImageURLs.length > 0) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {/* Display existing saved images from database */}
                  {formData.menuimages.map((image, index) => (
                    <div
                      key={`saved-${index}`}
                      className="relative group bg-gray-100 rounded-xl p-3 border-2 border-gray-200 transition"
                      style={{ ':hover': { borderColor: '#97B067' } }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#97B067'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Menu ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage('menu');
                        }}
                      />
                      <p className="text-xs text-gray-700 truncate font-medium">Saved Image {index + 1}</p>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => removeSavedMenuImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          title="Delete this image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Display newly uploaded preview images */}
                  {menuImageURLs.map((url, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group bg-gray-100 rounded-xl p-3 border-2 border-green-400 transition"
                    >
                      <img
                        src={url}
                        alt={`New Menu ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <p className="text-xs text-gray-700 truncate font-medium">New Upload {index + 1}</p>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => removeMenuImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <p className="text-gray-500">No menu images uploaded yet</p>
                </div>
              )}
            </div>

            {/* Restaurant Images */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-900 font-bold text-lg mb-2">
                  Restaurant Interior/Exterior Images
                </label>
                <p className="text-gray-600 text-sm mb-4">
                  {isEditMode ? "Showcase your restaurant's ambiance, seating, and atmosphere" : "Your restaurant images"}
                </p>
              </div>
              
              {isEditMode && (
                <label className="inline-flex items-center gap-3 px-6 py-3 text-white rounded-xl font-semibold transition cursor-pointer shadow-md hover:shadow-lg" style={{ backgroundColor: '#97B067' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#437057'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#97B067'}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  Upload Restaurant Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleRestaurantImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              
              {(formData.restaurantImages.length > 0 || restaurantImageURLs.length > 0) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {/* Display existing saved images from database */}
                  {formData.restaurantImages.map((image, index) => (
                    <div
                      key={`saved-${index}`}
                      className="relative group bg-gray-100 rounded-xl p-3 border-2 border-gray-200 hover:border-blue-400 transition"
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Restaurant ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage('restaurant');
                        }}
                      />
                      <p className="text-xs text-gray-700 truncate font-medium">Saved Image {index + 1}</p>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => removeSavedRestaurantImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          title="Delete this image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Display newly uploaded preview images */}
                  {restaurantImageURLs.map((url, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group bg-gray-100 rounded-xl p-3 border-2 border-blue-400 transition"
                    >
                      <img
                        src={url}
                        alt={`New Restaurant ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <p className="text-xs text-gray-700 truncate font-medium">New Upload {index + 1}</p>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => removeRestaurantImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mx-auto text-gray-400 mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <p className="text-gray-500">No restaurant images uploaded yet</p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            {isEditMode && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(to right, #437057, #2F5249)' }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'linear-gradient(to right, #2F5249, #437057)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'linear-gradient(to right, #437057, #2F5249)')}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-3xl p-8 border-2 shadow-xl" style={{ background: 'linear-gradient(to bottom right, #E8D77D22, #97B06722, #E8D77D22)', borderColor: '#97B067' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #437057, #2F5249)' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Pro Tips for Better Visibility
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all" style={{ borderColor: '#97B067' }}>
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#E8D77D' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                  style={{ color: '#437057' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">High-Quality Images</h4>
                <p className="text-sm text-gray-600">Use clear, well-lit photos that showcase your best dishes and ambiance</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all" style={{ borderColor: '#97B067' }}>
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#97B067' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Compelling Story</h4>
                <p className="text-sm text-gray-600">Write an engaging "About Us" highlighting your unique selling points and cuisine</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all" style={{ borderColor: '#97B067' }}>
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#E8D77D' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                  style={{ color: '#437057' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Keep Information Updated</h4>
                <p className="text-sm text-gray-600">Regularly update your hours, menu, and contact details to maintain accuracy</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all" style={{ borderColor: '#97B067' }}>
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#97B067' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Complete Menu Display</h4>
                <p className="text-sm text-gray-600">Include clear menu images so customers know exactly what to expect</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHubPage;
