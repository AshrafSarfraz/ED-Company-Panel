

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const BASE  = "https://el-distibutor-backend.onrender.com";
const token = () => localStorage.getItem("companyToken");

const apiFetch = (path) =>
  fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json());

export default function BranchDetail() {
  const { id }             = useParams();
  const navigate           = useNavigate();
  const [data,    setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/branch/company/branches/${id}/detail`)
      .then(res => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!data)   return <div className="flex items-center justify-center h-[60vh] text-brand-muted">Branch not found</div>;

  const { branch, items, totalItems } = data;

  const InfoGrid = ({ items: infoItems }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {infoItems.map(([label, val]) => (
        <div key={label}>
          <p className="text-[11px] text-brand-muted m-0 mb-[3px]">{label}</p>
          <p className="text-[13px] font-semibold text-brand-dark m-0">{val || "-"}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[1500px] ">

      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <div className="flex items-start gap-4 flex-wrap mb-5">
          <div className="w-14 h-14 rounded-[12px] bg-brand-gradient text-white flex items-center justify-center text-[22px] font-bold shrink-0 shadow-[0_3px_8px_rgba(241,90,33,0.25)]">
            {branch.managerName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-[20px] font-extrabold text-brand-dark m-0">{branch.managerName}</h1>
              {[
                { val: branch.accountType, cls: branch.accountType === "Supplier" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200" },
                { val: branch.status,      cls: branch.status === "approved" ? "bg-green-50 text-green-700 border-green-200" : branch.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200" },
                { val: branch.isActive ? "Active" : "Inactive", cls: branch.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200" },
                { val: `Step ${branch.registrationStep}/2`, cls: "bg-gray-50 text-gray-500 border-gray-200" },
              ].map((b, i) => (
                <span key={i} className={`px-3 py-[3px] rounded-[20px] text-[12px] font-semibold border ${b.cls}`}>{b.val}</span>
              ))}
            </div>
            <p className="text-[13px] text-brand-muted m-0">{branch.email} • {branch.phone}</p>
          </div>
        </div>
        <div className="pt-5 border-t border-brand-border">
          <InfoGrid items={[
            ["Branch No",        branch.branchNo],
            ["Company",          branch.companyId?.brandName],
            ["Account Type",     branch.accountType],
            ["Manager",          branch.managerName],
            ["Email",            branch.email],
            ["Phone",            branch.phone],
            ["Joined",           new Date(branch.createdAt).toLocaleDateString()],
            ["Password Changed", branch.isPasswordChanged ? "Yes" : "No"],
          ]} />
        </div>
      </div>

      {/* Address */}
      <div className="bg-gradient-to-br from-[#FFF1DD] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-4">Address</h2>
        {branch.address?.address
          ? <InfoGrid items={[["Address", branch.address?.address], ["Area", branch.address?.area], ["City", branch.address?.city], ["Lat", branch.address?.lat], ["Lng", branch.address?.lng]]} />
          : <p className="text-brand-muted text-[13px] m-0">Address not added yet</p>
        }
      </div>

  
      {/* Bank Details */}
      <div className="bg-gradient-to-br from-[#FFF1DD] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
        <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-4">Bank Details</h2>
        {branch.bankDetails?.accountName
          ? <InfoGrid items={[["Account Name", branch.bankDetails?.accountName], ["Account Number", branch.bankDetails?.accountNumber], ["IBAN", branch.bankDetails?.iban], ["Bank Name", branch.bankDetails?.bankName]]} />
          : <p className="text-brand-muted text-[13px] m-0">Bank details not added yet</p>
        }
      </div>

      {/* PDC Buyer */}
      {branch.accountType === "Buyer" && (
        <div className="bg-gradient-to-br from-[#FFF1DD] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
          <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-4">PDC Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-brand-muted m-0 mb-[3px]">PDC Amount</p>
              <p className={`text-[13px] font-bold m-0 ${branch.pdcAmount ? "text-green-700" : "text-red-600"}`}>
                {branch.pdcAmount ? `${branch.pdcAmount} QAR` : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-brand-muted m-0 mb-[3px]">PDC Image</p>
              {branch.pdcImage
                ? <a href={branch.pdcImage} target="_blank" rel="noreferrer" className="px-3 py-[5px] bg-blue-50 text-blue-700 rounded-[8px] text-[12px] font-semibold no-underline inline-block">View PDC →</a>
                : <p className="text-[13px] text-red-600 font-semibold m-0">Not uploaded</p>
              }
            </div>
            <div>
              <p className="text-[11px] text-brand-muted m-0 mb-[3px]">Contract PDF</p>
              {branch.contractPdf
                ? <a href={branch.contractPdf} target="_blank" rel="noreferrer" className="px-3 py-[5px] bg-blue-50 text-blue-700 rounded-[8px] text-[12px] font-semibold no-underline inline-block">View Contract →</a>
                : <p className="text-[13px] text-red-600 font-semibold m-0">Not uploaded</p>
              }
            </div>
          </div>
        </div>
      )}

      {/* Catalog Items */}
      {branch.accountType === "Supplier" && (
        <div className="bg-gradient-to-br from-[#FFF1DD] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
          <div className="p-5 md:p-6 pb-4">
            <h2 className="text-[15px] font-bold text-brand-dark m-0">Catalog Items ({totalItems})</h2>
          </div>
          {items.length === 0 ? (
            <p className="text-brand-muted text-[13px] px-6 pb-6 m-0">No items added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FFEDD5]">
                    {["Item", "Category", "Country", "Price/Unit", "Listed", "Available Today"].map(h => (
                      <th key={h} className="px-4 py-[13px] text-left text-[12px] text-[#7c3a1e] font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id} className="border-b border-[#fdf0ea] hover:bg-[rgba(241,90,33,0.05)] transition-colors">
                      <td className="px-4 py-[12px]">
                        <div className="flex items-center gap-3">
                          {item.platformItemId?.image
                            ? <img src={item.platformItemId.image} alt="" className="w-8 h-8 rounded-[6px] object-cover" />
                            : <div className="w-8 h-8 rounded-[6px] bg-brand-lighter flex items-center justify-center text-[10px] text-brand-muted">IMG</div>
                          }
                          <div>
                            <p className="text-[13px] font-semibold text-brand-dark m-0">{item.platformItemId?.name}</p>
                            <p className="text-[11px] text-brand-muted m-0">{item.platformItemId?.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-[12px] text-[13px] text-brand-gray">{item.categoryId?.name || "-"}</td>
                      <td className="px-4 py-[12px] text-[13px] text-brand-gray">{item.countryId?.name || "-"}</td>
                      <td className="px-4 py-[12px] text-[14px] font-bold text-brand-dark">{item.pricePerUnit} QAR</td>
                      <td className="px-4 py-[12px]">
                        <span className={`px-2 py-[2px] rounded-[10px] text-[11px] font-semibold ${item.isListed ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                          {item.isListed ? "Listed" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-[12px]">
                        <span className={`px-2 py-[2px] rounded-[10px] text-[11px] font-semibold ${item.isAvailableToday ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                          {item.isAvailableToday ? "Available" : "Unavailable"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}