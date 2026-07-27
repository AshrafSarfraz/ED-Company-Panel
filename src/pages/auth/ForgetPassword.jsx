


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../assets/Images/logo 6.png";
import AuthBg from "../../assets/Images/authbg.png";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState("email");
  const navigate              = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("companyToken");
    if (token) navigate("/home");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/company/forgot-password", { email });
      toast.success("New password sent to your email!");
      setStep("reset");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FC9B3F]">
      <Toaster />

      {/* Left Side */}
      <div className="hidden md:flex flex-1 relative overflow-hidden flex-col">
        <img
          src={AuthBg}
          alt="Forgot Password"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="relative z-10 px-16 pt-[120px]">
          <h1 className="text-white text-[34px] font-extrabold leading-tight m-0">
            Forgot Password?
          </h1>
          <p className="text-white/80 text-[16px] mt-1 font-bold  max-w-[300px]">
            Enter your email and we'll help you reset your password quickly.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-brand-white min-h-screen md:min-h-0">
        <div className="w-full max-w-[460px] bg-[#FFF7ED] rounded-[24px] px-10 py-14">

          <div className="flex justify-center mb-5">
            <img src={logo} alt="EL Distributor" className="w-14 h-14 rounded-[12px] shadow-[0_4px_12px_rgba(241,90,33,0.3)]" />
          </div>
  
          {step === "email" ? (
            <>
              <div className="mb-2">
                <h3 className="text-[18px] font-bold text-brand-dark text-center m-0">Forgot Password?</h3>
                <p className="text-[13px] text-brand-muted text-center mt-1 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="company@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-[11px] border border-brand-border rounded-[8px] text-[14px] outline-none bg-white focus:border-brand-primary transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-primary text-white rounded-[8px] text-[15px] font-bold border-none cursor-pointer disabled:opacity-70 shadow-[0_4px_12px_rgba(241,90,33,0.3)] transition-all"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p
                onClick={() => navigate("/")}
                className="text-center mt-5 text-brand-primary text-[13px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              >
                ← Back to Login
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-full bg-brand-soft border-2 border-brand-primary flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(241,90,33,0.2)]">
                <span className="text-brand-primary text-[36px] font-bold">✓</span>
              </div>
              <h3 className="text-[22px] font-extrabold text-brand-dark m-0 mb-3">Email Sent!</h3>
              <p className="text-[14px] text-brand-muted leading-relaxed m-0">
                Check your email for instructions to reset your password. Redirecting to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}