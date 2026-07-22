import { FaHandshake, FaIdBadge, FaTruck, FaUserCheck, FaUsers } from "react-icons/fa";

const definitions = [
    ["Total Walk-Ins", "totalUsers", FaUsers],
    ["Clients", "totalClients", FaHandshake],
    ["Vendors", "totalVendors", FaTruck],
    ["Officials", "totalOfficials", FaIdBadge],
    ["Visitors", "totalVisitors", FaUserCheck]
];

function StatsGrid({ stats }) {
    return (
        <section className="grid grid-cols-5 gap-[18px] max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {definitions.map(([label, key, Icon]) => (
                <article key={key} className="rounded-[22px] border border-[#e7eaf0] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,.06)]">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[14px] bg-brand-soft text-brand"><Icon /></div>
                    <span className="block text-[12px] font-bold uppercase tracking-[.09em] text-[#6b7280]">{label}</span>
                    <strong className="mt-2 block text-[30px] font-extrabold text-[#111827]">{stats[key] || 0}</strong>
                </article>
            ))}
        </section>
    );
}

export default StatsGrid;
