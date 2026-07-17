import { FaBuilding, FaCheckCircle, FaClipboardList, FaHeadset, FaLock, FaPhoneAlt, FaUser } from "react-icons/fa";

function SummaryRow({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3.5 border-b border-[#eef0f4] py-3.5 last:border-b-0">
            <Icon className="mt-1 shrink-0 text-lg text-brand" />
            <div className="min-w-0">
                <span className="mb-1 block text-xs font-medium text-[#6b7280]">{label}</span>
                <strong className="block break-words text-sm font-bold text-[#111827]">{value}</strong>
            </div>
        </div>
    );
}

function InfoCard({ icon: Icon, title, children, variant = "default" }) {
    const style = variant === "primary"
        ? "border-transparent bg-gradient-to-br from-brand to-brand-dark text-white"
        : variant === "support"
            ? "border-brand/15 bg-[#fff5fa] text-[#111827]"
            : "border-[#e7eaf0] bg-white text-[#111827]";

    return (
        <div className={`rounded-[22px] border p-6 shadow-[0_14px_35px_rgba(15,23,42,.06)] ${style}`}>
            <Icon className={`mb-3.5 text-2xl ${variant === "primary" ? "text-white" : "text-brand"}`} />
            <h3 className="mb-2.5 text-lg font-bold">{title}</h3>
            <div className={`text-sm leading-[1.55] ${variant === "primary" ? "text-white/90" : "text-[#6b7a90]"}`}>{children}</div>
        </div>
    );
}

function EntryInfoPanel({ category, step, phone, formData, visitData, flowType }) {
    const statuses = {
        phone: "Waiting for mobile number",
        register: "Registration in progress",
        otp: "OTP verification pending",
        visit: "Visit details required",
        success: "Check-in completed"
    };
    const visitorName = formData.firstName
        ? `${formData.firstName} ${formData.lastName}`.trim()
        : flowType === "existing" ? "Existing Visitor" : "Not entered";

    return (
        <aside className="flex flex-col gap-[18px] max-[900px]:grid max-[900px]:grid-cols-2 max-[680px]:grid-cols-1">
            <InfoCard icon={FaLock} title="Secure Check-in" variant="primary">
                Your credentials and visit records are protected using secure backend validation.
            </InfoCard>

            <div className="rounded-[22px] border border-[#e7eaf0] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,.06)]">
                <h3 className="mb-[18px] text-lg font-bold text-[#111827]">Visitor Summary</h3>
                <SummaryRow icon={FaBuilding} label="Category" value={category.toUpperCase()} />
                <SummaryRow icon={FaPhoneAlt} label="Phone" value={phone || "Not entered"} />
                <SummaryRow icon={FaUser} label="Visitor" value={visitorName} />
                <SummaryRow icon={FaClipboardList} label="Reason" value={visitData.reason || "Pending"} />
                <SummaryRow icon={FaUser} label="Whom To Meet" value={visitData.whomToMeet || "Pending"} />
            </div>

            <InfoCard icon={FaCheckCircle} title="Current Status">
                <span className="font-bold text-brand">{statuses[step] || "Active session"}</span>
            </InfoCard>
            <InfoCard icon={FaHeadset} title="Reception Help" variant="support">
                Need assistance? Please contact the reception desk.
            </InfoCard>
        </aside>
    );
}

export default EntryInfoPanel;
