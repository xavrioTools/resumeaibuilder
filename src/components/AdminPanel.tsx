import React, { useState } from 'react';
import { 
  Users, Layers, CreditCard, BarChart3, Cpu, 
  Search, TrendingUp, Download, ShieldCheck 
} from 'lucide-react';
import { resumeTemplates } from '../data/templates';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'templates' | 'ai-usage' | 'payments' | 'downloads'>('analytics');
  const [searchUser, setSearchUser] = useState('');

  const usersList = [
    { id: 'usr-1', name: 'Sophia Martinez', email: 'sophia.martinez@resumeforge.design', plan: 'Unlimited Pro', resumes: 4, downloads: 18, lastActive: '5 mins ago' },
    { id: 'usr-2', name: 'David Lin', email: 'david.lin@cloudeng.com', plan: 'Unlimited Pro', resumes: 2, downloads: 12, lastActive: '45 mins ago' },
    { id: 'usr-3', name: 'Marcus Bell', email: 'marcus.design@bell.studio', plan: 'Free', resumes: 1, downloads: 5, lastActive: '2 hours ago' },
    { id: 'usr-4', name: 'Elena Rostova', email: 'elena@quantumai.dev', plan: 'Unlimited Pro', resumes: 3, downloads: 21, lastActive: 'Yesterday' },
    { id: 'usr-5', name: 'Liam O Connor', email: 'liam@fintechlabs.io', plan: 'Free', resumes: 1, downloads: 3, lastActive: '2 days ago' },
  ];

  const filteredUsers = usersList.filter(
    (u) => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F0FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#7B61FF]">
            Platform Governance
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            ResumeForge AI Admin Panel
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            System analytics, Gemini 3.8 Flash token telemetry, template inventory, and user metrics.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-[#E9DEFF] dark:border-slate-800 rounded-2xl overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'users', label: 'Users Directory', icon: Users },
            { id: 'templates', label: 'Templates (112)', icon: Layers },
            { id: 'ai-usage', label: 'AI Token Tracking', icon: Cpu },
            { id: 'downloads', label: 'Downloads Activity', icon: Download },
            { id: 'payments', label: 'Payments & Revenue', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id
                    ? 'canva-gradient-bg text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
                <div className="text-xs font-bold text-slate-500">Monthly Recurring Revenue</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">$48,240</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+24.6% vs previous month</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
                <div className="text-xs font-bold text-slate-500">Active Candidates</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">24,890</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">+1,840 this week</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
                <div className="text-xs font-bold text-slate-500">Average ATS Parser Score</div>
                <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">98.2%</div>
                <div className="text-[11px] text-slate-500 mt-1">Across all 112 templates</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
                <div className="text-xs font-bold text-slate-500">AI Parsing Accuracy</div>
                <div className="text-2xl font-black text-[#7B61FF] mt-1 tabular-nums">99.8%</div>
                <div className="text-[11px] text-slate-500 mt-1">Gemini 3.8 Flash Engine</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white">Template Category Popularity</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { cat: 'Modern Canva Side Panels', pct: '38%', color: '#7B61FF' },
                    { cat: 'Executive Classic & Luxury', pct: '26%', color: '#0B5FFF' },
                    { cat: 'Developer & Engineering', pct: '22%', color: '#0284C7' },
                    { cat: 'Creative Designer Grids', pct: '14%', color: '#45D6FF' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{item.cat}</span>
                        <span className="tabular-nums">{item.pct}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: item.pct, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white">Recent System Events</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <div><span className="font-bold">Pro Membership:</span> Sophia Martinez upgraded to Lifetime</div>
                    <span className="text-slate-400 tabular-nums">12m ago</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <div><span className="font-bold">ATS Audit Engine:</span> Synchronized Workday 2026 guidelines</div>
                    <span className="text-slate-400 tabular-nums">2h ago</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <div><span className="font-bold">Templates Added:</span> 12 new Canva-inspired startup layouts</div>
                    <span className="text-slate-400 tabular-nums">5h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E9DEFF] dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter users by name or email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div className="text-xs font-bold text-slate-500">
                {filteredUsers.length} total users
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F4FF] dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">Tier</th>
                  <th className="px-5 py-3 text-right">Resumes</th>
                  <th className="px-5 py-3 text-right">Downloads</th>
                  <th className="px-5 py-3 text-right">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">
                      <div>{u.name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E9DEFF] text-[#7B61FF]">
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">{u.resumes}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-bold">{u.downloads}</td>
                    <td className="px-5 py-3 text-right text-slate-400 tabular-nums">{u.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. TEMPLATES INVENTORY */}
        {activeTab === 'templates' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Active Template Library ({resumeTemplates.length} Free Blueprints)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resumeTemplates.slice(0, 9).map((t) => (
                <div key={t.id} className="p-3 bg-[#F8F4FF] dark:bg-slate-800 rounded-2xl border border-[#E9DEFF] dark:border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{t.name}</span>
                    <span className="text-emerald-600 tabular-nums">{t.atsScore}% ATS</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{t.category} · {t.layoutMode}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. AI USAGE */}
        {activeTab === 'ai-usage' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-6 space-y-6">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Gemini 3.8 Flash Consumption Telemetry</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#F8F4FF] dark:bg-slate-800 rounded-2xl">
                <div className="text-slate-500">Tokens Processed (30 Days)</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">14.8M</div>
                <div className="text-[11px] text-emerald-600 mt-1">Cost optimal</div>
              </div>
              <div className="p-4 bg-[#F8F4FF] dark:bg-slate-800 rounded-2xl">
                <div className="text-slate-500">Average P95 Latency</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">490ms</div>
                <div className="text-[11px] text-slate-500 mt-1">Sub-second streaming</div>
              </div>
              <div className="p-4 bg-[#F8F4FF] dark:bg-slate-800 rounded-2xl">
                <div className="text-slate-500">Active AI Endpoints</div>
                <div className="text-2xl font-black text-[#7B61FF] mt-1 tabular-nums">13 Routes</div>
                <div className="text-[11px] text-slate-500 mt-1">Cover letter, matcher, quality score</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PAYMENTS & DOWNLOADS */}
        {(activeTab === 'payments' || activeTab === 'downloads') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Transactions & Activity Logs</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {[
                { user: 'Sophia Martinez', item: 'Lifetime Unlimited Pass', amount: '$49.00', date: 'Today, 09:15' },
                { user: 'David Lin', item: 'Monthly Pro Subscription', amount: '$12.00', date: 'Yesterday' },
                { user: 'Elena Rostova', item: 'Lifetime Unlimited Pass', amount: '$49.00', date: '2 days ago' },
              ].map((tx, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{tx.user}</div>
                    <div className="text-slate-400 text-[11px]">{tx.item} · {tx.date}</div>
                  </div>
                  <div className="text-right font-black text-slate-900 dark:text-white tabular-nums">{tx.amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
