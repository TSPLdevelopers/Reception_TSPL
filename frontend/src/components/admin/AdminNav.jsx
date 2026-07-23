import { FaSyncAlt } from "react-icons/fa";

function AdminNav({ onRefresh }) {
    const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const base = "shrink-0 rounded-[14px] px-[22px] py-[11px] text-sm font-bold text-[#4b5563] transition hover:bg-brand hover:text-white";

    return (
        <nav className="sticky top-[76px] z-40 flex min-h-[62px] items-center gap-[14px] overflow-x-auto border-b border-[#dde5f4] bg-footer-soft px-[38px] max-sm:px-[18px]">
            <button type="button" onClick={() => go("dashboard-top")} className={`${base} bg-brand text-white`}>Dashboard</button>
            <button type="button" onClick={() => go("visitor-records")} className={base}>Walk-Ins</button>
            <button type="button" onClick={() => go("analytics")} className={base}>Analytics</button>
            <button type="button" onClick={() => go("search-filters")} className={base}>Search &amp; Filters</button>
            <button type="button" onClick={onRefresh} className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-[12px] border border-[#ddd] bg-white px-[18px] py-[10px] text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"><FaSyncAlt /> Refresh</button>
        </nav>
    );
}

export default AdminNav;
