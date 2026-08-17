// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";
// import toast, { Toaster } from "react-hot-toast";
// import Loader from "../components/Loader";

// export default function Home() {
//   const [company,   setCompany]   = useState(null);
//   const [loading,   setLoading]   = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();

//   const [files, setFiles] = useState({
//     companyLogo:       null,
//     tradeLicenseImage: null,
//     qidImage:          null,
//   });
//   const [expiry, setExpiry] = useState({
//     tradeLicenseExpiry: "",
//     qidExpiry:          "",
//   });

//   useEffect(() => {
//     API.get("/company/me")
//       .then(res => { if (res.data.success) setCompany(res.data.data); })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     setUploading(true);
//     try {
//       const fd = new FormData();
//       if (files.companyLogo)         fd.append("companyLogo",         files.companyLogo);
//       if (files.tradeLicenseImage)   fd.append("tradeLicenseImage",   files.tradeLicenseImage);
//       if (files.qidImage)            fd.append("qidImage",            files.qidImage);
//       if (expiry.tradeLicenseExpiry) fd.append("tradeLicenseExpiry",  expiry.tradeLicenseExpiry);
//       if (expiry.qidExpiry)          fd.append("qidExpiry",           expiry.qidExpiry);

//       const res = await API.patch("/company/me/update-documents", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (res.data.success) {
//         setCompany(res.data.data);
//         toast.success("Documents submitted successfully!");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) return <Loader />;

//   const statusConfig = {
//     pending:   { text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200", dot: "bg-amber-500",  msg: "Please upload your documents to get started" },
//     submitted: { text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  dot: "bg-blue-500",   msg: "Documents submitted. Waiting for admin approval." },
//     approved:  { text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", dot: "bg-green-500",  msg: "Documents approved! You can now add branches." },
//     rejected:  { text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",   dot: "bg-red-500",    msg: "Documents rejected. Please re-upload." },
//   };

//   const sc = statusConfig[company?.documentsStatus] || statusConfig.pending;

//   return (
//     <div className="max-w-[1500px] mx-auto px-2 md:px-[10px]">
//       <Toaster />

//       {/* Header */}
//       <div className="flex items-center gap-4 mb-5">
//         {company?.companyLogo
//           ? <img src={company.companyLogo} alt="" className="w-14 h-14 rounded-[12px] object-cover shrink-0" />
//           : <div className="w-14 h-14 rounded-[12px] bg-brand-primary text-white flex items-center justify-center text-[22px] font-bold shrink-0 shadow-[0_3px_8px_rgba(241,90,33,0.25)]">
//               {company?.brandName?.charAt(0)}
//             </div>
//         }
//         <div>
//           <h1 className="text-[20px] md:text-[22px] font-extrabold text-brand-dark m-0 mb-1">{company?.brandName}</h1>
//           <span className={`px-3 py-[3px] rounded-[20px] text-[12px] font-semibold border
//             ${company?.accountType === "Supplier" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
//             {company?.accountType}
//           </span>
//         </div>
//       </div>

//       {/* Status Banner */}
//       <div className={`flex gap-3 items-start p-4 rounded-[14px] border ${sc.bg} ${sc.border} mb-5`}>
//         <div className={`w-[10px] h-[10px] rounded-full mt-1 shrink-0 ${sc.dot}`} />
//         <div>
//           <p className={`text-[13px] font-bold m-0 mb-1 ${sc.text}`}>
//             Documents: {company?.documentsStatus?.toUpperCase()}
//           </p>
//           <p className="text-[13px] text-brand-gray m-0">{sc.msg}</p>
//           {company?.documentsStatus === "rejected" && company?.documentsRejectionReason && (
//             <p className="text-red-600 text-[13px] mt-1 m-0">Reason: {company.documentsRejectionReason}</p>
//           )}
//         </div>
//       </div>

//       {/* Upload Documents */}
//       {["pending", "rejected"].includes(company?.documentsStatus) && (
//         <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
//           <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-5">Upload Documents</h2>
//           <form onSubmit={handleUpload}>

