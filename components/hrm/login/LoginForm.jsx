"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import api from "@/app/hrm/lib/api";
import { toast } from "react-hot-toast";

/** Cascade used for the label/field/button rows, matching the reference. */
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.42, ease: [0.22, 0.9, 0.24, 1] },
  }),
};

export default function LoginForm({
  fieldsVisible = true,
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
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotName, setForgotName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const anim = (i) => ({
    variants: rise,
    custom: i,
    initial: reducedMotion ? false : "hidden",
    animate: fieldsVisible ? "show" : "hidden",
  });

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
      <div className="head">
        <h1 className="title">Welcome Back</h1>
        <p className="sub">Sign in to your A2it HRM Portal account</p>
      </div>

      <div className="pane">
        {errors.general && <div className="gen-err">{errors.general}</div>}

        <form onSubmit={handleSubmit} noValidate>
          
          <motion.div className="row" {...anim(1)}>
            <div className={`ctrl ${errors.email ? "bad" : ""} ${isFocused.email ? "on" : ""}`}>
              <Mail className="ico" size={17} strokeWidth={1.9} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused((p) => ({ ...p, email: true }))}
                onBlur={() => setIsFocused((p) => ({ ...p, email: false }))}
                placeholder="yourname@gmail.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="msg">{errors.email}</span>}
          </motion.div>

          
          <motion.div className="row" {...anim(3)}>
            <div className={`ctrl ${errors.password ? "bad" : ""} ${isFocused.password ? "on" : ""}`}>
              <Lock className="ico" size={17} strokeWidth={1.9} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused((p) => ({ ...p, password: true }))}
                onBlur={() => setIsFocused((p) => ({ ...p, password: false }))}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="peek"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={17} strokeWidth={1.9} /> : <Eye size={17} strokeWidth={1.9} />}
              </button>
            </div>
            {errors.password && <span className="msg">{errors.password}</span>}
          </motion.div>

          <motion.button type="submit" disabled={loading} className="go" {...anim(4)}>
            {loading ? (
              <>
                <Loader2 className="spin" size={17} /> Authenticating...
              </>
            ) : (
              <>
                <LogIn size={17} strokeWidth={2.2} /> Login
              </>
            )}
          </motion.button>

          <motion.div className="foot" {...anim(5)}>
            <button type="button" onClick={() => setShowForgotModal(true)} className="forgot">
              Forgot Password?
            </button>
            <span className="secure">
              <i className="dot" /> Secure Connection
            </span>
          </motion.div>
        </form>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-[#5a5ff2] p-5 text-white">
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
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#5a5ff2] focus:outline-none text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#5a5ff2] focus:outline-none text-sm transition-colors"
                />
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-xs text-indigo-700">
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
                  className="flex-1 py-2.5 bg-[#5a5ff2] text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-60 text-sm flex items-center justify-center gap-2"
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
        /* styled-jsx only scopes plain DOM elements. Anything below whose
           className lands on a component (next/image, motion.*, lucide) has
           to be :global, namespaced under .card so it can't leak. */
        .head {
          text-align: center;
          margin-bottom: 20px;
        }
        :global(.card .mark) {
          border-radius: 8px;
          margin: 0 auto 10px;
          display: block;
          background: #fff;
          padding: 3px;
        }
        .title {
          color: #20264a;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.4px;
          line-height: 1.15;
        }
        .sub {
          color: #5b6472;
          font-size: 13px;
          margin-top: 5px;
        }

        .pane {
          padding-left: 0;
        }

        .gen-err {
          margin-bottom: 13px;
          padding: 9px 12px;
          font-size: 12.5px;
          font-weight: 600;
          color: #fff;
          background: rgba(220, 38, 38, 0.9);
          border-radius: 9px;
          text-align: center;
        }
        :global(.card .cap) {
          display: block;
          text-align: center;
          color: #39415a;
          font-size: 12.5px;
          font-weight: 600;
          margin-bottom: 7px;
        }
        .req {
          color: #e11d48;
        }
        :global(.card .row) {
          margin-bottom: 14px;
        }
        .ctrl {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #fff;
          border: 1px solid #c4cedb;
          border-radius: 9px;
          padding: 0 12px;
          height: 46px;
          box-shadow: 0 1px 2px rgba(19, 21, 70, 0.06);
          transition: box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .ctrl.on {
          border-color: #5a5ff2;
          box-shadow: 0 0 0 3px rgba(90, 95, 242, 0.22);
        }
        .ctrl.bad {
          border-color: #f87171;
          box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.28);
        }
        .ctrl :global(.ico) {
          color: #9aa3b2;
          flex-shrink: 0;
        }
        .ctrl input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: #1f2440;
          min-width: 0;
        }
        .ctrl input::placeholder {
          color: #a7aec0;
        }
        .peek {
          color: #9aa3b2;
          display: flex;
          padding: 3px;
          flex-shrink: 0;
        }
        .peek:hover {
          color: #5a5ff2;
        }
        .msg {
          display: block;
          margin-top: 5px;
          font-size: 11.5px;
          font-weight: 600;
          color: #dc2626;
          text-align: center;
        }
        :global(.card .go) {
          width: 100%;
          height: 46px;
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 9px;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          background: linear-gradient(180deg, #34cf72 0%, #22bd60 100%);
          box-shadow: 0 6px 16px -6px rgba(11, 92, 48, 0.8);
          transition: filter 0.18s ease, transform 0.18s ease;
        }
        :global(.card .go:hover:not(:disabled)) {
          filter: brightness(1.06);
        }
        :global(.card .go:disabled) {
          opacity: 0.75;
          cursor: not-allowed;
        }
        :global(.card .go .spin) {
          animation: sp 0.9s linear infinite;
        }
        @keyframes sp {
          to {
            transform: rotate(360deg);
          }
        }
        :global(.card .foot) {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .forgot {
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
        }
        .forgot:hover {
          color: #5a5ff2;
          text-decoration: underline;
        }
        .secure {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #6b7280;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: pl 1.6s infinite;
        }
        @keyframes pl {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.25;
          }
        }

        @media (max-width: 860px) {
          .title {
            font-size: 22px;
          }
        }
        @media (max-width: 620px) {
          .pane {
            padding-left: 0;
          }
          :global(.card .foot) {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>
    </>
  );
}
