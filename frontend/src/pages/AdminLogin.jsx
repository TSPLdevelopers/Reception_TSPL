import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaEnvelope,
    FaEye,
    FaEyeSlash,
    FaLock,
    FaShieldAlt
} from "react-icons/fa";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import api from "../services/api";
import AppFooter from "../components/layout/AppFooter";

const inputWrap = "mt-[9px] flex h-[54px] items-center gap-3 rounded-[15px] border border-[#e1e5ee] bg-white px-[15px] transition focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/[.08]";
const inputClass = "h-full min-w-0 flex-1 border-none bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9aa1aa]";
const primaryButton = "mt-[6px] inline-flex h-[54px] w-full items-center justify-center rounded-[15px] bg-brand px-5 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_30px_rgba(115,0,66,.22)] disabled:cursor-not-allowed disabled:opacity-50";
const textButton = "mt-5 block w-full text-center text-[15px] font-semibold text-brand transition hover:text-brand-dark hover:underline";

function PasswordField({ label, value, onChange, visible, onToggle, placeholder }) {
    return (
        <div>
            <label className="text-[13px] font-extrabold text-[#4b5563]">{label}</label>
            <div className={inputWrap}>
                <FaLock className="shrink-0 text-brand-muted" />
                <input
                    className={inputClass}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    autoComplete="current-password"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-[#6b7280] transition hover:text-brand"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
}

function AdminLogin() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let active = true;
        api.get("/admin/session")
            .then(() => {
                if (active) navigate("/admin", { replace: true });
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, [navigate]);

    const handleLogin = async () => {
        try {
            setIsSubmitting(true);
            await api.post("/admin/login", { email, password });
            toast.success("Login successful");
            navigate("/admin", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendForgotOtp = async () => {
        try {
            setIsSubmitting(true);
            const response = await api.post("/admin/forgot-password", { email });
            toast.success(response.data.message);
            if (import.meta.env.DEV && response.data.otp) {
                toast.success(`Development OTP: ${response.data.otp}`);
            }
            setMode("reset");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to send reset code");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const strong =
            newPassword.length >= 10 &&
            /[A-Z]/.test(newPassword) &&
            /[a-z]/.test(newPassword) &&
            /\d/.test(newPassword) &&
            /[^A-Za-z0-9]/.test(newPassword);

        if (!strong) {
            toast.error("Use 10+ characters with uppercase, lowercase, number and special character.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.put("/admin/reset-password", { email, otp, newPassword });
            toast.success("Password reset successful");
            setMode("login");
            setPassword("");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to reset password");
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = mode === "login" ? "Admin Login" : mode === "forgot" ? "Forgot Password" : "Reset Password";
    const description = mode === "login"
        ? "Authorized access only for administrators."
        : mode === "forgot"
            ? "Enter the registered admin email to receive a secure reset code."
            : "Enter the email code and choose a new secure password.";

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(115,0,66,.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(115,0,66,.18),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f6e8f1_48%,#ffffff_100%)] max-[980px]:h-auto max-[980px]:overflow-visible">
            <header className="flex h-[72px] items-center justify-between border-b border-[#ececec] bg-white px-[34px] max-sm:px-[18px]">
                <button type="button" onClick={() => navigate("/")} className="rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20">
                    <img src={logo} alt="TechTorch Solutions" className="h-[44px] w-auto object-contain max-sm:h-[38px]" />
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-[9px] rounded-[14px] border border-brand/25 bg-white px-5 py-[11px] text-sm font-extrabold text-brand transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(115,0,66,.12)] max-[620px]:px-[13px] max-[620px]:py-[9px] max-[620px]:text-xs"
                >
                    <FaArrowLeft /> Back To Home
                </button>
            </header>

            <main className="mx-auto grid h-[calc(100vh-144px)] w-full max-w-[1180px] flex-1 grid-cols-[1fr_430px] items-center gap-[60px] overflow-hidden px-[34px] py-[18px] max-[980px]:h-auto max-[980px]:grid-cols-1 max-[980px]:gap-[30px] max-[980px]:overflow-y-auto max-[620px]:px-[18px] max-[620px]:py-6">
                <section className="max-w-[620px] max-[980px]:mx-auto max-[980px]:text-center">
                    <span className="inline-block rounded-full bg-[#fde8f3] px-4 py-2 text-[12px] font-black tracking-[.7px] text-brand">SECURE ADMIN ACCESS</span>
                    <h1 className="mt-5 text-[40px] font-black leading-[1.15] text-brand-dark max-[620px]:text-[34px]">
                        TechTorch Front Office Admin Access Portal
                    </h1>
                    <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-[#6b7280] max-[980px]:mx-auto">
                        Manage walk-ins, monitor daily entries, export reports, and access secure walk-in history from one dashboard.
                    </p>
                    <div className="mt-5 grid max-w-[560px] grid-cols-2 gap-[10px] max-[980px]:mx-auto max-[620px]:grid-cols-1">
                        {["Database admin login", "All walk-ins data CSV export", "Secure walk-ins records", "Search and other filters"].map((item) => (
                            <div key={item} className="rounded-[16px] border border-brand/10 bg-white/75 px-[14px] py-3 text-sm font-extrabold text-[#374151] shadow-[0_10px_25px_rgba(15,23,42,.05)]">
                                ✓ {item}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="w-[430px] rounded-[28px] border border-[#e7eaf0] bg-white p-[30px] shadow-[0_22px_55px_rgba(115,0,66,.16)] max-[980px]:mx-auto max-[980px]:w-full max-[980px]:max-w-[430px] max-[520px]:p-6">
                    <div className="mb-6 flex h-[62px] w-[62px] items-center justify-center rounded-[18px] bg-[#f9edf5] text-[28px] text-brand">
                        <FaShieldAlt />
                    </div>
                    <h2 className="text-[32px] font-bold text-[#111827]">{title}</h2>
                    <p className="mt-[10px] text-[15px] leading-[1.5] text-[#6b7280]">{description}</p>

                    <div className="mt-7 space-y-5">
                        <div>
                            <label className="text-[13px] font-extrabold text-[#4b5563]">Email Address</label>
                            <div className={inputWrap}>
                                <FaEnvelope className="shrink-0 text-brand-muted" />
                                <input
                                    className={inputClass}
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="admin@techtorch.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {mode === "login" && (
                            <>
                                <PasswordField label="Password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} placeholder="Enter password" />
                                <button type="button" className={textButton} onClick={() => setMode("forgot")}>Forgot Password?</button>
                                <button type="button" className={primaryButton} onClick={handleLogin} disabled={isSubmitting}>{isSubmitting ? "Signing In..." : "Sign In Securely"}</button>
                            </>
                        )}

                        {mode === "forgot" && (
                            <>
                                <button type="button" className={primaryButton} onClick={sendForgotOtp} disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Reset Code"}</button>
                                <button type="button" className={textButton} onClick={() => setMode("login")}>Back to Login</button>
                            </>
                        )}

                        {mode === "reset" && (
                            <>
                                <div>
                                    <label className="text-[13px] font-extrabold text-[#4b5563]">One-Time Code</label>
                                    <div className={inputWrap}>
                                        <FaLock className="shrink-0 text-brand-muted" />
                                        <input className={inputClass} inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="6-digit code" />
                                    </div>
                                </div>
                                <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} visible={showNewPassword} onToggle={() => setShowNewPassword((value) => !value)} placeholder="New password" />
                                <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((value) => !value)} placeholder="Confirm password" />
                                <button type="button" className={primaryButton} onClick={resetPassword} disabled={isSubmitting}>{isSubmitting ? "Resetting..." : "Reset Password"}</button>
                                <button type="button" className={textButton} onClick={() => setMode("login")}>Back to Login</button>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <AppFooter className="min-h-[72px]" />
        </div>
    );
}

export default AdminLogin;
