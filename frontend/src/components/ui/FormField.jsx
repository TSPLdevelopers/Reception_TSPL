function FormField({ label, icon: Icon, value, onChange, placeholder, type = "text", required = false, maxLength, autoComplete, className = "", inputMode }) {
    return (
        <div className={className}>
            <label className="mb-2 block text-[13px] font-bold text-[#4b5563]">
                {label}{required && <span className="ml-1 text-brand">*</span>}
            </label>
            <div className="flex h-[52px] items-center gap-3 rounded-[14px] border border-[#e1e5ee] bg-white px-[15px] transition focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/[.08]">
                {Icon && <Icon className="shrink-0 text-brand-muted" />}
                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    className="h-full w-full border-none bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9aa1aa]"
                />
            </div>
        </div>
    );
}

export default FormField;
