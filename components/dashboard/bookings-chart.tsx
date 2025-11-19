"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface BookingsChartPoint {
  date: string;
  count: number;
}

export function BookingsChart({ data }: { data: BookingsChartPoint[] }) {
  return (
    <ChartContainer
      config={{
        bookings: {
          label: "Bookings",
          color: "#000000",
        },
      }}
      className="w-full h-64"
    >
      <LineChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="var(--color-bookings, #000000)"
          strokeWidth={2}
          dot={{ r: 2 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
