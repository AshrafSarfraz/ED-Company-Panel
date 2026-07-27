import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome, FaCodeBranch, FaUser, FaUndoAlt,FaKey 
} from "react-icons/fa";
import logo from "../assets/Images/logo 6.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const me       = JSON.parse(localStorage.getItem("companyUser") || "{}");

  const logout = () => {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyUser");
    navigate("/");
  };

  const navItems = [
    { label: "Home",     path: "/home",     icon: <FaHome />       },
    { label: "Branches", path: "/branches", icon: <FaCodeBranch /> },
    { label: "Update Password", path: "/update-password", icon: <FaKey /> },
    { label: "Profile",  path: "/profile",  icon: <FaUser />       },
    
  ];

  return (
    <div className="fixed left-0 top-0 h-screen flex flex-col z-[100] bg-brand-warm shadow-[2px_0_12px_rgba(0,0,0,0.08)] w-[60px] md:w-[240px] transition-all duration-300">

      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start gap-3 px-3 md:px-5 py-5 border-b border-brand-border mb-2">
        <img
          src={logo}
          className="w-10 h-10 rounded-lg shrink-0"
          alt="logo"
        />
        <div className="hidden md:block min-w-0">
          <div className="text-[13px] font-extrabold text-brand-dark tracking-wide whitespace-nowrap">EL Distributor</div>
          <div className="text-[11px] text-brand-muted whitespace-nowrap">Company Portal</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-1 md:px-2 py-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              title={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center h-10 rounded-lg mb-1 cursor-pointer transition-all duration-200
                          justify-center md:justify-start md:gap-[14px] md:px-4
                          ${active ? "bg-brand-primary" : "hover:bg-brand-lighter"}`}
            >
              <span className={`text-[15px] shrink-0 ${active ? "text-brand-white" : "text-brand-gray"}`}>
                {item.icon}
              </span>
              <span className={`hidden md:block text-[12px] font-medium whitespace-nowrap ${active ? "text-brand-white" : "text-brand-gray"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 md:p-3 border-t border-brand-border bg-brand-faint">

        <div
          className="flex items-center justify-center md:justify-start gap-3 cursor-pointer p-2 rounded-lg mb-2 md:mb-3"
          onClick={() => navigate("/profile")}
        >
          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-brand-white text-[15px] font-bold bg-brand-gradient shadow-[0_2px_8px_rgba(241,90,33,0.25)]">
            {me.brandName?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block flex-1 min-w-0">
            <div className="text-[12px] font-bold text-brand-dark truncate">{me.brandName}</div>
            <div className="text-[11px] text-brand-muted capitalize truncate">{me.accountType}</div>
          </div>
        </div>

        {/* Desktop logout */}
        <button
          onClick={logout}
          className="w-full py-2 rounded-lg text-brand-white text-[12px] font-bold cursor-pointer border-none bg-brand-gradient shadow-[0_2px_8px_rgba(241,90,33,0.2)] hidden md:flex items-center justify-center"
        >
          Logout
        </button>

        {/* Mobile logout */}
        <button
          onClick={logout}
          title="Logout"
          className="w-full flex items-center justify-center py-2 rounded-lg md:hidden border-none cursor-pointer bg-brand-primary"
        >
          <FaUndoAlt color="#fff" size={14} />
        </button>

      </div>
    </div>
  );
}