//             {/* Company Logo */}
//             <div className="mb-4">
//               <label className="block text-[13px] font-semibold text-brand-dark mb-2">Company Logo</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => setFiles(f => ({ ...f, companyLogo: e.target.files[0] }))}
//                 className="w-full text-[13px] px-3 py-2 border border-dashed border-brand-border rounded-[8px]"
//               />
//               {files.companyLogo && <p className="text-[12px] text-green-600 mt-1">✅ {files.companyLogo.name}</p>}
//             </div>

//             {/* Trade License */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-[13px] font-semibold text-brand-dark mb-2">
//                   Trade License Image <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*,application/pdf"
//                   onChange={e => setFiles(f => ({ ...f, tradeLicenseImage: e.target.files[0] }))}
//                   className="w-full text-[13px] px-3 py-2 border border-dashed border-brand-border rounded-[8px]"
//                 />
//                 {files.tradeLicenseImage && <p className="text-[12px] text-green-600 mt-1">✅ {files.tradeLicenseImage.name}</p>}
//                 {company?.tradeLicenseImage && !files.tradeLicenseImage && (
//                   <p className="text-[12px] text-brand-muted mt-1">
//                     Already uploaded — <a href={company.tradeLicenseImage} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-[13px] font-semibold text-brand-dark mb-2">
//                   Trade License Expiry <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={expiry.tradeLicenseExpiry}
//                   onChange={e => setExpiry(ex => ({ ...ex, tradeLicenseExpiry: e.target.value }))}
//                   className="w-full px-4 py-[10px] border border-brand-border rounded-[8px] text-[14px] outline-none bg-white focus:border-brand-primary transition-all"
//                 />
//               </div>
//             </div>

//             {/* QID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <div>
//                 <label className="block text-[13px] font-semibold text-brand-dark mb-2">
//                   QID Image (Contact Person) <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*,application/pdf"
//                   onChange={e => setFiles(f => ({ ...f, qidImage: e.target.files[0] }))}
//                   className="w-full text-[13px] px-3 py-2 border border-dashed border-brand-border rounded-[8px]"
//                 />
//                 {files.qidImage && <p className="text-[12px] text-green-600 mt-1">✅ {files.qidImage.name}</p>}
//                 {company?.qidImage && !files.qidImage && (
//                   <p className="text-[12px] text-brand-muted mt-1">
//                     Already uploaded — <a href={company.qidImage} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-[13px] font-semibold text-brand-dark mb-2">
//                   QID Expiry <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={expiry.qidExpiry}
//                   onChange={e => setExpiry(ex => ({ ...ex, qidExpiry: e.target.value }))}
//                   className="w-full px-4 py-[10px] border border-brand-border rounded-[8px] text-[14px] outline-none bg-white focus:border-brand-primary transition-all"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={uploading}
//               className="px-6 py-3 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer disabled:opacity-70 shadow-[0_4px_12px_rgba(241,90,33,0.3)] transition-all"
//             >
//               {uploading ? "Uploading..." : "Submit Documents"}
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Approved */}
//       {company?.documentsStatus === "approved" && (
//         <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
//           <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-5">Your Account</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
//             {[
//               ["Brand Name",    company.brandName],
//               ["Account Type",  company.accountType],
//               ["Business Type", company.businessType],
//               ["Email",         company.email],
//               ["Phone",         company.phone],
//               ["Trade License", company.tradeLicenseNumber],
//             ].map(([label, val]) => (
//               <div key={label}>
//                 <p className="text-[11px] text-brand-muted m-0 mb-[3px]">{label}</p>
//                 <p className="text-[13px] font-semibold text-brand-dark m-0">{val}</p>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => navigate("/branches")}
//             className="px-6 py-3 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer shadow-[0_4px_12px_rgba(241,90,33,0.3)] transition-all"
//           >
//             Manage Branches →
//           </button>
//         </div>
//       )}

