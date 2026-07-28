import { useState } from "react";
import { FaEnvelope, FaUser } from "react-icons/fa";
import ActionButton from "../ui/ActionButton";
import EntryCard from "../ui/EntryCard";
import FormField from "../ui/FormField";
import AddressFields from "./AddressFields";
import CategoryTypeSelect from "./CategoryTypeSelect";

const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterStep({
    category,
    formData,
    setFormData,
    generateOtp,
    isSubmitting
}) {
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        const firstName = formData.firstName?.trim();
        if (!firstName) {
            newErrors.firstName = "First name is required";
        } else if (firstName.length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        } else if (!nameRegex.test(firstName)) {
            newErrors.firstName = "Only letters are allowed";
        }

        const lastName = formData.lastName?.trim();
        if (lastName && !nameRegex.test(lastName)) {
            newErrors.lastName = "Only letters are allowed";
        }

       const email = formData.email?.trim();

if (email && !emailRegex.test(email)) {
    newErrors.email = "Please enter a valid email address";
}
        if (!formData.typeOption) {
    newErrors.categoryType = "Please select a category";
}

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) generateOtp();
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    return (
        <EntryCard
            icon={FaUser}
            title="New Registration"
            subtitle="Please provide your details to continue with walk-in verification."
        >
            <div className="grid grid-cols-2 gap-[18px] max-[680px]:grid-cols-1">
                <FormField
                    label="First Name"
                    icon={FaUser}
                    value={formData.firstName}
                    onChange={(firstName) => updateField("firstName", firstName)}
                    placeholder="First Name"
                    required
                    autoComplete="given-name"
                    error={errors.firstName}
                    lettersOnly
                />

                <FormField
                    label="Last Name"
                    icon={FaUser}
                    value={formData.lastName}
                    onChange={(lastName) => updateField("lastName", lastName)}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    error={errors.lastName}
                    lettersOnly
                />

               <FormField
    label="Email"
    icon={FaEnvelope}
    value={formData.email}
    onChange={(email) =>
    updateField("email", email.toLowerCase())
}
    placeholder="abc@gmail.com"
    type="email"
    autoComplete="email"
    className="col-span-full"
    error={errors.email}
/>

                <div className="col-span-full">
                    <CategoryTypeSelect
                        category={category}
                        formData={formData}
                        setFormData={setFormData}
                        error={errors.categoryType}
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-6"
            >
                {isSubmitting ? "Sending OTP..." : "Register & Continue →"}
            </ActionButton>
        </EntryCard>
    );
}

export default RegisterStep;