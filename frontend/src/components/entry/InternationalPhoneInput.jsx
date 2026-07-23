import { FaMobileAlt } from "react-icons/fa";
import SearchableSelect from "../ui/SearchableSelect";
import {
    PHONE_COUNTRIES,
    buildInternationalPhone,
    getNationalDigits
} from "../../utils/phone";

function InternationalPhoneInput({
    phone,
    countryCode,
    onPhoneChange,
    onCountryChange
}) {
    const selectedCountry =
        PHONE_COUNTRIES.find((country) => country.value === countryCode) ||
        PHONE_COUNTRIES.find((country) => country.value === "IN");

    const nationalDigits = getNationalDigits(phone, selectedCountry.value);

    const handleCountryChange = (country) => {
        onCountryChange(country.value);
        onPhoneChange(
            buildInternationalPhone(country.value, nationalDigits)
        );
    };

    const handleNumberChange = (event) => {
        const digits = event.target.value.replace(/\D/g, "");
        onPhoneChange(
            buildInternationalPhone(selectedCountry.value, digits)
        );
    };

    return (
        <div>
            <label className="mb-2 block text-[13px] font-bold text-[#4b5563]">
                Mobile Number <span className="text-brand">*</span>
            </label>

            <div className="grid grid-cols-[170px_1fr] gap-3 max-[520px]:grid-cols-1">
                <SearchableSelect
                    value={selectedCountry.value}
                    options={PHONE_COUNTRIES}
                    onChange={handleCountryChange}
                   
                    placeholder="Country"
                    renderValue={(country) => (
                        <span className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-bold">+{country.callingCode}</span>
                        </span>
                    )}
                    renderOption={(country) => (
                        <span className="flex w-full items-center gap-3">
                            <span className="text-lg">{country.flag}</span>
                            <span className="min-w-0 flex-1 truncate">
                                {country.label}
                            </span>
                            <span className="shrink-0 font-bold text-brand">
                                +{country.callingCode}
                            </span>
                        </span>
                    )}
                />

                <div className="flex h-[54px] items-center gap-3 rounded-[14px] border border-[#e1e5ee] bg-white px-[15px] transition focus-within:border-brand focus-within:ring-[3px] focus-within:ring-[rgba(115,0,66,.08)]">
                    <FaMobileAlt className="shrink-0 text-brand-muted" />
                    <span className="shrink-0 text-sm font-bold text-brand">
                        +{selectedCountry.callingCode}
                    </span>
                    <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="Enter phone number"
                        value={nationalDigits}
                        maxLength={13}
                        onChange={handleNumberChange}
                        className="h-full min-w-0 flex-1 border-none bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#8a8f98]"
                    />
                </div>
            </div>
        </div>
    );
}

export default InternationalPhoneInput;
