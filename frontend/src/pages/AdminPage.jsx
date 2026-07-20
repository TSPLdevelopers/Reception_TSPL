import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import useAdminDashboard from "../hooks/useAdminDashboard";
import { downloadCsv } from "../utils/csv";
import AppFooter from "../components/layout/AppFooter";
import SearchBar from "../components/SearchBar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminNav from "../components/admin/AdminNav";
import StatsGrid from "../components/admin/StatsGrid";
import RecentActivity from "../components/admin/RecentActivity";
import UserTable from "../components/admin/UserTable";

const AnalyticsCharts = lazy(() => import("../components/admin/AnalyticsCharts"));

function AdminPage() {
    const navigate = useNavigate();
    const dashboard = useAdminDashboard();

    const logout = async () => {
        try {
            await api.post("/admin/logout");
        } catch {
            
        }
        navigate("/admin-login", { replace: true });
    };

    const exportUsers = () => {
        if (!dashboard.users.length) {
            toast.error("No records available to export");
            return;
        }

        downloadCsv({
            filename: `reception-users-report-${new Date().toISOString().slice(0, 10)}.csv`,
            headers: ["Name", "Phone", "Email", "Category", "Type", "Visits", "Last Visit"],
            rows: dashboard.users.map((user) => [
                `${user.firstName} ${user.lastName || ""}`.trim(),
                user.phone,
                user.email || "-",
                user.category,
                user.type || "-",
                user.visitCount,
                dashboard.getLastVisit(user)
            ])
        });
    };

    return (
        <div className="min-h-screen bg-page-soft">
            <AdminHeader onHome={() => navigate("/")} onLogout={logout} />
            <AdminNav onRefresh={dashboard.fetchData} />

            <main id="dashboard-top" className="scroll-mt-[150px] px-[38px] py-[34px] max-md:px-5 max-sm:px-4">
                <div className="mb-7">
                    <h1 className="text-[34px] font-extrabold text-[#111827] max-sm:text-[28px]">Admin Dashboard</h1>
                    <p className="mt-1 text-[15px] text-[#6b7280]">Monitor walk-in records, category insights, and visit activity.</p>
                </div>

                {dashboard.error && (
                    <div className="mb-6 flex items-center justify-between gap-4 rounded-[16px] border border-[#fecdd3] bg-[#fff1f2] px-[18px] py-[15px] font-semibold text-[#9f1239]">
                        <span>{dashboard.error}</span>
                        <button type="button" onClick={dashboard.fetchData} className="rounded-[10px] bg-[#9f1239] px-4 py-2 text-sm font-bold text-white">Retry</button>
                    </div>
                )}

                {dashboard.loading ? (
                    <div className="flex h-[65vh] flex-col items-center justify-center rounded-[24px] border border-[#e7eaf0] bg-white text-center shadow-[0_14px_35px_rgba(15,23,42,.06)]">
                        <div className="h-14 w-14 animate-spin rounded-full border-[5px] border-[#f3dce9] border-t-brand" />
                        <h2 className="mt-5 text-2xl font-bold">Loading dashboard</h2>
                        <p className="mt-2 text-sm text-[#6b7280]">Fetching secure visitor records...</p>
                    </div>
                ) : (
                    <>
                        <StatsGrid stats={dashboard.stats} />
                        <Suspense fallback={<div className="mt-6 rounded-[24px] border border-[#e7eaf0] bg-white p-10 text-center font-bold text-brand shadow-[0_14px_35px_rgba(15,23,42,.06)]">Loading analytics...</div>}>
                            <AnalyticsCharts categoryData={dashboard.categoryData} visitData={dashboard.visitData} dailyVisitData={dashboard.dailyVisitData} />
                        </Suspense>
                        <RecentActivity activities={dashboard.recentActivities} />

                        <div id="search-filters" className="mt-6 scroll-mt-[150px]">
                            <SearchBar onSearch={dashboard.searchUsers} onReset={dashboard.fetchData} />
                        </div>

                        {dashboard.searchLoading && (
                            <div className="mt-4 rounded-[14px] bg-brand-soft px-4 py-3 text-center text-sm font-bold text-brand">Searching records...</div>
                        )}

                        <UserTable
                            users={dashboard.users}
                            getLastVisit={dashboard.getLastVisit}
                            onExport={exportUsers}
                            onHistory={(phone) => navigate(`/history/${encodeURIComponent(phone)}`)}
                        />
                    </>
                )}
            </main>

            <AppFooter />
        </div>
    );
}

export default AdminPage;
