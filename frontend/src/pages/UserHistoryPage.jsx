import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaBuilding,
    FaCalendarAlt,
    FaClock,
    FaDownload,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaUser
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";
import logo from "../assets/logo.png";
import { formatAddress } from "../utils/address";
import { downloadCsv } from "../utils/csv";
import AppFooter from "../components/layout/AppFooter";
import { buttonClass, surfaceClass } from "../theme/classes";

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});

const formatTime = (date) => new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
});

function UserHistoryPage() {
    const { phone } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        api.get(`/history/${encodeURIComponent(phone)}`)
            .then((response) => {
                if (active) setUser(response.data);
            })
            .catch(() => {
                if (active) setError("Unable to load visitor history.");
            });
        return () => {
            active = false;
        };
    }, [phone]);

    const exportUser = () => {
        if (!user?.visits?.length) {
            toast.error("No visit history available to export");
            return;
        }

        downloadCsv({
            filename: `${user.firstName}_${user.phone}_visit_history.csv`,
            headers: ["Name", "Phone", "Email", "Category", "Type", "Address", "Visit Date", "Visit Time", "Reason", "Whom To Meet"],
            rows: user.visits.map((visit) => [
                `${user.firstName} ${user.lastName || ""}`.trim(),
                user.phone,
                user.email || "-",
                user.category,
                user.type,
                formatAddress(user.address),
                formatDate(visit.arrivalTime),
                formatTime(visit.arrivalTime),
                visit.reason,
                visit.whomToMeet || "-"
            ])
        });
    };

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page-soft p-6">
                <div className={`${surfaceClass} p-8 text-center`}>
                    <h1 className="text-xl font-bold text-[#9f1239]">{error}</h1>
                    <button type="button" className={`${buttonClass.primary} mt-5`} onClick={() => navigate("/admin")}>Back To Dashboard</button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page-soft text-lg font-bold text-brand">
                Loading history...
            </div>
        );
    }

    const fullName = `${user.firstName} ${user.lastName || ""}`.trim();

    return (
        <div className="min-h-screen bg-page-soft">
            <header className="sticky top-0 z-50 flex h-[76px] items-center justify-between border-b border-[#e7eaf0] bg-white px-[38px] max-sm:px-[18px]">
                <button type="button" onClick={() => navigate("/")} className="rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20">
                    <img src={logo} alt="TechTorch Solutions" className="h-12 w-auto object-contain max-sm:h-10" />
                </button>
                <button type="button" onClick={() => navigate("/admin")} className={buttonClass.primary}><FaArrowLeft /> Back To Dashboard</button>
            </header>

            <main className="px-[38px] py-[34px] max-md:px-5 max-sm:px-4">
                <div className="flex items-start justify-between gap-6 max-md:flex-col">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-[.13em] text-brand">Walk-in History</span>
                        <h1 className="mt-3 text-[34px] font-extrabold text-[#111827]">{fullName}</h1>
                        <p className="mt-1 text-sm text-[#6b7280]">Complete walk-in timeline and profile details.</p>
                    </div>
                    <button type="button" onClick={exportUser} className={buttonClass.primary}><FaDownload /> Export Records</button>
                </div>

                <div className="mt-8 grid grid-cols-[340px_1fr] gap-7 max-lg:grid-cols-1">
                    <aside className={`${surfaceClass} h-max p-7 text-center`}>
                        <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-[24px] bg-brand-soft text-4xl text-brand"><FaUser /></div>
                        <h2 className="mt-[18px] text-2xl font-bold text-[#111827]">{fullName}</h2>
                        <span className="mt-2 inline-block rounded-full bg-[#fde8f3] px-4 py-1.5 text-xs font-bold uppercase text-brand">{user.category}</span>

                        <div className="mt-6 flex flex-col gap-3.5 text-left">
                            {[
                                [FaPhoneAlt, user.phone],
                                [FaEnvelope, user.email || "-"],
                                [FaBuilding, user.type || "-"],
                                [FaMapMarkerAlt, formatAddress(user.address)]
                            ].map(([Icon, value], index) => (
                                <div key={index} className="flex items-start gap-3 rounded-[14px] border border-[#eef0f4] bg-[#fbfcff] p-3.5">
                                    <Icon className="mt-0.5 shrink-0 text-brand" />
                                    <span className="break-words text-sm font-semibold text-[#374151]">{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-[18px] bg-brand p-5 text-white">
                            <span className="font-bold">Total Walk-Ins</span>
                            <strong className="text-[30px] font-extrabold">{user.visitCount || 0}</strong>
                        </div>
                    </aside>

                    <section className={`${surfaceClass} p-7 max-sm:p-5`}>
                        <h2 className="text-2xl font-bold text-[#111827]">Walk-In Timeline</h2>
                        <p className="mt-1 text-sm text-[#6b7280]">{user.visits?.length || 0} walk-ins recorded</p>

                        {!user.visits?.length ? (
                            <div className="py-16 text-center">
                                <h3 className="text-lg font-bold">No visits found</h3>
                                <p className="mt-2 text-sm text-[#6b7280]">This visitor has no recorded visit history.</p>
                            </div>
                        ) : (
                            <div className="mt-6 flex flex-col gap-[18px]">
                                {[...user.visits].reverse().map((visit, index) => (
                                    <article key={`${visit.arrivalTime}-${index}`} className="grid grid-cols-[24px_1fr] gap-3.5">
                                        <div className="mt-[18px] h-[18px] w-[18px] rounded-full bg-brand shadow-[0_0_0_6px_#f8eaf3]" />
                                        <div className="rounded-[18px] border border-[#eef0f4] bg-[#fbfcff] p-[18px]">
                                            <div className="mb-3 flex flex-wrap gap-[18px] text-[13px] font-bold text-brand">
                                                <span className="inline-flex items-center gap-2"><FaCalendarAlt /> {formatDate(visit.arrivalTime)}</span>
                                                <span className="inline-flex items-center gap-2"><FaClock /> {formatTime(visit.arrivalTime)}</span>
                                            </div>
                                            <p className="my-2 text-sm text-[#374151]"><strong>Reason:</strong> {visit.reason}</p>
                                            <p className="my-2 text-sm text-[#374151]"><strong>Whom To Meet:</strong> {visit.whomToMeet || "-"}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}

export default UserHistoryPage;
