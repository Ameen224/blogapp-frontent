// src/component/SignupModal.jsx 

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import api from "../utils/api";

export default function SignupModal({ onClose }) {
  const [step, setStep] = useState("option");
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const recaptchaRef = useRef();

  // Handle Google OAuth login using popup
  const handleGoogleLogin = () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Opening Google OAuth popup...");
      
      // Open Google OAuth in a popup
      const popup = window.open(
        'http://localhost:4000/auth/google',
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Check if popup was blocked
      if (!popup) {
        setError("Popup blocked. Please allow popups for this site.");
        setLoading(false);
        return;
      }

      // Listen for popup to close or get message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setLoading(false);
          
          // Check if we need to refresh to get the new auth state
          // The AuthSuccess component will handle the actual auth data
          window.location.reload();
        }
      }, 1000);

      // Listen for messages from the popup (if the success page sends them)
      const handleMessage = (event) => {
        if (event.origin !== 'http://localhost:5173') return;
        
        if (event.data.type === 'AUTH_SUCCESS') {
          clearInterval(checkClosed);
          dispatch(setCredentials(event.data.payload));
          popup.close();
          onClose();
          setLoading(false);
        } else if (event.data.type === 'AUTH_ERROR') {
          clearInterval(checkClosed);
          setError(event.data.message || 'Authentication failed');
          popup.close();
          setLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup function
      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
      };

      // Clean up after 5 minutes
      setTimeout(cleanup, 300000);

    } catch (err) {
      console.error("Google login failed", err);
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!captchaToken) {
      setError("Please complete the reCAPTCHA");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/user/send-otp",
        { email, captcha: captchaToken },
        { withCredentials: true }
      );

      alert("OTP sent successfully");
      setStep("otp");
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(
        "/user/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      dispatch(setCredentials(res.data));
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const termsText = (
    <div className="text-xs text-gray-600 max-w-xs text-center mt-8">
      <small>
        By signing up, you agree to Readflow's{" "}
        <a href="#" className="text-accent underline">Terms of Service</a> and{" "}
        acknowledge our{" "}
        <a href="#" className="text-accent underline">Privacy Policy</a>.
      </small>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#90cdf4] text-black rounded-xl p-8 w-full max-w-md h-[60vh] relative shadow-lg overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-2xl hover:text-red-600 transition"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === "option" && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mt-8 mb-8">Join Readflow.</h2>

            {/* Google Login Button */}
            <div className="w-full max-w-xs mb-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-black text-white py-3 px-4 rounded-full mt-4 mb-2 flex items-center justify-center gap-3 hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>

            {/* OR divider */}
            <div className="flex items-center w-full max-w-xs mb-4">
              <div className="flex-1 border-t border-gray-400"></div>
              <span className="px-3 text-gray-600 text-sm">or</span>
              <div className="flex-1 border-t border-gray-400"></div>
            </div>

            <button
              className="w-full max-w-xs bg-black text-white py-3 px-4 rounded-full mt-2 mb-8 flex items-center justify-center gap-3 hover:bg-gray-800 transition disabled:opacity-50"
              onClick={() => setStep("email")}
              disabled={loading}
            >
              <span className="font-bold text-lg">✉</span>
              Sign up with Email
            </button>
            {termsText}
          </div>
        )}

        {step === "email" && (
          <div className="flex flex-col items-center text-center p-4">
            <h2 className="text-3xl font-bold mb-4">Sign up with Email</h2>
            <p className="text-gray-700 mb-4">
              Enter your email address and complete the captcha to get your OTP.
            </p>
            <form onSubmit={handleEmailSubmit} className="w-full max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
              />
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LfQMGorAAAAAFswxfidNQbwpm6PENShVQtaC0lH"
                onChange={(token) => setCaptchaToken(token)}
                className="mb-4"
              />
              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
            <button
              onClick={() => setStep("option")}
              className="mt-4 text-gray-600 hover:text-black transition underline"
              disabled={loading}
            >
              ← Back to options
            </button>
            {termsText}
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col items-center text-center p-4">
            <h2 className="text-3xl font-bold mb-4">Verify OTP</h2>
            <p className="text-gray-700 mb-4">
              Please enter the OTP sent to {email}
            </p>
            <form onSubmit={handleOtpVerify} className="w-full max-w-xs">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
                className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
            <button
              onClick={() => setStep("email")}
              className="mt-4 text-gray-600 hover:text-black transition underline"
              disabled={loading}
            >
              ← Back to email
            </button>
            {termsText}
          </div>
        )}
      </div>
    </div>
  );
}