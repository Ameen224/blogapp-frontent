// src/components/modals/SignupModal.jsx

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import ReCAPTCHA from "react-google-recaptcha"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Dialog, DialogContent } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { LoadingSpinner } from "../ui/loading-spinner"
import { setCredentials } from "../../lib/authSlice"
import api from "../../lib/api"
import { X, Mail, ArrowLeft } from "lucide-react"

export function SignupModal({ onClose }) {
  const [step, setStep] = useState("option")
  const [email, setEmail] = useState("")
  const [captchaToken, setCaptchaToken] = useState(null)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const dispatch = useDispatch()
  const recaptchaRef = useRef()

  // Countdown timer for OTP expiry
  useEffect(() => {
    let interval
    if (otpExpiry && countdown > 0) {
      interval = setInterval(() => {
        const now = new Date().getTime()
        const timeLeft = Math.max(0, Math.floor((otpExpiry - now) / 1000))
        setCountdown(timeLeft)
        if (timeLeft === 0) {
          setError("OTP has expired. Please request a new one.")
          setStep("email")
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpExpiry, countdown])

  const handleGoogleLogin = () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Opening Google OAuth popup...")

      const popup = window.open(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        "googleAuth",
        "width=500,height=600,scrollbars=yes,resizable=yes",
      )

      if (!popup) {
        setError("Popup blocked. Please allow popups for this site.")
        setLoading(false)
        return
      }

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          setLoading(false)
          window.location.reload()
        }
      }, 1000)

      const handleMessage = (event) => {
        if (event.origin !== (import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000")) return

        if (event.data.type === "AUTH_SUCCESS") {
          clearInterval(checkClosed)
          dispatch(setCredentials(event.data.payload))
          popup.close()
          onClose()
          setLoading(false)
        } else if (event.data.type === "AUTH_ERROR") {
          clearInterval(checkClosed)
          setError(event.data.message || "Authentication failed")
          popup.close()
          setLoading(false)
        }
      }

      window.addEventListener("message", handleMessage)

      const cleanup = () => {
        window.removeEventListener("message", handleMessage)
        clearInterval(checkClosed)
      }

      setTimeout(cleanup, 300000) // 5 minutes timeout
    } catch (err) {
      console.error("Google login failed", err)
      setError("Google login failed. Please try again.")
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!captchaToken) {
      setError("Please complete the reCAPTCHA")
      setLoading(false)
      return
    }

    try {
      const response = await api.post("/user/send-otp", {
        email,
        captcha: captchaToken,
      })

      // Store OTP session info
      const expiryTime = new Date().getTime() + 5 * 60 * 1000 // 5 minutes
      sessionStorage.setItem("otpEmail", email)
      sessionStorage.setItem("otpExpiry", expiryTime.toString())
      setOtpExpiry(expiryTime)
      setCountdown(300) // 5 minutes in seconds
      setStep("otp")
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP"
      setError(msg)
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
        setCaptchaToken(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const storedEmail = sessionStorage.getItem("otpEmail")
    const storedExpiry = sessionStorage.getItem("otpExpiry")

    if (!storedEmail || !storedExpiry) {
      setError("Session expired. Please start over.")
      setStep("email")
      setLoading(false)
      return
    }

    if (new Date().getTime() > Number.parseInt(storedExpiry)) {
      setError("OTP has expired. Please request a new one.")
      setStep("email")
      setLoading(false)
      return
    }

    try {
      const response = await api.post("/user/verify-otp", {
        email: storedEmail,
        otp,
      })

      // Clear session storage
      sessionStorage.removeItem("otpEmail")
      sessionStorage.removeItem("otpExpiry")
      dispatch(setCredentials(response.data))
      onClose()
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await api.post("/user/send-otp", {
        email,
        captcha: captchaToken,
      })

      const expiryTime = new Date().getTime() + 5 * 60 * 1000
      sessionStorage.setItem("otpExpiry", expiryTime.toString())
      setOtpExpiry(expiryTime)
      setCountdown(300)
      setOtp("")
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )

  const termsText = (
    <div className="text-xs text-gray-600 max-w-xs text-center">
      <small>
        By signing up, you agree to ReadFlow's{" "}
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          Terms of Service
        </a>{" "}
        and acknowledge our{" "}
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          Privacy Policy
        </a>
        .
      </small>
    </div>
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <Button variant="ghost" size="sm" className="absolute top-4 right-4" onClick={onClose} disabled={loading}>
          <X className="h-4 w-4" />
        </Button>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-700 flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {step === "option" && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Join ReadFlow</h2>
              <p className="text-gray-600">Start your reading journey today</p>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-3 bg-transparent"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Loading...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <Button
                onClick={() => setStep("email")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3"
              >
                <Mail className="h-4 w-4" />
                Sign up with Email
              </Button>
            </div>

            <div className="mt-6">{termsText}</div>
          </div>
        )}

        {step === "email" && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign up with Email</h2>
              <p className="text-gray-600">Enter your email address to get started</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="w-full max-w-xs space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
                  onChange={(token) => setCaptchaToken(token)}
                  size="compact"
                />
              </div>

              <Button type="submit" disabled={loading || !captchaToken} className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Sending...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>

            <Button
              variant="ghost"
              onClick={() => setStep("option")}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to options
            </Button>

            <div className="mt-6">{termsText}</div>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
              <p className="text-gray-600">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
              {countdown > 0 && (
                <p className="text-sm text-blue-600 mt-2">
                  Code expires in: <strong>{formatTime(countdown)}</strong>
                </p>
              )}
            </div>

            <form onSubmit={handleOtpVerify} className="w-full max-w-xs space-y-4">
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                disabled={loading}
                className="text-center text-lg font-mono"
              />

              <Button type="submit" disabled={loading || otp.length !== 6} className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Verifying...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>

            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={loading || countdown > 240} // Allow resend after 1 minute
                className="text-blue-600 hover:text-blue-800"
              >
                {countdown > 240 ? `Resend in ${formatTime(countdown - 240)}` : "Resend OTP"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep("email")}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to email
              </Button>
            </div>

            <div className="mt-6">{termsText}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
