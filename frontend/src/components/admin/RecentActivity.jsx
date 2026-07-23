import { FaClock } from "react-icons/fa";
import { surfaceClass } from "../../theme/classes";

function RecentActivity({ activities }) {
    return (
        <section className={`${surfaceClass} mt-6 p-7`}>
            <h2 className="text-xl font-bold text-[#111827]">Recent Activity</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Latest walk-in check-ins</p>

            {activities.length ? (
                <div className="mt-6 grid grid-cols-3 gap-x-10 gap-y-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
                    {activities.map((activity) => (
                        <article key={activity.id} className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-brand-soft text-brand"><FaClock /></div>
                            <div className="min-w-0">
                                <h3 className="truncate text-[15px] font-bold text-[#111827]">{activity.name}</h3>
                                <p className="mt-1 truncate text-sm capitalize text-[#6b7280]">{activity.category} · {activity.reason}</p>
                                <span className="mt-1 block text-xs font-semibold text-[#374151]">{new Date(activity.time).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                        </article>
                    ))}
                </div>
            ) : <p className="py-10 text-center text-sm font-semibold text-[#6b7280]">No recent activity found.</p>}
        </section>
    );
}

export default RecentActivity;