//       {/* Submitted */}
//       {company?.documentsStatus === "submitted" && (
//         <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
//           <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-3">Documents Under Review</h2>
//           <p className="text-[14px] text-brand-gray m-0 mb-4">
//             Your documents have been submitted and are currently under review by our admin team. You will receive an email once approved.
//           </p>
//           <div className="flex gap-3 flex-wrap">
//             {company.tradeLicenseImage && (
//               <a href={company.tradeLicenseImage} target="_blank" rel="noreferrer"
//                 className="px-4 py-2 bg-blue-50 text-blue-700 rounded-[8px] text-[12px] font-semibold no-underline">
//                 View Trade License →
//               </a>
//             )}
//             {company.qidImage && (
//               <a href={company.qidImage} target="_blank" rel="noreferrer"
//                 className="px-4 py-2 bg-blue-50 text-blue-700 rounded-[8px] text-[12px] font-semibold no-underline">
//                 View QID →
//               </a>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";

/* ─── File upload rules (backend multer se match hone chahiye) ─────── */
const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const DOC_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const DOC_ACCEPT = ".jpg,.jpeg,.png,.webp,.pdf";
const DOC_HINT = `JPG, PNG, WEBP or PDF · max ${MAX_MB} MB`;

const LOGO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const LOGO_ACCEPT = ".jpg,.jpeg,.png,.webp";
const LOGO_HINT = `JPG, PNG or WEBP · max ${MAX_MB} MB`;

