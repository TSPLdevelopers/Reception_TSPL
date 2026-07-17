import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-[#ececec] bg-white px-[34px] max-sm:px-[18px]">
            <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/25"
                aria-label="Go to home"
            >
                <img src={logo} alt="TechTorch Solutions" className="h-[44px] w-auto object-contain max-sm:h-[38px]" />
            </button>

            <button
                type="button"
                onClick={() => navigate("/admin-login")}
                className="rounded-[18px] bg-brand px-[30px] py-[13px] text-[15px] font-bold text-white shadow-[0_10px_25px_rgba(115,0,66,.22)] transition hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(115,0,66,.32)] focus:outline-none focus:ring-2 focus:ring-brand/25 max-sm:px-5 max-sm:py-2.5"
            >
                Admin Login
            </button>
        </nav>
    );
}

export default Navbar;
