import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";

export default function UpdatePassword() {
  const [company,  setCompany]  = useState(null);
  const [form,     setForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(true);
  const navigate                = useNavigate();

  useEffect(() => {
    API.get("/company/me")
      .then(res => { if (res.data.success) setCompany(res.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error("Passwords do not match");
    setSaving(true);
    try {
      await API.patch("/company/me/change-password", {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      });
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1500px] ">
      <Toaster />

      {/* Company Info */}
      <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <div className="flex items-center gap-4">
          {company?.companyLogo
            ? <img src={company.companyLogo} alt="" className="w-16 h-16 rounded-[12px] object-cover shrink-0" />
            : <div className="w-16 h-16 rounded-[12px] bg-brand-primary text-white flex items-center justify-center text-[24px] font-bold shrink-0 shadow-[0_3px_8px_rgba(241,90,33,0.25)]">
                {company?.brandName?.charAt(0)}
              </div>
          }
          <div>
            <h2 className="text-[20px] font-extrabold text-brand-dark m-0 mb-1">{company?.brandName}</h2>
            <span className={`px-3 py-[3px] rounded-[20px] text-[12px] font-semibold border
              ${company?.accountType === "Supplier" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
              {company?.accountType}
            </span>
          </div>
        </div>
      </div>

      {/* Update Password */}
      <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <h3 className="text-[15px] font-bold text-brand-dark m-0 mb-2">Update Password</h3>
        <p className="text-[13px] text-brand-muted m-0 mb-6">Keep your account secure by setting a strong password.</p>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Current Password",     key: "currentPassword", toggleKey: "current" },
            { label: "New Password",         key: "newPassword",     toggleKey: "new"     },
            { label: "Confirm New Password", key: "confirmPassword", toggleKey: "confirm" },
          ].map(f => (
            <div key={f.key} className="mb-4">
              <label className="block text-[13px] font-semibold text-brand-dark mb-2">{f.label}</label>
              <div className="relative">
                <input
                  type={showPass[f.toggleKey] ? "text" : "password"}
                  placeholder="••••••••"
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  required
                  className="w-full px-4 py-[11px] pr-11 border border-brand-border rounded-[8px] text-[14px] outline-none bg-white focus:border-brand-primary transition-all"
                />
                <span
                  onClick={() => setShowPass(p => ({ ...p, [f.toggleKey]: !p[f.toggleKey] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-brand-gray hover:text-brand-primary transition-colors"
                >
                  {showPass[f.toggleKey] ? <EyeOff size={14} /> : <Eye size={14} />}
                </span>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer disabled:opacity-70 shadow-[0_4px_12px_rgba(241,90,33,0.3)] transition-all mt-2"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}