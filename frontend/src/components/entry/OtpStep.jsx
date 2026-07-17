import { FaClock, FaShieldAlt } from "react-icons/fa";
import ActionButton from "../ui/ActionButton";
import EntryCard from "../ui/EntryCard";

function OtpStep({
    otp,
    setOtp,
    verifyOtp,
    resendOtp,
    resendTimer,
    isSubmitting
}) {
    return (
        <EntryCard
            icon={FaShieldAlt}
            title="OTP Verification"
            subtitle="A verification code has been sent. Enter the OTP below to continue."
            className="text-center"
        >
            <div className="my-7 text-left">
                <label className="mb-2.5 block text-[15px] font-bold text-[#374151]">
                    Enter OTP
                </label>

                <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength="6"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, ""))
                    }
                    className="h-[58px] w-full rounded-[15px] border border-[#ddd] text-center text-[28px] font-bold tracking-[10px] outline-none transition focus:border-brand focus:ring-3 focus:ring-[rgba(115,0,66,.08)]"
                />
            </div>

            <div className="my-6 flex items-center justify-center gap-3 rounded-[14px] bg-[#f8f4f7] p-4 text-sm font-bold text-brand">
                <FaClock />
                <span>
                    {resendTimer > 0
                        ? `Resend available in ${resendTimer}s`
                        : "You can request a new OTP now."}
                </span>
            </div>

            <div className="space-y-3">
                <ActionButton onClick={verifyOtp} disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify OTP →"}
                </ActionButton>

                <ActionButton
                    variant="secondary"
                    disabled={resendTimer > 0 || isSubmitting}
                    onClick={resendOtp}
                >
                    Resend OTP
                </ActionButton>
            </div>
        </EntryCard>
    );
}

export default OtpStep;
