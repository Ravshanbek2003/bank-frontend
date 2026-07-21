import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getDashboard, triggerScan } from '../api/client'
import { useApi } from '../hooks/useApi'
import { formatDate, timeAgo } from '../lib/format'
import {
   BankAvatar,
   CategoryBadge,
   CountPill,
   Card,
   EmptyState,
   ErrorBox,
   Loading,
   StatusBadge,
} from '../components/ui'
import {
   Bell,
   Camera,
   CategoryIcon,
   CheckCircle2,
   Landmark,
   Radar,
   RefreshCw,
   Search,
} from '../components/icons'

const STAT_STYLES = [
   { bg: 'var(--accent-soft)', color: 'var(--navy-600)', Icon: Landmark },
   { bg: 'var(--amber-soft)', color: 'var(--amber)', Icon: Bell },
   { bg: 'var(--green-soft)', color: 'var(--green)', Icon: Camera },
   { bg: 'var(--violet-soft)', color: 'var(--violet)', Icon: Radar },
]

export const DashboardPage = () => {
   const { data, loading, error, reload } = useApi(getDashboard, [])
   const [scanning, setScanning] = useState(false)
   const navigate = useNavigate()

   const runScan = async () => {
      setScanning(true)
      try {
         await triggerScan()
         reload()
      } finally {
         setScanning(false)
      }
   }

   if (loading) return <Loading label="Yuklanmoqda..." />
   if (error) return <ErrorBox message={error} />
   if (!data) return null

   const { totals, changesByCategory, recentChanges, topBanksByChanges, lastScan } =
      data
   const maxCat = Math.max(1, ...changesByCategory.map(c => c.count))

   const stats = [
      {
         value: totals.banksActive,
         label: 'Faol banklar',
         hint: `Jami ${totals.banksTotal} ta`,
      },
      {
         value: totals.pendingChanges,
         label: "Yangi o'zgarishlar",
         hint: `Jami ${totals.changes} ta aniqlangan`,
      },
      {
         value: totals.snapshots,
         label: 'Snapshotlar',
         hint: "Yig'ilgan holatlar",
      },
      {
         value: totals.monitoredSources,
         label: 'Kuzatilayotgan manba',
         hint: '4 kategoriya bo\'yicha',
      },
   ]

   return (
      <div>
         <div className="toolbar">
            <div>
               <div className="page-title">Umumiy holat</div>
               <div className="muted" style={{ fontSize: 14 }}>
                  Oxirgi skanerlash: {lastScan ? timeAgo(lastScan.startedAt) : '—'}
               </div>
            </div>
            <div className="toolbar__spacer" />
            <button
               className="btn btn--primary"
               onClick={runScan}
               disabled={scanning}
            >
               {scanning ? (
                  <>
                     <RefreshCw size={16} className="spin" /> Skanerlanmoqda...
                  </>
               ) : (
                  <>
                     <Search size={16} /> Hozir skanerlash
                  </>
               )}
            </button>
         </div>

         <div className="stats-grid">
            {stats.map((s, i) => {
               const Icon = STAT_STYLES[i].Icon
               return (
               <div className="stat" key={i}>
                  <div
                     className="stat__icon"
                     style={{ background: STAT_STYLES[i].bg, color: STAT_STYLES[i].color }}
                  >
                     <Icon size={22} strokeWidth={2} />
                  </div>
                  <div className="stat__value">{s.value}</div>
                  <div className="stat__label">{s.label}</div>
                  <div className="stat__hint">{s.hint}</div>
               </div>
               )
            })}
         </div>

         <div className="grid-2">
            <Card
               title="So'nggi o'zgarishlar"
               action={
                  <Link to="/changes" className="link">
                     Barchasi →
                  </Link>
               }
               noPad
            >
               {recentChanges.length === 0 ? (
                  <EmptyState
                     icon={<CheckCircle2 size={40} strokeWidth={1.5} />}
                     title="Hozircha o'zgarish aniqlanmadi"
                     hint="Banklar tariflari kuzatilmoqda"
                  />
               ) : (
                  <div className="table-wrap">
                     <table className="table table--clickable">
                        <thead>
                           <tr>
                              <th>Bank</th>
                              <th>Bo'lim</th>
                              <th>O'zgarishlar</th>
                              <th>Holat</th>
                              <th className="right">Vaqt</th>
                           </tr>
                        </thead>
                        <tbody>
                           {recentChanges.map(c => (
                              <tr
                                 key={c._id}
                                 onClick={() => navigate(`/changes/${c._id}`)}
                              >
                                 <td>
                                    <div className="row-flex">
                                       <BankAvatar name={c.bankName} />
                                       <strong>{c.bankName}</strong>
                                    </div>
                                 </td>
                                 <td>
                                    <CategoryBadge category={c.category} />
                                 </td>
                                 <td>
                                    <div className="row-flex" style={{ gap: 6 }}>
                                       <CountPill n={c.counts.added} type="added" />
                                       <CountPill n={c.counts.modified} type="modified" />
                                       <CountPill n={c.counts.removed} type="removed" />
                                    </div>
                                 </td>
                                 <td>
                                    <StatusBadge status={c.status} />
                                 </td>
                                 <td className="right muted nowrap">
                                    {timeAgo(c.detectedAt)}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
               <Card title="Kategoriyalar bo'yicha">
                  <div className="bars">
                     {changesByCategory.map(c => (
                        <div className="bar-row" key={c.category}>
                           <div className="row-flex" style={{ gap: 7 }}>
                              <CategoryIcon category={c.category} size={15} />
                              {c.label_uz}
                           </div>
                           <div className="bar-track">
                              <div
                                 className="bar-fill"
                                 style={{ width: `${(c.count / maxCat) * 100}%` }}
                              />
                           </div>
                           <div className="right" style={{ fontWeight: 700 }}>
                              {c.count}
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>

               <Card title="Eng ko'p o'zgargan banklar">
                  {topBanksByChanges.length === 0 ? (
                     <div className="muted" style={{ fontSize: 13 }}>
                        Ma'lumot yo'q
                     </div>
                  ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {topBanksByChanges.map(b => (
                           <div className="row-flex" key={b.bankSlug}>
                              <BankAvatar name={b.bankName} />
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontWeight: 600, fontSize: 14 }}>
                                    {b.bankName}
                                 </div>
                                 <div className="faint" style={{ fontSize: 12 }}>
                                    {b.pending} ta yangi
                                 </div>
                              </div>
                              <span className="badge badge--gray">{b.count}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </Card>

               {lastScan && (
                  <Card title="Oxirgi skanerlash">
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                        <Row label="Sana" value={formatDate(lastScan.startedAt)} />
                        <Row
                           label="Turi"
                           value={
                              lastScan.trigger === 'cron'
                                 ? 'Avtomatik'
                                 : lastScan.trigger === 'manual'
                                   ? 'Qo\'lda'
                                   : 'Ishga tushishda'
                           }
                        />
                        <Row label="Tekshirildi" value={`${lastScan.totalTargets} ta`} />
                        <Row
                           label="O'zgargan"
                           value={`${lastScan.changed} ta`}
                        />
                        <Row
                           label="Xatolar"
                           value={`${lastScan.failed} ta`}
                        />
                     </div>
                  </Card>
               )}
            </div>
         </div>
      </div>
   )
}

const Row = ({ label, value }: { label: string; value: string }) => (
   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="muted">{label}</span>
      <strong>{value}</strong>
   </div>
)
