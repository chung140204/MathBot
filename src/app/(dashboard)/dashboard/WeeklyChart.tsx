'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type WeeklyScore = {
  date: string;
  score: number | null;
};

const VN_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

type ChartEntry = { day: string; score: number | null };

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="font-bold text-gray-700">{label}</p>
      <p className="text-[#059669] font-black">{payload[0].value}%</p>
    </div>
  );
}

export default function WeeklyChart({ data }: { data: WeeklyScore[] }) {
  const chartData: ChartEntry[] = data.map((d) => ({
    day: VN_DAYS[new Date(d.date + 'T12:00:00').getDay()],
    score: d.score,
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} barCategoryGap="35%">
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
        />
        <YAxis hide domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf9' }} />
        <Bar
          dataKey="score"
          maxBarSize={36}
          shape={(props: any) => {
            const { x = 0, y = 0, width = 0, height = 0, value } = props;
            const r = Math.min(6, width / 2);
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={r}
                ry={r}
                fill={value == null ? '#e5e7eb' : '#059669'}
                opacity={value == null ? 0.4 : 1}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
