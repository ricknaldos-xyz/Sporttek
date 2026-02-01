'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { getCategoryLabel, SEVERITY_CONFIG, type Severity } from '@/lib/analysis-constants'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface Issue {
  category: string
  severity: string
}

interface CategoryBreakdownProps {
  issues: Issue[]
}

function getBarColor(score: number): string {
  if (score >= 9) return '#10b981' // emerald-500
  if (score >= 7) return '#22c55e' // green-500
  if (score >= 5) return '#eab308' // yellow-500
  return '#ef4444' // red-500
}

export function CategoryBreakdown({ issues }: CategoryBreakdownProps) {
  if (issues.length === 0) return null

  // Group by category and compute a "health score"
  const categoryMap = new Map<string, number>()

  for (const issue of issues) {
    const weight = SEVERITY_CONFIG[issue.severity as Severity]?.weight ?? 1
    const current = categoryMap.get(issue.category) ?? 0
    categoryMap.set(issue.category, current + weight)
  }

  const data = Array.from(categoryMap.entries())
    .map(([category, deduction]) => {
      const { label } = getCategoryLabel(category)
      const score = Math.max(0, 10 - deduction)
      return { category: label, score, fullMark: 10 }
    })
    .sort((a, b) => a.score - b.score)

  return (
    <GlassCard intensity="light" padding="lg">
      <h2 className="font-semibold mb-4">Desglose por categoria</h2>
      <div style={{ width: '100%', height: data.length * 48 + 20 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, 10]} hide />
            <YAxis
              type="category"
              dataKey="category"
              width={140}
              tick={{ fontSize: 13, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: string) => value.length > 15 ? value.slice(0, 15) + '...' : value}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.score)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
