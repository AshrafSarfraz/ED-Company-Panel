import { useState, useEffect } from "react";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";

const statusCls = {
  approved:  "bg-green-50 text-green-700 border-green-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  rejected:  "bg-red-50 text-red-600 border-red-200",
  expired:   "bg-red-50 text-red-600 border-red-200",
  pending:   "bg-gray-50 text-gray-500 border-gray-200",
};

const DocStatus = ({ status = "pending" }) => (
  <span className={`mt-2 inline-block px-3 py-[3px] rounded-[20px] text-[11px] font-semibold border ${statusCls[status] || statusCls.pending}`}>
    {status}
  </span>
);

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : null);

export default function Profile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    API.get("/company/me")
      .then(res => { if (res.data.success) setCompany(res.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error("Passwords do not match");
    setSaving(true);
    try {
      await API.patch("/company/me/change-password", {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      });
      toast.success("Password changed ✅");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  const cardCls     = "bg-brand-white border border-brand-border rounded-[12px] p-4";
  const cardTitle   = "text-[11px] text-brand-muted m-0 mb-3 font-semibold uppercase tracking-wide";
  const viewLinkCls = "block px-3 py-2 bg-blue-50 text-blue-700 rounded-[8px] text-[12px] text-center no-underline mb-2 font-semibold";

  return (
    <div className="max-w-[1500px]">
      <Toaster />

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <div className="flex items-center gap-4 mb-5">
          {company?.companyLogo
            ? <img src={company.companyLogo} alt="" className="w-16 h-16 rounded-[12px] object-contain border shrink-0" />
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-5 border-t border-brand-border">
          {[
            ["Brand Name",     company?.brandName],
            ["Email",          company?.email],
            ["Phone",          company?.phone],
            ["Business Type",  company?.businessType],
            ["Contact Person", `${company?.firstName} ${company?.lastName}`],
            ["Role",           company?.roleInBusiness],
            ["Trade License",  company?.tradeLicenseNumber],
            ["CR Number",      company?.crNumber || "—"],
            ["Joined",         fmtDate(company?.createdAt)],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-[11px] text-brand-muted m-0 mb-[3px]">{label}</p>
              <p className="text-[13px] font-semibold text-brand-dark m-0">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <h3 className="text-[15px] font-bold text-brand-dark m-0 mb-5">Documents</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Company Logo */}
          <div className={cardCls}>
            <p className={cardTitle}>Company Logo</p>
            {company?.companyLogo
              ? <img src={company.companyLogo} alt="logo" className="w-[60px] h-[60px] rounded-[8px] object-contain border" />
              : <p className="text-[12px] text-brand-muted m-0">Not uploaded</p>
            }
          </div>

          {/* Trade License */}
          <div className={cardCls}>
            <p className={cardTitle}>Trade License</p>
            {company?.tradeLicenseImage
              ? <a href={company.tradeLicenseImage} target="_blank" rel="noreferrer" className={viewLinkCls}>
                  View Document →
                </a>
              : <p className="text-[12px] text-brand-muted mb-2 m-0">Not uploaded</p>
            }
            {company?.tradeLicenseNumber && (
              <p className="text-[11px] text-brand-muted mt-2 m-0">No: {company.tradeLicenseNumber}</p>
            )}
            {company?.tradeLicenseExpiry && (
              <p className="text-[11px] text-brand-muted mt-2 m-0">Expiry: {fmtDate(company.tradeLicenseExpiry)}</p>
            )}
            <DocStatus status={company?.tradeLicenseStatus} />
          </div>

          {/* QID */}
          <div className={cardCls}>
            <p className={cardTitle}>QID (Contact Person)</p>
            {company?.qidImage
              ? <a href={company.qidImage} target="_blank" rel="noreferrer" className={viewLinkCls}>
                  View Document →
                </a>
              : <p className="text-[12px] text-brand-muted mb-2 m-0">Not uploaded</p>
            }
            {company?.qidExpiry && (
              <p className="text-[11px] text-brand-muted mt-2 m-0">Expiry: {fmtDate(company.qidExpiry)}</p>
            )}
            <DocStatus status={company?.qidStatus} />
          </div>

          {/* CR — Commercial Registration */}
          <div className={cardCls}>
            <p className={cardTitle}>Commercial Registration</p>
            {company?.crImage
              ? <a href={company.crImage} target="_blank" rel="noreferrer" className={viewLinkCls}>
                  View Document →
                </a>
              : <p className="text-[12px] text-brand-muted mb-2 m-0">Not uploaded</p>
            }
            {company?.crNumber && (
              <p className="text-[11px] text-brand-muted mt-2 m-0">CR No: {company.crNumber}</p>
            )}
            {company?.crExpiry && (
              <p className="text-[11px] text-brand-muted mt-2 m-0">Expiry: {fmtDate(company.crExpiry)}</p>
            )}
            <DocStatus status={company?.crStatus} />
          </div>

        </div>

        {company?.documentsStatus === "rejected" && company?.documentsRejectionReason && (
          <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2 mt-4 m-0">
            Reason: {company.documentsRejectionReason}
          </p>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <h3 className="text-[15px] font-bold text-brand-dark m-0 mb-5">Change Password</h3>
        <form onSubmit={handleChangePassword}>
          {[
            { label: "Current Password",     key: "currentPassword" },
            { label: "New Password",         key: "newPassword"     },
            { label: "Confirm New Password", key: "confirmPassword" },
          ].map(f => (
            <div key={f.key} className="mb-4">
              <label className="block text-[13px] font-semibold text-brand-dark mb-2">{f.label}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                required
                className="w-full px-4 py-[11px] border border-brand-border rounded-[8px] text-[14px] outline-none bg-white focus:border-brand-primary transition-all"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer disabled:opacity-70 shadow-[0_4px_12px_rgba(241,90,33,0.3)] transition-all"
          >
            {saving ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
