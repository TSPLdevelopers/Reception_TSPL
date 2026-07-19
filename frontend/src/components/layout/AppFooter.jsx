function AppFooter({ className = "" }) {
    return (
        <footer className={`flex min-h-[70px] items-center justify-between gap-4 bg-footer-soft px-[34px] py-5 text-sm font-semibold text-[#607089] max-[768px]:flex-col max-[768px]:px-[18px] max-[768px]:text-center ${className}`}>
            <p>© 2024 - 2026 TechTorch Solutions Private Limited</p>
            <p>Privacy Policy &nbsp;&nbsp; Version 1.0</p>
        </footer>
    );
}

export default AppFooter;
