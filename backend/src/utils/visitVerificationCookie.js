const VISIT_VERIFICATION_COOKIE = "ttfo_visit_verification";

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
    path: "/api"
});

const setVisitVerificationCookie = (res, token) => {
    res.cookie(VISIT_VERIFICATION_COOKIE, token, getCookieOptions());
};

const clearVisitVerificationCookie = (res) => {
    res.clearCookie(VISIT_VERIFICATION_COOKIE, {
        ...getCookieOptions(),
        maxAge: undefined
    });
};

module.exports = {
    VISIT_VERIFICATION_COOKIE,
    setVisitVerificationCookie,
    clearVisitVerificationCookie
};
