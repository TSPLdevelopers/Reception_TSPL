function EntryCard({ icon: Icon, title, subtitle, children, className = "" }) {
    return (
        <div className={`w-full max-w-[620px] rounded-[24px] border border-[#e7eaf0] bg-white p-[38px] shadow-[0_18px_45px_rgba(15,23,42,.08)] max-[680px]:p-7 ${className}`}>
            {Icon && (
                <div className="mb-[25px] flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#f9edf5] text-2xl text-brand">
                    <Icon />
                </div>
            )}
            <h2 className="mb-2.5 text-[28px] font-bold text-[#111827] max-[520px]:text-2xl">{title}</h2>
            {subtitle && <p className="mb-8 text-[15px] leading-6 text-[#7a8aa0]">{subtitle}</p>}
            {children}
        </div>
    );
}

export default EntryCard;
