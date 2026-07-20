import { FaClipboardList, FaPenAlt, FaUserTie } from "react-icons/fa";
import ActionButton from "../ui/ActionButton";
import EntryCard from "../ui/EntryCard";
import FormField from "../ui/FormField";

function VisitStep({ visitData, setVisitData, createVisit, isSubmitting }) {
    return (
        <EntryCard
            icon={FaClipboardList}
            title="Walk-In Details"
            subtitle="Please provide Walk-In purpose and the person you want to meet."
        >
            <div className="space-y-5">
                <FormField
                    label="Reason for Walk-In"
                    icon={FaPenAlt}
                    value={visitData.reason}
                    onChange={(reason) =>
                        setVisitData({ ...visitData, reason })
                    }
                    placeholder="Meeting, Interview, Delivery..."
                    required
                />

                <FormField
                    label="Whom To Meet"
                    icon={FaUserTie}
                    value={visitData.whomToMeet}
                    onChange={(whomToMeet) =>
                        setVisitData({ ...visitData, whomToMeet })
                    }
                    placeholder="Person / Department name"
                    required
                />

                <div className="rounded-[14px] border border-[rgba(115,0,66,.12)] bg-[#f8f4f7] px-4 py-3.5 text-sm font-bold text-brand">
                    Your arrival date and time will be recorded automatically.
                </div>

                <ActionButton onClick={createVisit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Walk-In →"}
                </ActionButton>
            </div>
        </EntryCard>
    );
}

export default VisitStep;
