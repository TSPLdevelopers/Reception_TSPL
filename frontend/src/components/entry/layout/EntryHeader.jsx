import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

function EntryHeader() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-[100] flex h-[72px] items-center justify-between border-b border-[#ececec] bg-white px-[34px] max-[768px]:px-[18px]">
            <button type="button" onClick={() => navigate("/")} className="rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20" aria-label="Go to home page">
                <img src={logo} alt="TechTorch Solutions" className="h-[44px] w-auto object-contain max-[768px]:h-[38px]" />
            </button>
            <span className="text-[14px] font-semibold tracking-[.4px] text-[#374151] max-[768px]:hidden">TECHTORCH FRONT OFFICE</span>
        </header>
    );
}

export default EntryHeader;
