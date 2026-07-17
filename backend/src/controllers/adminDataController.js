const User = require("../models/User");
const { escapeRegex } = require("../utils/text");

const USER_PROJECTION = {
    firstName: 1,
    lastName: 1,
    phone: 1,
    email: 1,
    category: 1,
    type: 1,
    typeOption: 1,
    address: 1,
    addressMigrationStatus: 1,
    visitCount: 1,
    visits: 1,
    createdAt: 1
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, USER_PROJECTION)
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json(users);
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalClients, totalVendors, totalOfficials, totalVisitors] =
            await Promise.all([
                User.countDocuments(),
                User.countDocuments({ category: "client" }),
                User.countDocuments({ category: "vendor" }),
                User.countDocuments({ category: "official" }),
                User.countDocuments({ category: "visitor" })
            ]);

        return res.status(200).json({
            totalUsers,
            totalClients,
            totalVendors,
            totalOfficials,
            totalVisitors
        });
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};

const visitMatchesRange = (visit, filters) => {
    const visitDate = new Date(visit.arrivalTime);
    const { fromDate, toDate, fromTime, toTime } = filters;

    if (fromDate) {
        const startDate = new Date(fromDate);
        startDate.setHours(0, 0, 0, 0);
        if (visitDate < startDate) return false;
    }

    if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        if (visitDate > endDate) return false;
    }

    const visitMinutes = visitDate.getHours() * 60 + visitDate.getMinutes();

    if (fromTime) {
        const [hours, minutes] = fromTime.split(":").map(Number);
        if (visitMinutes < hours * 60 + minutes) return false;
    }

    if (toTime) {
        const [hours, minutes] = toTime.split(":").map(Number);
        if (visitMinutes > hours * 60 + minutes) return false;
    }

    return true;
};

const sortUsers = (users, sortBy) => {
    const copy = [...users];

    switch (sortBy) {
        case "oldest":
            return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case "mostVisits":
            return copy.sort((a, b) => b.visitCount - a.visitCount);
        case "leastVisits":
            return copy.sort((a, b) => a.visitCount - b.visitCount);
        case "name":
            return copy.sort((a, b) => a.firstName.localeCompare(b.firstName));
        default:
            return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
};

const searchUsers = async (req, res) => {
    try {
        const {
            search,
            category,
            fromDate,
            toDate,
            fromTime,
            toTime,
            sortBy,
            viewType
        } = req.query;
        const filter = {};

        if (search?.trim()) {
            const safeSearch = escapeRegex(search.trim());
            filter.$or = [
                { firstName: { $regex: safeSearch, $options: "i" } },
                { lastName: { $regex: safeSearch, $options: "i" } },
                { email: { $regex: safeSearch, $options: "i" } },
                { phone: { $regex: safeSearch, $options: "i" } },
                { type: { $regex: safeSearch, $options: "i" } },
                { "address.city": { $regex: safeSearch, $options: "i" } },
                { "address.state": { $regex: safeSearch, $options: "i" } },
                { "address.country": { $regex: safeSearch, $options: "i" } }
            ];
        }

        if (["client", "vendor", "official", "visitor"].includes(category)) {
            filter.category = category;
        }

        let users = await User.find(filter, USER_PROJECTION).lean();

        if (fromDate || toDate || fromTime || toTime) {
            users = users.filter((user) =>
                user.visits?.some((visit) =>
                    visitMatchesRange(visit, { fromDate, toDate, fromTime, toTime })
                )
            );
        }

        if (viewType === "recent") {
            users = users
                .filter((user) => user.visits?.length)
                .sort((a, b) => {
                    const lastA = a.visits.at(-1)?.arrivalTime;
                    const lastB = b.visits.at(-1)?.arrivalTime;
                    return new Date(lastB) - new Date(lastA);
                })
                .slice(0, 10);
        } else if (viewType === "frequent") {
            users = users
                .filter((user) => user.visitCount > 0)
                .sort((a, b) => b.visitCount - a.visitCount)
                .slice(0, 10);
        } else {
            users = sortUsers(users, sortBy);
        }

        return res.status(200).json(users);
    } catch (error) {
        console.error("Admin search error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllUsers,
    getDashboardStats,
    searchUsers,
    visitMatchesRange,
    sortUsers
};
