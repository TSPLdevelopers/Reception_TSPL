import {
    FaBuilding,
    FaCity,
    FaGlobeAsia,
    FaMapMarkerAlt,
    FaMapPin
} from "react-icons/fa";
import FormField from "../ui/FormField";
import SearchableSelect from "../ui/SearchableSelect";
import { PHONE_COUNTRIES } from "../../utils/phone";

const COUNTRY_OPTIONS = PHONE_COUNTRIES.map((country) => ({
    value: country.value,
    label: country.label,
    flag: country.flag
}));

function AddressFields({ address, onChange }) {
    const updateAddress = (changes) => {
        onChange({
            ...address,
            ...changes
        });
    };

    const handleCountryChange = (country) => {
        updateAddress({
            countryCode: country.value,
            country: country.label,
            stateCode: "",
            state: "",
            city: "",
            postalCode: ""
        });
    };

    return (
        <div className="col-span-full rounded-[18px] border border-[#eef0f4] bg-[#fbfcff] p-5">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-brand-soft text-brand">
                    <FaMapMarkerAlt />
                </div>
                <div>
                    <h3 className="text-base font-extrabold text-[#111827]">
                        Address Details
                    </h3>
                    <p className="text-xs font-semibold text-[#6b7280]">
                        Please enter the walk-in&apos;s complete address.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-[18px] max-[680px]:grid-cols-1">
                <FormField
                    label="Address Line 1"
                    icon={FaMapMarkerAlt}
                    value={address.line1}
                    onChange={(line1) => updateAddress({ line1 })}
                    placeholder="House, street, area"
                    required
                    className="col-span-full"
                />

                <FormField
                    label="Address Line 2"
                    icon={FaBuilding}
                    value={address.line2}
                    onChange={(line2) => updateAddress({ line2 })}
                    placeholder="Building, landmark (optional)"
                    className="col-span-full"
                />

                <SearchableSelect
                    label="Country"
                    value={address.countryCode}
                    options={COUNTRY_OPTIONS}
                    onChange={handleCountryChange}
                    placeholder="Select country"
                    icon={FaGlobeAsia}
                    renderValue={(country) => (
                        <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.label}</span>
                        </span>
                    )}
                    renderOption={(country) => (
                        <span className="flex items-center gap-3">
                            <span className="text-lg">{country.flag}</span>
                            <span>{country.label}</span>
                        </span>
                    )}
                />

                <FormField
                    label="State / Province"
                    icon={FaMapPin}
                    value={address.state}
                    onChange={(state) => updateAddress({ state, stateCode: "" })}
                    placeholder="Enter state or province"
                    required
                    autoComplete="address-level1"
                />

                <FormField
                    label="City"
                    icon={FaCity}
                    value={address.city}
                    onChange={(city) => updateAddress({ city })}
                    placeholder="Enter city"
                    required
                    autoComplete="address-level2"
                />

                <FormField
                    label="Postal / ZIP Code"
                    icon={FaMapPin}
                    value={address.postalCode}
                    onChange={(postalCode) => updateAddress({ postalCode })}
                    placeholder="Enter postal code"
                    required
                    autoComplete="postal-code"
                />
            </div>
        </div>
    );
}

export default AddressFields;
