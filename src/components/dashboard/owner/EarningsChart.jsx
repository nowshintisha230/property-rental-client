// src/components/dashboard/owner/EarningsChart.jsx
"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

// Build a full 12-month array filling zeros where no data
function buildFullYearData(rawData) {
  const now = new Date();
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 1-indexed
    const label = `${MONTHS[d.getMonth()]} ${year}`;

    const found = rawData.find(
      (r) => r.year === year && r.month === month
    );

    months.push({
      label: MONTHS[d.getMonth()],
      fullLabel: label,
      totalEarnings: found ? found.totalEarnings : 0,
      totalBookings: found ? found.totalBookings : 0,
    });
  }
  return months;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center gap-2 text-xs"
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500 dark:text-gray-400">
            {entry.name === "totalEarnings" ? "Earnings" : "Bookings"}:
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {entry.name === "totalEarnings"
              ? `$${entry.value.toLocaleString()}`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function EarningsChart({ data, loading }) {
  const { isDark } = useTheme();
  const chartData = useMemo(() => buildFullYearData(data || []), [data]);

  const totalEarnings = chartData.reduce(
    (sum, d) => sum + d.totalEarnings,
    0
  );
  const totalBookings = chartData.reduce(
    (sum, d) => sum + d.totalBookings,
    0
  );
  const bestMonth = chartData.reduce(
    (best, d) => (d.totalEarnings > best.totalEarnings ? d : best),
    chartData[0] || {}
  );

  const gridColor = isDark
    ? "rgba(255,255,255,0.05)"
    : "rgba(0,0,0,0.05)";
  const textColor = isDark ? "#9ca3af" : "#6b7280";

  if (loading) {
    return (
      <div className="h-72 animate-pulse flex items-end gap-2 px-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    );
  }

  // Summary pills
  const summaryItems = [
    {
      label: "12-Month Total",
      value: `$${totalEarnings.toLocaleString()}`,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      color:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
    },
    {
      label: "Best Month",
      value: bestMonth.label || "—",
      color:
        "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    },
  ];

  return (
    <div>
      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${item.color}`}
          >
            {item.label}: {item.value}
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="earnings"
            orientation="left"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          />

          <YAxis
            yAxisId="bookings"
            orientation="right"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            formatter={(value) =>
              value === "totalEarnings" ? "Earnings ($)" : "Bookings"
            }
            wrapperStyle={{ fontSize: "12px", color: textColor }}
          />

          <Area
            yAxisId="earnings"
            type="monotone"
            dataKey="totalEarnings"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#earningsGradient)"
            dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#3b82f6" }}
          />

          <Area
            yAxisId="bookings"
            type="monotone"
            dataKey="totalBookings"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#bookingsGradient)"
            dot={{ fill: "#8b5cf6", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#8b5cf6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}