import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import AppFooter from "../components/layout/AppFooter";

const CARDS = [
    ["Client", "Scheduled business meetings and high-level corporate engagements."],
    ["Vendor", "Logistics, delivery personnel, and facility maintenance services."],
    ["Official", "Government officials, regulatory authorities, and staff."],
    ["Visitor", "General guest entry, interview candidates, and personal visits."]
];

function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />

            <main className="flex min-h-[calc(100vh-142px)] flex-1 flex-col justify-center bg-[radial-gradient(circle_at_top_left,rgba(115,0,66,.07),transparent_30%),linear-gradient(180deg,#ffffff_0%,#faf7fb_45%,#ffffff_100%)] px-8 py-7 max-md:px-[18px] max-md:py-8">
                <section className="pb-[34px] pt-2.5 text-center">
                    <div className="mb-[22px] inline-block rounded-full border border-brand/25 bg-[#fff7fb] px-[22px] py-2 text-[13px] font-bold tracking-[.6px] text-brand">
                        ENTERPRISE SECURITY PROTOCOL
                    </div>
                    <h1 className="mb-[22px] text-[52px] font-extrabold leading-[1.15] text-brand-dark max-xl:text-[44px] max-md:text-[36px] max-sm:text-[30px]">
                        Welcome to TechTorch Front Office
                    </h1>
                    <p className="mx-auto max-w-[650px] text-[18px] leading-[1.6] text-[#7a8aa0] max-md:text-base">
                        Experience seamless, secure, and professional entry. Select your visitor category below to continue with the registration process.
                    </p>
                </section>

                <section className="mx-auto grid w-full max-w-[1400px] grid-cols-4 gap-[22px] max-xl:grid-cols-2 max-sm:grid-cols-1">
                    {CARDS.map(([title, subtitle]) => (
                        <DashboardCard key={title} title={title} subtitle={subtitle} />
                    ))}
                </section>
            </main>

            <AppFooter />
        </div>
    );
}

export default Home;
