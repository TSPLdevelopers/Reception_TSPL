import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { BRAND, surfaceClass } from "../../theme/classes";

const COLORS = [BRAND.primary, "#9b1b63", "#c04c86", "#e08ab6"];

function EmptyChart({ children }) {
    return <div className="flex h-[260px] items-center justify-center text-center text-sm font-semibold text-[#6b7280]">{children}</div>;
}

function AnalyticsCharts({ categoryData, visitData, dailyVisitData }) {
    return (
        <section id="analytics" className="mt-6 grid scroll-mt-[150px] grid-cols-3 gap-6 max-lg:grid-cols-1">
            <article className={`${surfaceClass} p-6`}>
                <h2 className="text-xl font-bold text-[#111827]">Category Distribution</h2>
                {categoryData.some((item) => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={88} label>
                                {categoryData.map((item, index) => <Cell key={item.name} fill={COLORS[index]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : <EmptyChart>No category data available.</EmptyChart>}
            </article>

            <article className={`${surfaceClass} p-6`}>
                <h2 className="text-xl font-bold text-[#111827]">Top Walk-In Frequency</h2>
                {visitData.length ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={visitData}>
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="visits" fill={BRAND.primary} radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <EmptyChart>No visit frequency data available.</EmptyChart>}
            </article>

            <article className={`${surfaceClass} p-6`}>
                <h2 className="text-xl font-bold text-[#111827]">Daily Walk-In Trend</h2>
                {dailyVisitData.length ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={dailyVisitData}>
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="visits" fill={BRAND.primary} radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <EmptyChart>No daily visit data available.</EmptyChart>}
            </article>
        </section>
    );
}

export default AnalyticsCharts;
