import { useState } from "react";
import { FaCalendarAlt, FaClock, FaFilter, FaRedo, FaSearch, FaSortAmountDown, FaUser } from "react-icons/fa";
import { buttonClass, surfaceClass } from "../theme/classes";

const INITIAL_FILTERS = {
    search: "",
    category: "all",
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
    sortBy: "newest",
    viewType: "all"
};

const fieldClass = "h-[48px] w-full rounded-[14px] border border-[#e1e5ee] bg-white px-[14px] text-sm text-[#111827] outline-none transition focus:border-brand focus:ring-[3px] focus:ring-brand/[.08]";

function FilterField({ label, icon: Icon, children }) {
    return (
        <div className="min-w-0">
            <label className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[.06em] text-[#4b5563]"><Icon className="text-brand" />{label}</label>
            {children}
        </div>
    );
}

function SearchBar({ onSearch, onReset }) {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const change = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
    const reset = () => {
        setFilters(INITIAL_FILTERS);
        onReset();
    };

    return (
        <section className={`${surfaceClass} p-7 max-sm:p-5`}>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.1em] text-brand"><FaFilter /> Advanced Filters</span>
            <h2 className="mt-4 text-[26px] font-bold text-[#111827]">Smart Search</h2>
            <p className="mt-1.5 text-sm leading-6 text-[#6b7280]">Search walk-ins using name, phone, email, category, walk-in date, time range, or walk-in frequency.</p>

            <div className="mt-6 grid grid-cols-4 gap-[18px] max-xl:grid-cols-2 max-md:grid-cols-1">
                <FilterField label="Search User" icon={FaUser}>
                    <input className={fieldClass} name="search" placeholder="Name / Phone / Email" value={filters.search} onChange={change} />
                </FilterField>
                <FilterField label="Category" icon={FaFilter}>
                    <select className={fieldClass} name="category" value={filters.category} onChange={change}>
                        <option value="all">All Categories</option>
                        <option value="client">Client</option>
                        <option value="vendor">Vendor</option>
                        <option value="official">Official</option>
                        <option value="visitor">Visitor</option>
                    </select>
                </FilterField>
                <FilterField label="View Type" icon={FaUser}>
                    <select className={fieldClass} name="viewType" value={filters.viewType} onChange={change}>
                        <option value="all">All Users</option>
                        <option value="recent">Recent Entries</option>
                        <option value="frequent">Frequent Walk-Ins</option>
                    </select>
                </FilterField>
                <FilterField label="Sort By" icon={FaSortAmountDown}>
                    <select className={fieldClass} name="sortBy" value={filters.sortBy} onChange={change}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="mostVisits">Most Walk-Ins</option>
                        <option value="leastVisits">Least Walk-Ins</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </FilterField>
                <FilterField label="From Date" icon={FaCalendarAlt}><input className={fieldClass} type="date" name="fromDate" value={filters.fromDate} onChange={change} /></FilterField>
                <FilterField label="To Date" icon={FaCalendarAlt}><input className={fieldClass} type="date" name="toDate" value={filters.toDate} onChange={change} /></FilterField>
                <FilterField label="From Time" icon={FaClock}><input className={fieldClass} type="time" name="fromTime" value={filters.fromTime} onChange={change} /></FilterField>
                <FilterField label="To Time" icon={FaClock}><input className={fieldClass} type="time" name="toTime" value={filters.toTime} onChange={change} /></FilterField>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button type="button" onClick={() => onSearch(filters)} className={buttonClass.primary}><FaSearch /> Apply Filters</button>
                <button type="button" onClick={reset} className={buttonClass.outline}><FaRedo /> Reset Filters</button>
            </div>
        </section>
    );
}

export default SearchBar;
