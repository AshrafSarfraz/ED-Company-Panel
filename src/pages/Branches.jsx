


import { useState, useEffect } from "react";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Branches() {
  const navigate = useNavigate();
  const [branches,   setBranches]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [company,    setCompany]    = useState(null);
  const [form,       setForm]       = useState({ managerName: "", phone: "", email: "", password: "", branchNo: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [compRes, branchRes] = await Promise.all([
        API.get("/company/me"),
        API.get("/branch/company/branches"),
      ]);
      if (compRes.data.success)   setCompany(compRes.data.data);
      if (branchRes.data.success) setBranches(branchRes.data.data);
    } catch { toast.error("Failed to load data"); }
    finally  { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.post("/branch/company/branches/add", form);
      if (res.data.success) {
        toast.success("Branch created! Credentials sent to email ✅");
        setShowModal(false);
        setForm({ managerName: "", phone: "", email: "", password: "", branchNo: "" });
        fetchData();
      }
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    try {
      await API.delete(`/branch/company/branches/${id}`);
      toast.success("Branch deleted ✅");
      setBranches(bs => bs.filter(b => b._id !== id));
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  if (loading) return <Loader />;

  const docsApproved = company?.documentsStatus === "approved";

  return (
    <div className="max-w-[1500px] ">
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] md:text-[22px] font-extrabold text-brand-dark m-0">Branches</h1>
          <p className="text-[13px] text-brand-muted mt-1">{branches.length} branches</p>
        </div>
        {docsApproved ? (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer shadow-[0_4px_12px_rgba(241,90,33,0.3)]"
          >
            + Add Branch
          </button>
        ) : (
          <div className="text-[13px] text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-[8px]">
            🔒 Documents must be approved to add branches
          </div>
        )}
      </div>

      {/* Empty */}
      {branches.length === 0 ? (
        <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-16 text-center shadow-[0_4px_20px_rgba(241,90,33,0.06)]">
          <p className="text-brand-muted text-[15px] mb-4">No branches added yet</p>
          {docsApproved && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer shadow-[0_4px_12px_rgba(241,90,33,0.3)]"
            >
              + Add Your First Branch
            </button>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(241,90,33,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FFEDD5]">
                  {["Manager", "Email", "Phone", "Type", "Status", "Step", "Actions"].map(h => (
                    <th key={h} className="px-4 py-[13px] text-left text-[12px] text-[#7c3a1e] font-bold tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {branches.map(b => (
                  <tr key={b._id} className="border-b border-[#fdf0ea] hover:bg-[rgba(241,90,33,0.05)] transition-colors">
                    <td className="px-4 py-[14px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                          {b.managerName?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-[14px] font-semibold text-brand-dark m-0">{b.managerName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-[14px] text-[13px] text-brand-gray">{b.email}</td>
                    <td className="px-4 py-[14px] text-[13px] text-brand-gray">{b.phone}</td>
                    <td className="px-4 py-[14px]">
                      <span className={`px-3 py-[3px] rounded-[20px] text-[12px] font-semibold border
                        ${b.accountType === "Supplier" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                        {b.accountType}
                      </span>
                    </td>
                    <td className="px-4 py-[14px]">
                      <span className={`px-3 py-[3px] rounded-[20px] text-[12px] font-semibold border
                        ${b.status === "approved" ? "bg-green-50 text-green-700 border-green-200"
                        : b.status === "pending"  ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-red-50 text-red-600 border-red-200"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-[14px]">
                      <div className="flex items-center gap-1">
                        {[1,2].map(step => (
                          <div key={step} className={`w-2 h-2 rounded-full ${b.registrationStep >= step ? "bg-brand-primary" : "bg-gray-200"}`} />
                        ))}
                        <span className="text-[11px] text-brand-muted ml-1">Step {b.registrationStep}/2</span>
                      </div>
                    </td>
                    <td className="px-4 py-[14px]">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/branches/${b._id}/detail`)}
                          className="px-3 py-[5px] bg-blue-50 text-blue-700 border-none rounded-[7px] text-[12px] font-semibold cursor-pointer">
                          View
                        </button>
                        <button onClick={() => handleDelete(b._id)}
                          className="px-3 py-[5px] bg-red-50 text-red-600 border-none rounded-[7px] text-[12px] font-semibold cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] px-4">
          <div className="bg-white rounded-[20px] p-8 w-full max-w-[460px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[18px] font-bold text-brand-dark m-0">Add New Branch</h3>
              <button onClick={() => setShowModal(false)} className="bg-transparent border-none text-[18px] text-brand-muted cursor-pointer">✕</button>
            </div>
            <p className="text-[13px] text-brand-muted mb-5">Branch credentials will be sent to their email automatically.</p>

            <form onSubmit={handleAdd}>
              {[
                { label: "Manager Name",   key: "managerName", type: "text",     placeholder: "John Doe"          },
                { label: "Branch Number",  key: "branchNo",    type: "text",     placeholder: "e.g. BR-001"       },
                { label: "Phone",          key: "phone",       type: "tel",      placeholder: "+974 5000 0000"    },
                { label: "Email",          key: "email",       type: "email",    placeholder: "branch@company.com"},
                { label: "Password",       key: "password",    type: "password", placeholder: "••••••••"          },
              ].map(f => (
                <div key={f.key} className="mb-4">
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    required
                    className="w-full px-4 py-[11px] border border-brand-border rounded-[8px] text-[14px] outline-none bg-white focus:border-brand-primary transition-all"
                  />
                </div>
              ))}

              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-100 text-brand-gray border-none rounded-[8px] text-[14px] cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-brand-primary text-white border-none rounded-[8px] text-[14px] font-bold cursor-pointer disabled:opacity-70 shadow-[0_4px_12px_rgba(241,90,33,0.3)]">
                  {saving ? "Creating..." : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}