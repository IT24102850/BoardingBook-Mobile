import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Building2, Flag, BarChart3, Activity, Shield, Zap } from 'lucide-react';

export default function AdministrationMonitoring() {
  const [filter, setFilter] = useState('All');

  const metrics = [
    { label: 'Platform Health', value: '98%', icon: <Activity size={20} />, color: 'bg-green-900/30 text-green-400', trend: '↑ +2%' },
    { label: 'Active Listings', value: '156', icon: <Building2 size={20} />, color: 'bg-blue-900/30 text-blue-400', trend: '↑ +12' },
    { label: 'Verified Owners', value: '89%', icon: <Shield size={20} />, color: 'bg-indigo-900/30 text-indigo-400', trend: '↑ +5%' },
    { label: 'Response Time', value: '340ms', icon: <Zap size={20} />, color: 'bg-cyan-900/30 text-cyan-400', trend: '↓ -45ms' },
    { label: 'Complaints Pending', value: '12', icon: <AlertTriangle size={20} />, color: 'bg-amber-900/30 text-amber-400', trend: '↓ -3' },
    { label: 'System Uptime', value: '99.9%', icon: <CheckCircle size={20} />, color: 'bg-emerald-900/30 text-emerald-400', trend: 'Stable' },
  ];

  const systemAlerts = [
    { type: 'warning', title: 'High Payment Processing Delay', description: 'Payment gateway experiencing 2-5 min delays', time: '12m ago', icon: '⚠️' },
    { type: 'critical', title: 'Suspicious Activity Detected', description: '3 accounts flagged for fraudulent bookings', time: '28m ago', icon: '🚨' },
    { type: 'info', title: 'Scheduled Maintenance', description: 'Database optimization scheduled for 2:00 AM', time: '1h ago', icon: 'ℹ️' },
    { type: 'success', title: 'KYC Batch Processed', description: '47 applications verified successfully', time: '2h ago', icon: '✓' },
  ];

  const reportsData = [
    { id: 1, type: 'Fraud Report', count: 8, pending: 2, resolved: 6, status: 'In Review' },
    { id: 2, type: 'Property Issue', count: 15, pending: 5, resolved: 10, status: 'Investigating' },
    { id: 3, type: 'User Complaint', count: 23, pending: 8, resolved: 15, status: 'In Progress' },
    { id: 4, type: 'Payment Dispute', count: 6, pending: 2, resolved: 4, status: 'Resolved' },
  ];

  const filteredReports = filter === 'All' ? reportsData : reportsData.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-[#181f36] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#818cf8] to-[#22d3ee] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(129,140,248,0.3)]">
                <BarChart3 size={22} className="text-white" />
              </div>
              Administration & Monitoring
            </h1>
            <p className="text-slate-400 mt-2">Real-time platform oversight and system performance monitoring</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-green-400 text-sm font-semibold">System Online</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-[#1e2436] border border-[rgba(129,140,248,0.15)] rounded-xl p-4 shadow-sm hover:border-[rgba(129,140,248,0.3)] transition-colors">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${m.color} mb-3`}>
                {m.icon}
              </div>
              <p className="text-xs text-slate-400 font-medium mb-1">{m.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{m.value}</p>
                <p className="text-[11px] text-slate-500">{m.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts Section */}
        <div className="bg-[#1e2436] border border-[rgba(129,140,248,0.15)] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-400" />
            System Alerts & Notifications
          </h2>
          <div className="space-y-3">
            {systemAlerts.map((alert, i) => (
              <div key={i} className={`p-4 rounded-lg border ${
                alert.type === 'critical' ? 'bg-red-900/10 border-red-500/30' :
                alert.type === 'warning' ? 'bg-amber-900/10 border-amber-500/30' :
                alert.type === 'success' ? 'bg-green-900/10 border-green-500/30' :
                'bg-blue-900/10 border-blue-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl pt-0.5">{alert.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{alert.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.description}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 flex-shrink-0">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reports & Complaints Management */}
        <div className="bg-[#1e2436] border border-[rgba(129,140,248,0.15)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flag size={20} className="text-purple-400" />
              Reports & Complaints
            </h2>
            <div className="flex gap-2 flex-wrap">
              {['All', 'In Review', 'Investigating', 'In Progress', 'Resolved'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f 
                      ? 'bg-[rgba(129,140,248,0.2)] text-white' 
                      : 'bg-[#232b47] text-slate-400 hover:text-white'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgba(129,140,248,0.05)] border-b border-[rgba(129,140,248,0.15)]">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Report Type</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Total</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Pending</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Resolved</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(r => (
                  <tr key={r.id} className="border-b border-[rgba(129,140,248,0.08)] hover:bg-[rgba(129,140,248,0.04)] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-white">{r.type}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-300 font-bold">{r.count}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-900/30 text-amber-400 rounded-full text-xs font-semibold">
                        <Clock size={12} />
                        {r.pending}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-semibold">
                        <CheckCircle size={12} />
                        {r.resolved}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                        r.status === 'Resolved' ? 'bg-green-900/30 text-green-400' :
                        r.status === 'In Review' ? 'bg-blue-900/30 text-blue-400' :
                        r.status === 'In Progress' ? 'bg-purple-900/30 text-purple-400' :
                        'bg-orange-900/30 text-orange-400'
                      }`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors">
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Verification Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#1e2436] border border-[rgba(129,140,248,0.15)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Shield size={16} className="text-indigo-400" />
              Admin Verification
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-slate-400">KYC Approvals</span>
                  <span className="text-xs font-bold text-indigo-400">89%</span>
                </div>
                <div className="h-2 bg-[#232b47] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: '89%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Property Verification</span>
                  <span className="text-xs font-bold text-emerald-400">76%</span>
                </div>
                <div className="h-2 bg-[#232b47] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Document Review</span>
                  <span className="text-xs font-bold text-cyan-400">94%</span>
                </div>
                <div className="h-2 bg-[#232b47] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1e2436] border border-[rgba(129,140,248,0.15)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-amber-400" />
              Key Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Avg. Resolution Time</span>
                <span className="text-sm font-bold text-slate-300">2.4 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Complaint Satisfaction</span>
                <span className="text-sm font-bold text-emerald-400">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">False Reports Rate</span>
                <span className="text-sm font-bold text-amber-400">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Repeat Offenders</span>
                <span className="text-sm font-bold text-red-400">23</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1e2436] border border-[rgba(129,140,248,0.15)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-purple-400" />
              User Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Active Users (24h)</span>
                <span className="text-sm font-bold text-slate-300">2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">New Registrations</span>
                <span className="text-sm font-bold text-blue-400">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Banned Accounts</span>
                <span className="text-sm font-bold text-red-400">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Under Review</span>
                <span className="text-sm font-bold text-amber-400">15</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
