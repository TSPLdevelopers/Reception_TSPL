function EntryProgress({ currentStep }) {
    const progress = (currentStep / 5) * 100;

    return (
        <div className="flex flex-col items-end max-[680px]:items-start">
            <span className="text-[12px] font-bold uppercase tracking-[.8px] text-[#374151]">Step {currentStep} of 5</span>
            <div className="my-2 h-2 w-[180px] overflow-hidden rounded-full bg-[#e5e7eb]">
                <div className="h-full rounded-full bg-gradient-to-r from-brand to-[#a40061] transition-all duration-[400ms]" style={{ width: `${progress}%` }} />
            </div>
            <small className="text-[13px] font-medium text-[#6b7a90]">{progress}% Completed</small>
        </div>
    );
}

export default EntryProgress;
