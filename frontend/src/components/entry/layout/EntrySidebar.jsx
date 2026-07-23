import { FaCheckCircle, FaClipboardList, FaMobileAlt, FaShieldAlt, FaUserEdit } from "react-icons/fa";

function EntrySidebar({ currentStep, flowType }) {
    const steps = [
        { id: 1, title: "Phone", icon: FaMobileAlt },
        { id: 2, title: flowType === "existing" ? "Profile Found" : "Registration", icon: FaUserEdit },
        { id: 3, title: "Verification", icon: FaShieldAlt },
        { id: 4, title: "Walk-In Details", icon: FaClipboardList },
        { id: 5, title: "Completed", icon: FaCheckCircle }
    ];

    return (
        <aside className="flex min-h-[calc(100vh-72px)] flex-col border-r border-[#dde5f4] bg-[#fde8f3] px-6 pb-8 pt-[42px] max-[1180px]:min-h-0 max-[1180px]:border-b max-[1180px]:border-r-0 max-[1180px]:px-[18px] max-[1180px]:py-6">
            <div>
                <h2 className="mb-1 text-[30px] font-extrabold text-brand-dark max-[680px]:text-2xl">Registration</h2>
                <p className="text-sm text-[#6b7a90]">Complete your secure check-in.</p>
            </div>

            <div className="mt-11 flex flex-col gap-3.5 max-[1180px]:mt-6 max-[1180px]:grid max-[1180px]:grid-cols-5 max-[1180px]:gap-2.5 max-[680px]:grid-cols-1">
                {steps.map(({ id, title, icon: Icon }) => {
                    const active = id === currentStep;
                    const done = id < currentStep;
                    return (
                        <div
                            key={id}
                            className={`flex items-center gap-3.5 rounded-[12px] px-4 py-3.5 text-[15px] font-semibold transition max-[1180px]:flex-col max-[1180px]:gap-2 max-[1180px]:text-center max-[1180px]:text-xs max-[680px]:flex-row max-[680px]:text-left ${active ? "bg-brand text-white shadow-[0_10px_25px_rgba(115,0,66,.20)]" : done ? "bg-brand/[.08] text-brand" : "text-[#4d3b44]"}`}
                        >
                            <Icon className={`w-6 text-xl ${active || done ? "text-current" : "text-[#5f4a55]"}`} />
                            <span>{title}</span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-auto rounded-[16px] bg-white p-[18px] shadow-[0_10px_25px_rgba(0,0,0,.05)] max-[1180px]:hidden">
                <span className="mb-1.5 block text-[11px] tracking-[.8px] text-[#7a8aa0]">SESSION</span>
                <strong className="text-sm font-semibold text-[#0f5132]">● Active</strong>
            </div>
        </aside>
    );
}

export default EntrySidebar;
