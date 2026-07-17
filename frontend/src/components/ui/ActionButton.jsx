const variants = {
    primary: "border-transparent bg-brand text-white shadow-[0_10px_24px_rgba(115,0,66,.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(115,0,66,.22)]",
    secondary: "border-brand bg-white text-brand hover:bg-brand hover:text-white",
    ghost: "border-transparent bg-transparent text-[#6b7280] hover:text-brand"
};

function ActionButton({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] border px-5 text-[15px] font-bold transition focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export default ActionButton;
