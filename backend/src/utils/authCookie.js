const ADMIN_COOKIE = "ttfo_admin_session";
const ALLOWED_SAME_SITE = new Set(["strict", "lax", "none"]);

const getSameSite = () => {
    const configured = String(process.env.ADMIN_COOKIE_SAME_SITE || "strict").toLowerCase();
    return ALLOWED_SAME_SITE.has(configured) ? configured : "strict";
};

const getCookieOptions = () => {
    const sameSite = getSameSite();
    const secure = process.env.NODE_ENV === "production" || sameSite === "none";

    return {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/"
    };
};

const setAdminCookie = (res, token) => {
    res.cookie(ADMIN_COOKIE, token, getCookieOptions());
};

const clearAdminCookie = (res) => {
    res.clearCookie(ADMIN_COOKIE, {
        ...getCookieOptions(),
        maxAge: undefined
    });
};

module.exports = {
    ADMIN_COOKIE,
    setAdminCookie,
    clearAdminCookie
};
