import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import logo from "../assets/ITPL_login.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Auto-hide snackbar after 4 seconds
  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError("");
      setShowSnackbar(false);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setShowSnackbar(true);
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setShowSnackbar(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setShowSnackbar(false);

    try {
      // Sign in user
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } catch (error) {
      console.error("Authentication error:", error);

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later");
          break;
        default:
          setError("Authentication failed. Please try again");
      }
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-center opacity-20">
            <h2
              className="text-2xl md:text-7xl lg:text-8xl font-bold text-transparent whitespace-nowrap leading-none animate-revealing-light-red"
              style={{
                WebkitTextStroke: "2px rgba(239, 68, 68, 0.5)",
                textShadow:
                  "0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.2)",
              }}
            >
              INFOYASHONAND
            </h2>
            <h2
              className="text-2xl md:text-7xl lg:text-8xl font-bold text-transparent whitespace-nowrap leading-none animate-revealing-light-white"
              style={{
                WebkitTextStroke: "2px rgba(255, 255, 255, 0.5)",
                textShadow:
                  "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)",
              }}
            >
              TECHNOLOGY PVT. LTD.
            </h2>
          </div>
        </div>

        {/* Compact header */}
        <div className="text-center mb-8 animate-fade-in relative z-20">
          <div className="w-28 h-24 mx-auto flex items-center justify-center mb-4 shadow-lg">
            <img
              src={logo}
              alt="ITPL Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-lg font-medium text-white mb-2">
            Daily Report System
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            Streamline your daily reporting process with our management platform
          </p>
        </div>

        {/* Snackbar */}
        {showSnackbar && error && (
          <div className="fixed top-4 right-4 z-50 animate-snackbar-in">
            <div className="relative group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-500 p-[1px] animate-gradient-x">
                <div className="w-full h-full bg-black rounded-[7px]"></div>
              </div>
              <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-red-500/30 via-red-600/30 to-red-500/30 blur-lg animate-gradient-x"></div>
              <div className="relative z-10 p-4 bg-transparent backdrop-blur-sm rounded-lg min-w-[300px] max-w-[400px] border border-gray-700/30">
                <p className="text-red-400 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
                <button
                  onClick={() => {
                    setShowSnackbar(false);
                    setError("");
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compact login form */}
        <div className="w-full max-w-sm relative z-20">
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-xl animate-slide-up h-[400px]">
            {/* Welcome message in card */}
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-xs text-gray-40 pb-3">
                Sign in to access your daily report dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-cyan-500 opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300 p-[1px] animate-gradient-x">
                    <div className="w-full h-full bg-black rounded-[7px]"></div>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-pink-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 group-hover:opacity-40 transition-opacity duration-300 blur-md animate-gradient-x"></div>
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10"
                    size={16}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="relative z-10 w-full pl-10 pr-3 py-3 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-transparent focus:bg-gray-800/30 hover:border-transparent hover:bg-gray-800/30 transition-all duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 pb-4">
                <label className="block text-xs font-medium text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-cyan-500 opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300 p-[1px] animate-gradient-x">
                    <div className="w-full h-full bg-black rounded-[7px]"></div>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-pink-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 group-hover:opacity-40 transition-opacity duration-300 blur-md animate-gradient-x"></div>
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10"
                    size={16}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="relative z-10 w-full pl-10 pr-10 py-3 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-transparent focus:bg-gray-800/30 hover:border-transparent hover:bg-gray-800/30 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <User size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-20">
          <p className="text-gray-600 text-xs">
            © 2024 ITPL. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes revealing-light-red {
          0% {
            background: linear-gradient(
              90deg,
              transparent 0%,
              transparent 20%,
              rgba(239, 68, 68, 0.9) 40%,
              rgba(239, 68, 68, 1) 50%,
              rgba(239, 68, 68, 0.9) 60%,
              transparent 80%,
              transparent 100%
            );
            background-size: 500% 100%;
            background-position: 300% 0;
            -webkit-background-clip: text;
            background-clip: text;
          }
          100% {
            background: linear-gradient(
              90deg,
              transparent 0%,
              transparent 20%,
              rgba(239, 68, 68, 0.9) 40%,
              rgba(239, 68, 68, 1) 50%,
              rgba(239, 68, 68, 0.9) 60%,
              transparent 80%,
              transparent 100%
            );
            background-size: 500% 100%;
            background-position: -200% 0;
            -webkit-background-clip: text;
            background-clip: text;
          }
        }

        @keyframes revealing-light-white {
          0% {
            background: linear-gradient(
              90deg,
              transparent 0%,
              transparent 20%,
              rgba(255, 255, 255, 0.9) 40%,
              rgba(255, 255, 255, 1) 50%,
              rgba(255, 255, 255, 0.9) 60%,
              transparent 80%,
              transparent 100%
            );
            background-size: 500% 100%;
            background-position: 300% 0;
            -webkit-background-clip: text;
            background-clip: text;
          }
          100% {
            background: linear-gradient(
              90deg,
              transparent 0%,
              transparent 20%,
              rgba(255, 255, 255, 0.9) 40%,
              rgba(255, 255, 255, 1) 50%,
              rgba(255, 255, 255, 0.9) 60%,
              transparent 80%,
              transparent 100%
            );
            background-size: 500% 100%;
            background-position: -200% 0;
            -webkit-background-clip: text;
            background-clip: text;
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes snackbar-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-revealing-light-red {
          animation: revealing-light-red 12s linear infinite;
        }

        .animate-revealing-light-white {
          animation: revealing-light-white 12s linear infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }

        .animate-snackbar-in {
          animation: snackbar-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
