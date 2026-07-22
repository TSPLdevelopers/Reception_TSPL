function FormField({ label, icon: Icon, value, onChange, placeholder, type = "text", required = false, maxLength, autoComplete, className = "", inputMode, error, lettersOnly = false }) {

    const handleChange = (event) => {
        let val = event.target.value;
        if (lettersOnly) {
            val = val.replace(/[^a-zA-Z\s]/g, "");
        }
        onChange(val);
    };

    return (
        <div className={className}>
            <label className="mb-2 block text-[13px] font-bold text-[#4b5563]">
                {label}{required && <span className="ml-1 text-brand">*</span>}
            </label>
            <div
                className={`flex h-[52px] items-center gap-3 rounded-[14px] border bg-white px-[15px] transition focus-within:ring-[3px] ${
                    error
                        ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/[.08]"
                        : "border-[#e1e5ee] focus-within:border-brand focus-within:ring-brand/[.08]"
                }`}
            >
                {Icon && <Icon className="shrink-0 text-brand-muted" />}
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    className="h-full w-full border-none bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9aa1aa]"
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default FormField