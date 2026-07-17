import { useNavigate } from "react-router-dom";
import { FaHandshake, FaTruck, FaIdBadge, FaUserCheck } from "react-icons/fa";

const ICONS = {
    Client: FaHandshake,
    Vendor: FaTruck,
    Official: FaIdBadge,
    Visitor: FaUserCheck
};

function DashboardCard({ title, subtitle }) {
    const navigate = useNavigate();
    const Icon = ICONS[title];

    return (
        <article className="group flex min-h-[275px] flex-col justify-between rounded-[24px] border border-[#ececec] bg-white p-8 shadow-[0_14px_35px_rgba(0,0,0,.07)] transition hover:border-brand/25">
            <div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[18px] bg-brand-soft text-[28px] text-brand transition group-hover:scale-[1.04]">
                    <Icon />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-brand">{title}</h2>
                <p className="mb-7 text-[15px] leading-[1.5] text-[#7a8aa0]">{subtitle}</p>
            </div>

            <button
                type="button"
                onClick={() => navigate(`/entry/${title.toLowerCase()}`)}
                className="inline-flex w-max items-center gap-2 text-[15px] font-bold text-brand-muted transition hover:translate-x-1.5 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
                Start Check-in →
            </button>
        </article>
    );
}

export default DashboardCard;
