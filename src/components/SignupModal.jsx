// src/component/SignupModal.jsx
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import axios from "axios";

export default function SignupModal({ onClose }) {
  const [step, setStep] = useState("option");
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const recaptchaRef = useRef();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/send-otp",
        { email, captcha: captchaToken },
        { withCredentials: true }
      );

      alert("OTP sent successfully");
      setStep("otp"); // Go to OTP step
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      alert(msg);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      dispatch(setCredentials(res.data));
      onClose(); // close modal
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setError(msg);
    }
  };

  const termsText = (
    <div className="text-xs text-gray-600 max-w-xs text-center mt-8">
      <small>
        By signing up, you agree to Readflow’s{" "}
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
        >
          ✕
        </button>

        {step === "option" && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mt-8 mb-8">Join Readflow.</h2>
            <button
              className="w-full max-w-xs bg-black text-white py-3 px-4 rounded-full mb-4 flex items-center justify-center gap-3 hover:bg-gray-800 transition"
              onClick={() => alert("Google Signup Not Implemented")}
            >
              <span className="font-bold text-lg">G</span>
              Sign up with Google
            </button>
            <button
              className="w-full max-w-xs bg-black text-white py-3 px-4 rounded-full mb-8 flex items-center justify-center gap-3 hover:bg-gray-800 transition"
              onClick={() => setStep("email")}
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
                className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LfQMGorAAAAAFswxfidNQbwpm6PENShVQtaC0lH"
                onChange={(token) => setCaptchaToken(token)}
                className="mb-4"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Continue
              </button>
            </form>
            {termsText}
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col items-center text-center p-4">
            <h2 className="text-3xl font-bold mb-4">Verify OTP</h2>
            <form onSubmit={handleOtpVerify} className="w-full max-w-xs">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Verify
              </button>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </form>
            {termsText}
          </div>
        )}
      </div>
    </div>
  );
}
