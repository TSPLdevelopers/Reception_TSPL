import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const formatLastVisit = (user) => {
    if (!user.visits?.length) return "-";
    return new Date(user.visits.at(-1).arrivalTime).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

function useAdminDashboard() {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const [statsRes, usersRes] = await Promise.all([
                api.get("/admin/dashboard-stats"),
                api.get("/admin/all-users")
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch {
            setError("Unable to load dashboard data. Please check the backend server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        Promise.all([
            api.get("/admin/dashboard-stats"),
            api.get("/admin/all-users")
        ])
            .then(([statsRes, usersRes]) => {
                if (!active) return;
                setStats(statsRes.data);
                setUsers(usersRes.data);
            })
            .catch(() => {
                if (active) {
                    setError("Unable to load dashboard data. Please check the backend server.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const searchUsers = async (filters) => {
        try {
            setSearchLoading(true);
            setError("");
            const response = await api.get("/admin/search-users", { params: filters });
            setUsers(response.data);
        } catch {
            setError("Search failed. Please try again.");
        } finally {
            setSearchLoading(false);
        }
    };

    const categoryData = useMemo(() => [
        { name: "Clients", value: stats.totalClients || 0 },
        { name: "Vendors", value: stats.totalVendors || 0 },
        { name: "Officials", value: stats.totalOfficials || 0 },
        { name: "Visitors", value: stats.totalVisitors || 0 }
    ], [stats]);

    const visitData = useMemo(() => [...users]
        .sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))
        .slice(0, 8)
        .map((user) => ({ name: user.firstName || "User", visits: user.visitCount || 0 })), [users]);

    const dailyVisitData = useMemo(() => {
        const dayMap = {};
        users.forEach((user) => {
            user.visits?.forEach((visit) => {
                const day = new Date(visit.arrivalTime).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short"
                });
                dayMap[day] = (dayMap[day] || 0) + 1;
            });
        });
        return Object.entries(dayMap).map(([date, visits]) => ({ date, visits })).slice(-7);
    }, [users]);

    const recentActivities = useMemo(() => users
        .filter((user) => user.visits?.length)
        .map((user) => {
            const lastVisit = user.visits.at(-1);
            return {
                id: user._id,
                name: `${user.firstName} ${user.lastName || ""}`.trim(),
                category: user.category,
                reason: lastVisit.reason || "-",
                time: lastVisit.arrivalTime
            };
        })
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 6), [users]);

    return {
        stats,
        users,
        loading,
        searchLoading,
        error,
        setError,
        fetchData,
        searchUsers,
        categoryData,
        visitData,
        dailyVisitData,
        recentActivities,
        getLastVisit: formatLastVisit
    };
}

export default useAdminDashboard;
