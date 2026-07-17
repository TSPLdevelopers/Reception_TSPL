import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

function SearchableSelect({
    label,
    value,
    options,
    onChange,
    placeholder = "Select an option",
    icon: Icon,
    disabled = false,
    renderOption,
    renderValue,
    className = ""
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef(null);

    const selectedOption = useMemo(
        () => options.find((option) => option.value === value),
        [options, value]
    );

    const filteredOptions = useMemo(() => {
        const cleanSearch = search.trim().toLowerCase();

        if (!cleanSearch) return options;

        return options.filter((option) => {
            const searchableText = [
                option.label,
                option.value,
                option.callingCode,
                option.searchText
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(cleanSearch);
        });
    }, [options, search]);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", closeOnOutsideClick);

        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
        };
    }, []);

    const chooseOption = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {label && (
                <label className="mb-2 block text-[13px] font-bold text-[#4b5563]">
                    {label}
                </label>
            )}

            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((current) => !current)}
                className="flex h-[52px] w-full items-center gap-3 rounded-[14px] border border-[#e1e5ee] bg-white px-[15px] text-left text-[15px] text-[#111827] transition focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(115,0,66,.08)] disabled:cursor-not-allowed disabled:bg-[#f4f5f7] disabled:text-[#9ca3af]"
            >
                {Icon && <Icon className="shrink-0 text-brand-muted" />}

                <span className="min-w-0 flex-1 truncate">
                    {selectedOption
                        ? renderValue
                            ? renderValue(selectedOption)
                            : selectedOption.label
                        : <span className="text-[#8a8f98]">{placeholder}</span>}
                </span>

                <FaChevronDown
                    className={`shrink-0 text-xs text-brand-muted transition ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-[250] mt-2 w-full overflow-hidden rounded-[16px] border border-[#e1e5ee] bg-white shadow-[0_18px_45px_rgba(15,23,42,.16)]">
                    <div className="border-b border-[#eef0f4] p-3">
                        <div className="flex h-11 items-center gap-3 rounded-[12px] border border-[#e1e5ee] px-3 focus-within:border-brand focus-within:ring-[3px] focus-within:ring-[rgba(115,0,66,.08)]">
                            <FaSearch className="shrink-0 text-brand-muted" />
                            <input
                                autoFocus
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search..."
                                className="h-full w-full border-none bg-transparent text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-2">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => chooseOption(option)}
                                    className={`flex w-full items-center rounded-[12px] px-3 py-3 text-left text-sm transition hover:bg-[#faf4f8] hover:text-brand ${
                                        option.value === value
                                            ? "bg-brand-soft font-semibold text-brand"
                                            : "text-[#374151]"
                                    }`}
                                >
                                    {renderOption
                                        ? renderOption(option)
                                        : option.label}
                                </button>
                            ))
                        ) : (
                            <p className="px-3 py-6 text-center text-sm font-semibold text-[#6b7280]">
                                No matching option found
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchableSelect;
