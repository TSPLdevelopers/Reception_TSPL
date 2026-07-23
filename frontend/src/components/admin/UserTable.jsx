import { FaDownload, FaHistory } from "react-icons/fa";
import { buttonClass, surfaceClass } from "../../theme/classes";

const badgeClass = {
    client: "bg-brand-soft text-brand",
    vendor: "bg-[#fff2dc] text-[#8a4b00]",
    official: "bg-[#e9efff] text-[#284c9f]",
    visitor: "bg-[#e7f8ef] text-[#146c43]"
};

function UserTable({ users, getLastVisit, onExport, onHistory }) {
    return (
        <section id="visitor-records" className={`${surfaceClass} mt-6 scroll-mt-[150px] overflow-hidden`}>
            <div className="flex items-center justify-between gap-4 border-b border-[#eef0f4] p-7 max-md:flex-col max-md:items-start">
                <div>
                    <h2 className="text-2xl font-bold text-[#111827]">Walk-In Records</h2>
                    <p className="mt-1 text-sm text-[#6b7280]">{users.length} records found</p>
                </div>
                <button type="button" onClick={onExport} className={buttonClass.primary}><FaDownload /> Export Visible Records</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                    <thead className="bg-gradient-to-r from-brand via-[#a40061] to-brand-dark text-white">
                        <tr>
                            {["Name", "Phone", "Email", "Category", "Walk-Ins", "Last Walk-In", "History"].map((heading) => (
                                <th key={heading} className="px-5 py-4 text-xs font-bold uppercase tracking-[.07em]">{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.length ? users.map((user, index) => (
                            <tr key={user._id} className={`border-b border-[#eef0f4] transition hover:bg-[#fff8fc] ${index % 2 ? "bg-[#fbfcff]" : "bg-white"}`}>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft font-bold text-brand">{user.firstName?.charAt(0)}</span>
                                        <strong className="font-bold text-[#111827]">{user.firstName} {user.lastName}</strong>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-5 py-4">{user.phone}</td>
                                <td className="px-5 py-4">{user.email || "-"}</td>
                                <td className="px-5 py-4"><span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${badgeClass[user.category] || "bg-slate-100 text-slate-700"}`}>{user.category}</span></td>
                                <td className="px-5 py-4"><span className="inline-flex min-w-8 justify-center rounded-full bg-brand px-2 py-1 text-xs font-bold text-white">{user.visitCount}</span></td>
                                <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">{getLastVisit(user)}</td>
                                <td className="px-5 py-4"><button type="button" onClick={() => onHistory(user.phone)} className="inline-flex items-center gap-2 rounded-[10px] border border-brand/20 px-3 py-2 font-bold text-brand transition hover:bg-brand-soft"><FaHistory /> View</button></td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="px-5 py-16 text-center"><h3 className="text-lg font-bold">No visitor records found</h3><p className="mt-2 text-sm text-[#6b7280]">Try changing the filters or reset them.</p></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default UserTable;
