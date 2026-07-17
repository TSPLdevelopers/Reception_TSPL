import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { detectPhoneCountry, isValidInternationalPhone } from "../utils/phone";
import { getOtherVisitorType } from "../constants/visitorTypes";

const EMPTY_ADDRESS = {
    line1: "",
    line2: "",
    countryCode: "IN",
    country: "India",
    stateCode: "",
    state: "",
    city: "",
    postalCode: ""
};

const EMPTY_FORM_DATA = {
    firstName: "",
    lastName: "",
    email: "",
    typeOption: "",
    otherType: "",
    type: "",
    address: EMPTY_ADDRESS
};

const EMPTY_VISIT_DATA = {
    reason: "",
    whomToMeet: ""
};

const createFallbackEntry = () => ({
    phone: "",
    phoneCountry: "IN",
    step: "phone",
    flowType: "",
    otp: "",
    resendTimer: 0,
    formData: EMPTY_FORM_DATA,
    visitData: EMPTY_VISIT_DATA
});

const normaliseSavedFormData = (savedFormData = {}) => ({
    ...EMPTY_FORM_DATA,
    ...savedFormData,
    typeOption: savedFormData.typeOption || savedFormData.type || "",
    type: savedFormData.type || "",
    address: {
        ...EMPTY_ADDRESS,
        ...(savedFormData.address || {})
    }
});

const readSavedEntry = (category) => {
    const fallback = createFallbackEntry();

    try {
        const savedData = sessionStorage.getItem(`entry-${category}`);
        if (!savedData) return fallback;

        const parsedData = JSON.parse(savedData);
        const phone = parsedData.phone || "";

        return {
            phone,
            phoneCountry: parsedData.phoneCountry || detectPhoneCountry(phone, "IN"),
            step: ["phone", "register", "otp", "visit"].includes(parsedData.step)
                ? parsedData.step
                : "phone",
            flowType: parsedData.flowType || "",
            otp: "",
            resendTimer: parsedData.resendTimer || 0,
            formData: normaliseSavedFormData(parsedData.formData),
            visitData: {
                ...EMPTY_VISIT_DATA,
                ...(parsedData.visitData || {})
            }
        };
    } catch {
        sessionStorage.removeItem(`entry-${category}`);
        return fallback;
    }
};

