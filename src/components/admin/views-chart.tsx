"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ViewsChartProps {
  data: { bulan: string; views: number }[]
}

interface TooltipPayloadItem {
  value: number
  name: string
  payload: { bulan: string; views: number }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  isDark?: boolean
}

function CustomTooltip({ active, payload, label, isDark }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const views = payload[0]?.value ?? 0
    return (
      <div
        style={{
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          border: `1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`,
          borderRadius: "12px",
          padding: "10px 14px",
          boxShadow: isDark
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(52, 211, 153, 0.15)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.12)",
          minWidth: "140px",
        }}
      >
        <p
          style={{
            color: isDark ? "#94a3b8" : "#64748b",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: "0 0 4px 0",
          }}
        >
          Bulan {label}
        </p>
        <p
          style={{
            color: isDark ? "#f8fafc" : "#0f172a",
            fontSize: "16px",
            fontWeight: 800,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isDark ? "#34d399" : "#10b981",
              display: "inline-block",
              boxShadow: isDark ? "0 0 8px #34d399" : "none",
            }}
          />
          {views.toLocaleString("id-ID")}{" "}
          <span
            style={{
              color: isDark ? "#34d399" : "#059669",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            Views
          </span>
        </p>
      </div>
    )
  }
  return null
}

export function ViewsChart({ data }: ViewsChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  // Palet Hijau Zamrud / Emerald yang segar, kontras tinggi, dan tidak gelap
  const barGradientTop = isDark ? "#34d399" : "#10b981"    // Emerald-400 / Emerald-500
  const barGradientBottom = isDark ? "#059669" : "#047857" // Emerald-600 / Emerald-700
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
  const tickColor = isDark ? "#cbd5e1" : "#475569"         // Slate-300 vs Slate-600
  const cursorHighlight = isDark ? "rgba(52, 211, 153, 0.12)" : "rgba(16, 185, 129, 0.1)"

  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart
        data={data}
        margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id="viewsEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={barGradientTop} stopOpacity={1} />
            <stop offset="100%" stopColor={barGradientBottom} stopOpacity={0.85} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridColor}
          vertical={false}
        />

        <XAxis
          dataKey="bulan"
          tick={{ fontSize: 11, fill: tickColor, fontWeight: 600 }}
          tickLine={false}
          axisLine={{ stroke: gridColor }}
        />

        <YAxis
          tick={{ fontSize: 11, fill: tickColor, fontWeight: 600 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          domain={[0, "auto"]}
        />

        <Tooltip
          content={<CustomTooltip isDark={isDark} />}
          cursor={{ fill: cursorHighlight, radius: 8 }}
        />

        <Bar
          dataKey="views"
          name="Views"
          fill="url(#viewsEmeraldGrad)"
          radius={[8, 8, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
