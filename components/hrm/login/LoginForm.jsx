"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import api from "@/app/hrm/lib/api";
import { toast } from "react-hot-toast";

const burstVariants = {
  hidden: { opacity: 0, scale: 0.75, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: [0.75, 1.08, 0.97, 1],
    filter: "blur(0px)",
    transition: { duration: 0.7, times: [0, 0.55, 0.8, 1], ease: [0.22, 0.8, 0.2, 1] },
  },
};

const reducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export default function LoginForm({
  visible,
  reducedMotion,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errors,
  loading,
  isFocused,
  setIsFocused,
  handleSubmit,
}) {
  const shakeControls = useAnimation();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotName, setForgotName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const prevGeneralError = useRef("");

  useEffect(() => {
    if (errors.general && errors.general !== prevGeneralError.current) {
      shakeControls.start({ x: [0, -8, 8, -6, 6, -3, 0], transition: { duration: 0.5 } });
    }
    prevGeneralError.current = errors.general;
  }, [errors.general, shakeControls]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotName.trim() || !forgotEmail.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setForgotLoading(true);
    try {
      await api.post("/forgot-password-email", { name: forgotName.trim(), email: forgotEmail.trim() });
      toast.success("Your request has been sent to the admin. Please wait for a reply.", { duration: 5000 });
      setShowForgotModal(false);
      setForgotName("");
      setForgotEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="card"
        variants={reducedMotion ? reducedVariants : burstVariants}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
      >
        <motion.div animate={shakeControls}>
          <div className="brand-row">
            <Image src="/A2ITLogo.png" alt="A2IT" width={36} height={36} className="logo" />
            <div>
              <h1 className="title">Welcome Back</h1>
              <p className="subtitle">Sign in to A2it HRM Portal</p>
            </div>
          </div>

          {errors.general && <div className="gen-err">{errors.general}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="field-wrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused((p) => ({ ...p, email: true }))}
                  onBlur={() => setIsFocused((p) => ({ ...p, email: false }))}
                  className={`field ${errors.email ? "err" : ""}`}
                  placeholder="Email Address"
                  autoComplete="email"
                />
                <label className={`fl ${isFocused.email || email ? "up" : ""}`}>Email Address</label>
              </div>
              {errors.email && <div className="msg">{errors.email}</div>}
            </div>

            <div className="row">
              <div className="field-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused((p) => ({ ...p, password: true }))}
                  onBlur={() => setIsFocused((p) => ({ ...p, password: false }))}
                  className={`field pr ${errors.password ? "err" : ""}`}
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <label className={`fl ${isFocused.password || password ? "up" : ""}`}>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <div className="msg">{errors.password}</div>}
            </div>

            <div className="forgot-row">
              <button type="button" onClick={() => setShowForgotModal(true)} className="forgot">
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="submit">
              {loading ? (
                <>
                  <span className="spin" /> Authenticating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login to Your Account
                </>
              )}
            </button>
          </form>

          <div className="secure">
            <span>
              <i className="pulse" /> Secure Connection
            </span>
            <span className="dotsep">•</span>
            <span>Privacy Protected</span>
          </div>
        </motion.div>
      </motion.div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-[#113F67] p-5 text-white">
              <h2 className="text-lg font-bold">Forgot Password?</h2>
              <p className="text-sm opacity-80 mt-0.5">We&apos;ll notify the admin to reset your password</p>
            </div>
            <form onSubmit={handleForgotPassword} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={forgotName}
                  onChange={(e) => setForgotName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#113F67] focus:outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#113F67] focus:outline-none text-sm transition-colors"
                />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
                After submitting, the admin will be notified and will reset your password and send it to you.
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotName("");
                    setForgotEmail("");
                  }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-2.5 bg-[#113F67] text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                >
                  {forgotLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.card) {
          position: relative;
          width: 380px;
          max-width: 88vw;
          background: #ffffff;
          border-radius: 22px;
          padding: 32px 28px 26px;
          box-shadow: 0 30px 60px -20px rgba(17, 63, 103, 0.28), 0 0 0 1px rgba(17, 63, 103, 0.06);
        }
        .brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }
        .logo {
          border-radius: 8px;
          flex-shrink: 0;
        }
        .title {
          font-size: 22px;
          font-weight: 800;
          color: #0f2942;
          line-height: 1.2;
        }
        .subtitle {
          font-size: 13px;
          color: #6b7a89;
          margin-top: 2px;
        }
        .gen-err {
          margin-bottom: 14px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 600;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 12px;
        }
        .row {
          margin-bottom: 16px;
        }
        .field-wrap {
          position: relative;
        }
        .field {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          font-size: 15px;
          color: #0f2942;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field::placeholder {
          color: transparent;
        }
        .field:focus {
          border-color: #113f67;
          box-shadow: 0 0 0 4px rgba(17, 63, 103, 0.12);
        }
        .field.err {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }
        .field.pr {
          padding-right: 46px;
        }
        .fl {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 15px;
          pointer-events: none;
          transition: all 0.2s ease;
          transform-origin: left;
        }
        .fl.up {
          top: 0;
          transform: translateY(-50%) scale(0.75);
          color: #113f67;
          font-weight: 700;
          background: #fff;
          padding: 0 6px;
        }
        .msg {
          color: #dc2626;
          font-size: 12px;
          padding: 3px 4px;
          display: inline-block;
          margin-top: 2px;
        }
        .eye-btn {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          padding: 4px;
        }
        .eye-btn:hover {
          color: #113f67;
        }
        .forgot-row {
          text-align: right;
          margin: -6px 0 16px;
        }
        .forgot {
          font-size: 12.5px;
          color: #113f67;
          font-weight: 600;
        }
        .forgot:hover {
          text-decoration: underline;
        }
        .submit {
          width: 100%;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          background: linear-gradient(90deg, #113f67, #1b5a8c);
          box-shadow: 0 14px 28px -10px rgba(17, 63, 103, 0.55);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 34px -12px rgba(17, 63, 103, 0.6);
        }
        .submit:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .spin {
          width: 16px;
          height: 16px;
          border: 2px solid #fff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: sp 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes sp {
          to {
            transform: rotate(360deg);
          }
        }
        .secure {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #94a3b8;
          font-size: 12px;
        }
        .secure span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2f9e6e;
          animation: pl 1.6s infinite;
        }
        @keyframes pl {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .dotsep {
          opacity: 0.5;
        }
      `}</style>
    </>
  );
}