function useEntryFlow(category, navigate) {
    const [initialEntryState] = useState(() => readSavedEntry(category));
    const [phone, setPhone] = useState(initialEntryState.phone);
    const [phoneCountry, setPhoneCountry] = useState(initialEntryState.phoneCountry);
    const [step, setStep] = useState(initialEntryState.step);
    const [flowType, setFlowType] = useState(initialEntryState.flowType);
    const [otp, setOtp] = useState(initialEntryState.otp);
    const [resendTimer, setResendTimer] = useState(initialEntryState.resendTimer);
    const [formData, setFormData] = useState(initialEntryState.formData);
    const [visitData, setVisitData] = useState(initialEntryState.visitData);
    const [countdown, setCountdown] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (step === "success") return;

        sessionStorage.setItem(
            `entry-${category}`,
            JSON.stringify({
                phone,
                phoneCountry,
                step,
                flowType,
                resendTimer,
                formData,
                visitData
            })
        );
    }, [phone, phoneCountry, step, flowType, resendTimer, formData, visitData, category]);

    useEffect(() => {
        if (step !== "otp" || resendTimer <= 0) return undefined;
        const timer = setTimeout(() => {
            setResendTimer((current) => Math.max(current - 1, 0));
        }, 1000);
        return () => clearTimeout(timer);
    }, [step, resendTimer]);

    useEffect(() => {
        if (step !== "success") return undefined;

        sessionStorage.removeItem(`entry-${category}`);
        const countdownTimer = setInterval(() => {
            setCountdown((current) => Math.max(current - 1, 0));
        }, 1000);
        const redirectTimer = setTimeout(() => navigate("/"), 10000);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [step, category, navigate]);

    const currentStep = {
        phone: 1,
        register: 2,
        otp: 3,
        visit: 4,
        success: 5
    }[step] || 1;

    const handlePhoneChange = (nextPhone) => {
        if (nextPhone !== phone) {
            setFlowType("");
            setOtp("");
        }
        setPhone(nextPhone);
    };

    const goBack = () => {
        if (step === "register") setStep("phone");
        if (step === "otp") {
            setOtp("");
            setStep(flowType === "new" ? "register" : "phone");
        }
        if (step === "visit") {
            api.post("/otp/clear-verification").catch(() => {});
            setOtp("");
            setStep("otp");
        }
    };

    const validateRegistration = () => {
        const otherOption = getOtherVisitorType(category);

        if (!formData.firstName.trim()) {
            toast.error("First name is required");
            return false;
        }
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (!formData.typeOption) {
            toast.error("Please select a visitor type");
            return false;
        }
        if (formData.typeOption === otherOption && !formData.otherType.trim()) {
            toast.error("Please specify the visitor type");
            return false;
        }

        const requiredAddressFields = [
            [formData.address.line1, "Address line 1 is required"],
            [formData.address.country, "Country is required"],
            [formData.address.state, "State or province is required"],
            [formData.address.city, "City is required"],
            [formData.address.postalCode, "Postal or ZIP code is required"]
        ];
        const missingField = requiredAddressFields.find(([value]) => !String(value || "").trim());
        if (missingField) {
            toast.error(missingField[1]);
            return false;
        }
        return true;
    };

    const buildRegistrationData = () => ({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        category,
        typeOption: formData.typeOption,
        type: formData.typeOption === getOtherVisitorType(category)
            ? formData.otherType.trim()
            : formData.typeOption,
        address: {
            ...formData.address,
            line1: formData.address.line1.trim(),
            line2: formData.address.line2.trim(),
            state: formData.address.state.trim(),
            city: formData.address.city.trim(),
            postalCode: formData.address.postalCode.trim()
        }
    });

    const sendOtp = async (registrationData = null) => {
        const response = await api.post("/otp/send", {
            phone,
            category,
            ...(registrationData ? { registrationData } : {})
        });

        setResendTimer(response.data.remainingSeconds || 120);
        setOtp("");
        setStep("otp");
        toast.success(response.data.message || "OTP sent successfully");
        if (import.meta.env.DEV && response.data.otp) {
            toast.success(`Development OTP: ${response.data.otp}`);
        }
    };

    const checkUser = async () => {
        if (!isValidInternationalPhone(phone)) {
            toast.error("Please enter a valid international phone number");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.post("/auth/check-user", { phone, category });
            if (response.data.exists) {
                setFlowType("existing");
                await sendOtp();
            } else {
                setFlowType("new");
                setStep("register");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to continue");
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateOtp = async () => {
        if (!validateRegistration()) return;
        try {
            setIsSubmitting(true);
            await sendOtp(buildRegistrationData());
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to send OTP");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resendOtp = async () => {
        if (resendTimer > 0 || isSubmitting) return;
        if (flowType === "new" && !validateRegistration()) return;

        try {
            setIsSubmitting(true);
            await sendOtp(flowType === "new" ? buildRegistrationData() : null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to resend OTP");
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyOtp = async () => {
        if (!/^\d{6}$/.test(otp)) {
            toast.error("Please enter the 6-digit OTP");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post("/otp/verify", { phone, otp, category });
            setStep("visit");
            toast.success("OTP verified successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const createVisit = async () => {
        if (!visitData.reason.trim() || !visitData.whomToMeet.trim()) {
            toast.error("Reason and Whom To Meet are required");
            return;
        }
        try {
            setIsSubmitting(true);
            await api.post("/visit/create", {
                phone,
                reason: visitData.reason.trim(),
                whomToMeet: visitData.whomToMeet.trim()
            });
            toast.success("Visit registered successfully");
            setStep("success");
        } catch (error) {
            const status = error.response?.status;
            toast.error(error.response?.data?.message || "Unable to create visit");
            if (status === 401 || status === 403) {
                setOtp("");
                setStep("otp");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        phone,
        phoneCountry,
        step,
        flowType,
        otp,
        resendTimer,
        formData,
        visitData,
        countdown,
        isSubmitting,
        currentStep,
        setPhoneCountry,
        setOtp,
        setFormData,
        setVisitData,
        handlePhoneChange,
        goBack,
        checkUser,
        generateOtp,
        resendOtp,
        verifyOtp,
        createVisit
    };
}

export default useEntryFlow;
