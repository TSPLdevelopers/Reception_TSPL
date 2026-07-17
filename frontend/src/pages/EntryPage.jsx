import { lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppFooter from "../components/layout/AppFooter";
import ActionButton from "../components/ui/ActionButton";
import EntryHeader from "../components/entry/layout/EntryHeader";
import EntrySidebar from "../components/entry/layout/EntrySidebar";
import EntryProgress from "../components/entry/layout/EntryProgress";
import EntryInfoPanel from "../components/entry/layout/EntryInfoPanel";
import PhoneStep from "../components/entry/PhoneStep";
import OtpStep from "../components/entry/OtpStep";
import VisitStep from "../components/entry/VisitStep";
import useEntryFlow from "../hooks/useEntryFlow";

const RegisterStep = lazy(() => import("../components/entry/RegisterStep"));

function SuccessCard({ category, phone, visitData, countdown, onHome }) {
    const details = [
        ["Category", category.toUpperCase()],
        ["Phone", phone],
        ["Reason", visitData.reason],
        ["Whom To Meet", visitData.whomToMeet]
    ];

    return (
        <div className="w-full max-w-[620px] rounded-[25px] border border-[#e7eaf0] bg-white p-[54px] text-center shadow-[0_14px_35px_rgba(15,23,42,.08)] max-[680px]:p-7">
            <div className="mx-auto mb-[22px] flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#dcfce7] text-4xl font-extrabold text-[#16a34a]">✓</div>
            <h1 className="mb-2 text-[30px] font-extrabold text-brand">You are verified</h1>
            <h2 className="text-xl font-bold text-[#111827]">Welcome to TechTorch Solutions</h2>
            <p className="mt-4 text-[15px] leading-6 text-[#555]">Your visit has been registered successfully. Please proceed to the reception desk.</p>

            <div className="mx-auto my-7 max-w-[420px] overflow-hidden rounded-[20px] border border-[#e8dbe4] bg-white text-left shadow-[0_14px_35px_rgba(115,0,66,.10)]">
                <div className="bg-brand px-[22px] py-4 text-center font-bold tracking-[1px] text-white">VISITOR PASS</div>
                {details.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-[18px] border-b border-[#f1e8ee] px-[22px] py-3.5 text-sm">
                        <span className="font-semibold text-[#6b7280]">{label}</span>
                        <strong className="text-right font-bold text-[#111827]">{value}</strong>
                    </div>
                ))}
                <div className="bg-[#faf4f8] px-[22px] py-3.5 text-center font-bold text-brand">Redirecting in {countdown}s</div>
            </div>

            <ActionButton onClick={onHome}>Go To Home</ActionButton>
        </div>
    );
}

function EntryPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const flow = useEntryFlow(category, navigate);

    return (
        <div className="min-h-screen bg-white">
            <EntryHeader />

            <div className="grid min-h-[calc(100vh-72px)] grid-cols-[290px_1fr] bg-[radial-gradient(circle_at_top_left,rgba(115,0,66,.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(115,0,66,.06),transparent_28%),linear-gradient(180deg,#ffffff_0%,#faf7fb_55%,#ffffff_100%)] max-[1180px]:grid-cols-1">
                <EntrySidebar currentStep={flow.currentStep} flowType={flow.flowType} />

                <main className="px-[54px] pb-[70px] pt-[38px] max-[1180px]:px-6 max-[1180px]:pb-[60px] max-[1180px]:pt-8 max-[680px]:px-4 max-[680px]:pb-[50px] max-[680px]:pt-6">
                    <div className="mb-[18px] flex items-center justify-between gap-5 max-[680px]:flex-col max-[680px]:items-start">
                        <button type="button" onClick={() => navigate("/")} className="text-sm font-semibold text-[#6b7280] transition hover:-translate-x-1 hover:text-brand">← Back to Landing Page</button>
                        <EntryProgress currentStep={flow.currentStep} />
                    </div>

                    <div className="mx-auto grid max-w-[1020px] grid-cols-[minmax(420px,620px)_330px] items-start justify-center gap-[34px] max-[900px]:grid-cols-1 max-[680px]:gap-[22px]">
                        <section className="flex min-w-0 flex-col items-center">
                            {flow.step !== "phone" && flow.step !== "success" && (
                                <button type="button" onClick={flow.goBack} className="mb-[18px] self-start rounded-[14px] border border-brand/25 bg-white px-6 py-2.5 font-semibold text-brand transition hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-[0_10px_25px_rgba(115,0,66,.18)]">← Back</button>
                            )}

                            <div className="mb-[18px] self-start rounded-full bg-[#fde8f3] px-[18px] py-2 text-xs font-bold tracking-[.7px] text-brand">{category.toUpperCase()} CHECK-IN</div>

                            {flow.step === "phone" && (
                                <PhoneStep
                                    phone={flow.phone}
                                    countryCode={flow.phoneCountry}
                                    setPhone={flow.handlePhoneChange}
                                    setCountryCode={flow.setPhoneCountry}
                                    checkUser={flow.checkUser}
                                    isSubmitting={flow.isSubmitting}
                                />
                            )}

                            {flow.step === "register" && (
                                <Suspense fallback={<div className="w-full rounded-[25px] border border-[#e7eaf0] bg-white p-10 text-center font-bold text-brand shadow-[0_14px_35px_rgba(15,23,42,.06)]">Loading registration form...</div>}>
                                    <RegisterStep
                                        category={category}
                                        formData={flow.formData}
                                        setFormData={flow.setFormData}
                                        generateOtp={flow.generateOtp}
                                        isSubmitting={flow.isSubmitting}
                                    />
                                </Suspense>
                            )}

                            {flow.step === "otp" && (
                                <OtpStep
                                    otp={flow.otp}
                                    setOtp={flow.setOtp}
                                    verifyOtp={flow.verifyOtp}
                                    resendOtp={flow.resendOtp}
                                    resendTimer={flow.resendTimer}
                                    isSubmitting={flow.isSubmitting}
                                />
                            )}

                            {flow.step === "visit" && (
                                <VisitStep
                                    visitData={flow.visitData}
                                    setVisitData={flow.setVisitData}
                                    createVisit={flow.createVisit}
                                    isSubmitting={flow.isSubmitting}
                                />
                            )}

                            {flow.step === "success" && (
                                <SuccessCard
                                    category={category}
                                    phone={flow.phone}
                                    visitData={flow.visitData}
                                    countdown={flow.countdown}
                                    onHome={() => navigate("/")}
                                />
                            )}
                        </section>

                        <EntryInfoPanel
                            category={category}
                            step={flow.step}
                            phone={flow.phone}
                            formData={flow.formData}
                            visitData={flow.visitData}
                            flowType={flow.flowType}
                        />
                    </div>
                </main>
            </div>

            <AppFooter />
        </div>
    );
}

export default EntryPage;
