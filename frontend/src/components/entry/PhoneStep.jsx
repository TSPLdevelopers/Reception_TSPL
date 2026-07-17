import { FaLock, FaMobileAlt } from "react-icons/fa";
import ActionButton from "../ui/ActionButton";
import EntryCard from "../ui/EntryCard";
import InternationalPhoneInput from "./InternationalPhoneInput";

function PhoneStep({
    phone,
    countryCode,
    setPhone,
    setCountryCode,
    checkUser,
    isSubmitting
}) {
    return (
        <EntryCard
            icon={FaMobileAlt}
            title="Phone Verification"
            subtitle="Please enter your mobile number to continue."
        >
            <InternationalPhoneInput
                phone={phone}
                countryCode={countryCode}
                onPhoneChange={setPhone}
                onCountryChange={setCountryCode}
            />

            <div className="my-5 flex gap-2">
                <span className="h-[5px] w-7 rounded-full bg-[#10b981]" />
                <span className="h-[5px] w-7 rounded-full bg-[#e5e7eb]" />
                <span className="h-[5px] w-7 rounded-full bg-[#e5e7eb]" />
            </div>

            <ActionButton onClick={checkUser} disabled={isSubmitting}>
                {isSubmitting ? "Checking..." : "Verify & Continue →"}
            </ActionButton>

            <p className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[#6b7280]">
                <FaLock /> Your data is encrypted and handled securely.
            </p>
        </EntryCard>
    );
}

export default PhoneStep;