const prettySize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export default function Home() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    companyLogo: null,
    tradeLicenseImage: null,
    qidImage: null,
    crImage: null,
  });
  const [expiry, setExpiry] = useState({
    tradeLicenseExpiry: "",
    qidExpiry: "",
    crExpiry: "",
  });
  const [crNumber, setCrNumber] = useState("");

  useEffect(() => {
    API.get("/company/me")
      .then((res) => {
        if (res.data.success) {
          setCompany(res.data.data);
          setCrNumber(res.data.data.crNumber || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /* ─── File picker with type + size validation ─────────────────── */
  const pickFile = (e, key, allowedTypes) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `${file.name} is not a supported format. Use ${
          allowedTypes === LOGO_TYPES ? "JPG, PNG or WEBP" : "JPG, PNG, WEBP or PDF"
        }.`
      );
      e.target.value = "";
      return;
    }

    if (file.size > MAX_BYTES) {
      toast.error(
        `${file.name} is ${prettySize(file.size)}. Maximum size is ${MAX_MB} MB.`
      );
      e.target.value = "";
      return;
    }

    setFiles((f) => ({ ...f, [key]: file }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Har document ya to ab upload ho raha ho, ya pehle se saved ho
    const missing = [];
    if (!files.tradeLicenseImage && !company?.tradeLicenseImage) missing.push("Trade License");
    if (!files.qidImage && !company?.qidImage) missing.push("QID");
    if (!files.crImage && !company?.crImage) missing.push("Commercial Registration");
    if (missing.length) {
      toast.error(`Add ${missing.join(", ")} before submitting.`);
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      if (files.companyLogo)         fd.append("companyLogo",        files.companyLogo);
      if (files.tradeLicenseImage)   fd.append("tradeLicenseImage",  files.tradeLicenseImage);
      if (files.qidImage)            fd.append("qidImage",           files.qidImage);
      if (files.crImage)             fd.append("crImage",            files.crImage);
      if (expiry.tradeLicenseExpiry) fd.append("tradeLicenseExpiry", expiry.tradeLicenseExpiry);
      if (expiry.qidExpiry)          fd.append("qidExpiry",          expiry.qidExpiry);
      if (expiry.crExpiry)           fd.append("crExpiry",           expiry.crExpiry);
      if (crNumber)                  fd.append("crNumber",           crNumber);

      const res = await API.patch("/company/me/update-documents", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setCompany(res.data.data);
        toast.success("Documents submitted successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  const statusConfig = {
    pending:   { text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200", dot: "bg-amber-500",  msg: "Please upload your documents to get started" },
    submitted: { text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  dot: "bg-blue-500",   msg: "Documents submitted. Waiting for admin approval." },
    approved:  { text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", dot: "bg-green-500",  msg: "Documents approved! You can now add branches." },
    rejected:  { text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",   dot: "bg-red-500",    msg: "Documents rejected. Please re-upload." },
  };

  const sc = statusConfig[company?.documentsStatus] || statusConfig.pending;

  const inputCls =
    "w-full px-4 py-[10px] border border-brand-border rounded-[8px] text-[14px] outline-none bg-white focus:border-brand-primary transition-all";
  const fileCls =
    "w-full text-[13px] px-3 py-2 border border-dashed border-brand-border rounded-[8px]";
  const labelCls = "block text-[13px] font-semibold text-brand-dark mb-2";
  const hintCls = "text-[11px] text-brand-muted mt-1 m-0";

  return (
    <div className="max-w-[1500px] mx-auto px-2 md:px-[10px]">
      <Toaster />

      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        {company?.companyLogo ? (
          <img src={company.companyLogo} alt="" className="w-14 h-14 rounded-[12px] object-contain border shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-[12px] bg-brand-primary text-white flex items-center justify-center text-[22px] font-bold shrink-0 shadow-[0_3px_8px_rgba(241,90,33,0.25)]">
            {company?.brandName?.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-[20px] md:text-[22px] font-extrabold text-brand-dark m-0 mb-1">{company?.brandName}</h1>
          <span className={`px-3 py-[3px] rounded-[20px] text-[12px] font-semibold border
            ${company?.accountType === "Supplier" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
            {company?.accountType}
          </span>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`flex gap-3 items-start p-4 rounded-[14px] border ${sc.bg} ${sc.border} mb-5`}>
        <div className={`w-[10px] h-[10px] rounded-full mt-1 shrink-0 ${sc.dot}`} />
        <div>
          <p className={`text-[13px] font-bold m-0 mb-1 ${sc.text}`}>
            Documents: {company?.documentsStatus?.toUpperCase()}
          </p>
          <p className="text-[13px] text-brand-gray m-0">{sc.msg}</p>
          {company?.documentsStatus === "rejected" && company?.documentsRejectionReason && (
            <p className="text-red-600 text-[13px] mt-1 m-0">Reason: {company.documentsRejectionReason}</p>
          )}
        </div>
      </div>

      {/* Upload Documents */}
      {["pending", "rejected"].includes(company?.documentsStatus) && (
        <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
          <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-1">Upload Documents</h2>
          <p className="text-[12px] text-brand-gray m-0 mb-5">
            Accepted formats: <strong>JPG, PNG, WEBP, PDF</strong> · Maximum size: <strong>{MAX_MB} MB</strong> per file
          </p>

          <form onSubmit={handleUpload}>
            {/* Company Logo */}
            <div className="mb-4">
              <label className={labelCls}>Company Logo</label>
              <input
                type="file"
                accept={LOGO_ACCEPT}
                onChange={(e) => pickFile(e, "companyLogo", LOGO_TYPES)}
                className={fileCls}
              />
              <p className={hintCls}>{LOGO_HINT} (no PDF)</p>
              {files.companyLogo && (
                <p className="text-[12px] text-green-600 mt-1 m-0">
                  ✅ {files.companyLogo.name} · {prettySize(files.companyLogo.size)}
                </p>
              )}
            </div>

            {/* Trade License */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>
                  Trade License Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept={DOC_ACCEPT}
                  onChange={(e) => pickFile(e, "tradeLicenseImage", DOC_TYPES)}
                  className={fileCls}
                />
                <p className={hintCls}>{DOC_HINT}</p>
                {files.tradeLicenseImage && (
                  <p className="text-[12px] text-green-600 mt-1 m-0">
                    ✅ {files.tradeLicenseImage.name} · {prettySize(files.tradeLicenseImage.size)}
                  </p>
                )}
                {company?.tradeLicenseImage && !files.tradeLicenseImage && (
                  <p className="text-[12px] text-brand-muted mt-1 m-0">
                    Already uploaded — <a href={company.tradeLicenseImage} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>
                  Trade License Expiry <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expiry.tradeLicenseExpiry}
                  onChange={(e) => setExpiry((ex) => ({ ...ex, tradeLicenseExpiry: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* QID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>
                  QID Image (Contact Person) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept={DOC_ACCEPT}
                  onChange={(e) => pickFile(e, "qidImage", DOC_TYPES)}
                  className={fileCls}
                />
                <p className={hintCls}>{DOC_HINT}</p>
                {files.qidImage && (
                  <p className="text-[12px] text-green-600 mt-1 m-0">
                    ✅ {files.qidImage.name} · {prettySize(files.qidImage.size)}
                  </p>
                )}
                {company?.qidImage && !files.qidImage && (
                  <p className="text-[12px] text-brand-muted mt-1 m-0">
                    Already uploaded — <a href={company.qidImage} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>
                  QID Expiry <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expiry.qidExpiry}
                  onChange={(e) => setExpiry((ex) => ({ ...ex, qidExpiry: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* CR — Commercial Registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>
                  Commercial Registration (CR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept={DOC_ACCEPT}
                  onChange={(e) => pickFile(e, "crImage", DOC_TYPES)}
                  className={fileCls}
                />
                <p className={hintCls}>{DOC_HINT}</p>
                {files.crImage && (
                  <p className="text-[12px] text-green-600 mt-1 m-0">
                    ✅ {files.crImage.name} · {prettySize(files.crImage.size)}
                  </p>
                )}
                {company?.crImage && !files.crImage && (
                  <p className="text-[12px] text-brand-muted mt-1 m-0">
                    Already uploaded — <a href={company.crImage} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls}>
                  CR Expiry <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expiry.crExpiry}
                  onChange={(e) => setExpiry((ex) => ({ ...ex, crExpiry: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* CR Number */}
            <div className="mb-6 md:w-1/2 md:pr-2">
              <label className={labelCls}>CR Number</label>
              <input
                type="text"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                placeholder="e.g. 123456"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer disabled:opacity-70 shadow-[0_4px_12px_rgba(241,90,33,0.3)] transition-all"
            >
              {uploading ? "Uploading..." : "Submit Documents"}
            </button>
          </form>
        </div>
      )}

      {/* Approved */}
      {company?.documentsStatus === "approved" && (
        <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
          <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-5">Your Account</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
            {[
              ["Brand Name",    company.brandName],
              ["Account Type",  company.accountType],
              ["Business Type", company.businessType],
              ["Email",         company.email],
              ["Phone",         company.phone],
              ["Trade License", company.tradeLicenseNumber],
              ["CR Number",     company.crNumber || "—"],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[11px] text-brand-muted m-0 mb-[3px]">{label}</p>
                <p className="text-[13px] font-semibold text-brand-dark m-0">{val}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/branches")}
            className="px-6 py-3 bg-brand-primary text-white rounded-[8px] text-[14px] font-bold border-none cursor-pointer shadow-[0_4px_12px_rgba(241,90,33,0.3)] transition-all"
          >
            Manage Branches →
          </button>
        </div>
      )}

      {/* Submitted */}
      {company?.documentsStatus === "submitted" && (
        <div className="bg-gradient-to-br from-[#FFF8EF] via-[#FFF8EF] to-white border border-brand-border rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(241,90,33,0.06)] mb-5">
          <h2 className="text-[15px] font-bold text-brand-dark m-0 mb-3">Documents Under Review</h2>
          <p className="text-[14px] text-brand-gray m-0 mb-4">
            Your documents have been submitted and are currently under review by our admin team. You will receive an email once approved.
          </p>
          <div className="flex gap-3 flex-wrap">
            {company.tradeLicenseImage && (
              <a href={company.tradeLicenseImage} target="_blank" rel="noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-[8px] text-[12px] font-semibold no-underline">
                View Trade License →
              </a>
            )}
            {company.qidImage && (
              <a href={company.qidImage} target="_blank" rel="noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-[8px] text-[12px] font-semibold no-underline">
                View QID →
              </a>
            )}
            {company.crImage && (
              <a href={company.crImage} target="_blank" rel="noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-[8px] text-[12px] font-semibold no-underline">
                View CR →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
