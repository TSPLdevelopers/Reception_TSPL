import { FaEnvelope, FaUser } from "react-icons/fa";
import ActionButton from "../ui/ActionButton";
import EntryCard from "../ui/EntryCard";
import FormField from "../ui/FormField";
import AddressFields from "./AddressFields";
import CategoryTypeSelect from "./CategoryTypeSelect";

function RegisterStep({
    category,
    formData,
    setFormData,
    generateOtp,
    isSubmitting
}) {
    return (
        <EntryCard
            icon={FaUser}
            title="New Registration"
            subtitle="Please provide your details to continue with visitor verification."
        >
            <div className="grid grid-cols-2 gap-[18px] max-[680px]:grid-cols-1">
                <FormField
                    label="First Name"
                    icon={FaUser}
                    value={formData.firstName}
                    onChange={(firstName) =>
                        setFormData({ ...formData, firstName })
                    }
                    placeholder="First Name"
                    required
                    autoComplete="given-name"
                />

                <FormField
                    label="Last Name"
                    icon={FaUser}
                    value={formData.lastName}
                    onChange={(lastName) =>
                        setFormData({ ...formData, lastName })
                    }
                    placeholder="Last Name"
                    autoComplete="family-name"
                />

                <FormField
                    label="Email"
                    icon={FaEnvelope}
                    value={formData.email}
                    onChange={(email) =>
                        setFormData({ ...formData, email })
                    }
                    placeholder="email@company.com"
                    type="email"
                    autoComplete="email"
                    className="col-span-full"
                />

                <div className="col-span-full">
                    <CategoryTypeSelect
                        category={category}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </div>

                <AddressFields
                    address={formData.address}
                    onChange={(address) =>
                        setFormData({ ...formData, address })
                    }
                />
            </div>

            <ActionButton
                onClick={generateOtp}
                disabled={isSubmitting}
                className="mt-6"
            >
                {isSubmitting ? "Sending OTP..." : "Register & Continue →"}
            </ActionButton>
        </EntryCard>
    );
}

export default RegisterStep;
