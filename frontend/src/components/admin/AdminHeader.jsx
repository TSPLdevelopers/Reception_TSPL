import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { buttonClass } from "../../theme/classes";

function AdminHeader({ onHome, onLogout }) {
    return (
        <header className="sticky top-0 z-50 flex h-[76px] items-center justify-between border-b border-[#e7eaf0] bg-white px-[38px] max-sm:px-[18px]">
            <button type="button" onClick={onHome} className="rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20">
                <img src={logo} alt="TechTorch Solutions" className="h-12 w-auto object-contain max-sm:h-10" />
            </button>
            <div className="flex items-center gap-3">
                <button type="button" onClick={onHome} className={buttonClass.primary}><FaArrowLeft /><span className="max-sm:hidden">Back To Home</span></button>
                <button type="button" onClick={onLogout} className={buttonClass.primary}><FaSignOutAlt /><span className="max-sm:hidden">Logout</span></button>
            </div>
        </header>
    );
}

export default AdminHeader;
