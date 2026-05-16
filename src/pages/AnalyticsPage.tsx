import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useJobs } from '../hooks/useJobs'
import type { ApplicationStatus } from '../types'

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  saved: '#64748b',
  applied: '#3b82f6',
  interviewing: '#a78bfa',
  offer: '#3ecf8e',
  rejected: '#ef4444',
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

const STATUSES: ApplicationStatus[] = [
  'saved',
  'applied',
  'interviewing',
  'offer',
  'rejected',
]

export default function AnalyticsPage() {
  const { jobs, isLoading } = useJobs()

  const statusCounts = useMemo(() => {
    return STATUSES.map((status) => ({
      status: STATUS_LABELS[status],
      count: jobs.filter((j) => j.status === status).length,
      color: STATUS_COLORS[status],
    }))
  }, [jobs])

  const totalApplications = jobs.length
  const interviews = jobs.filter((j) => j.status === 'interviewing').length
  const offers = jobs.filter((j) => j.status === 'offer').length
  const applied = jobs.filter((j) =>
    ['applied', 'interviewing', 'offer', 'rejected'].includes(j.status)
  ).length

  const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0
  const offerRate = applied > 0 ? Math.round((offers / applied) * 100) : 0

  const activityByDate = useMemo(() => {
    const counts: Record<string, number> = {}
    jobs.forEach((job) => {
      if (job.date_applied) {
        counts[job.date_applied] = (counts[job.date_applied] || 0) + 1
      }
    })
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        count,
      }))
  }, [jobs])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400 text-sm">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold">Analytics</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Your job search at a glance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Applications</p>
          <p className="text-white text-3xl font-bold">{totalApplications}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Interviews</p>
          <p className="text-blue-400 text-3xl font-bold">{interviews}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Interview Rate</p>
          <p className="text-purple-400 text-3xl font-bold">{interviewRate}%</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Offers</p>
          <p className="text-green-400 text-3xl font-bold">{offerRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-medium text-sm mb-4">
            Applications by Status
          </h3>
          {totalApplications === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-500 text-xs">No applications yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusCounts} barSize={32}>
                <XAxis
                  dataKey="status"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusCounts.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity over time */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-medium text-sm mb-4">
            Application Activity
          </h3>
          {activityByDate.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-500 text-xs">
                No dated applications yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityByDate} barSize={32}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status breakdown list */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 col-span-2">
          <h3 className="text-white font-medium text-sm mb-4">
            Status Breakdown
          </h3>
          <div className="flex flex-col gap-3">
            {STATUSES.map((status) => {
              const count = jobs.filter((j) => j.status === status).length
              const percentage =
                totalApplications > 0
                  ? Math.round((count / totalApplications) * 100)
                  : 0
              return (
                <div key={status} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[status] }}
                  />
                  <span className="text-slate-400 text-xs w-24">
                    {STATUS_LABELS[status]}
                  </span>
                  <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        background: STATUS_COLORS[status],
                      }}
                    />
                  </div>
                  <span className="text-slate-400 text-xs font-mono w-8 text-right">
                    {count}
                  </span>
                  <span className="text-slate-500 text-xs font-mono w-8 text-right">
                    {percentage}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}