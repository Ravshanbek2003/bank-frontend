import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getChanges } from '../api/client'
import type { ChangeStatus } from '../api/types'
import { useApi } from '../hooks/useApi'
import { CATEGORY_LABELS, timeAgo } from '../lib/format'
import {
   BankAvatar,
   CategoryBadge,
   CountPill,
   EmptyState,
   ErrorBox,
   Loading,
   Pagination,
   StatusBadge,
} from '../components/ui'
import { CheckCircle2 } from '../components/icons'

const STATUS_TABS: Array<{ key: string; label: string }> = [
   { key: '', label: 'Barchasi' },
   { key: 'pending', label: 'Yangi' },
   { key: 'reviewed', label: "Ko'rib chiqilgan" },
   { key: 'dismissed', label: 'Rad etilgan' },
]

const CATEGORY_TABS: Array<{ key: string; label: string }> = [
   { key: '', label: 'Barcha bo\'limlar' },
   { key: 'credits', label: CATEGORY_LABELS.credits },
   { key: 'deposits', label: CATEGORY_LABELS.deposits },
   { key: 'tariffs', label: CATEGORY_LABELS.tariffs },
   { key: 'transfers', label: CATEGORY_LABELS.transfers },
]

export const ChangesPage = () => {
   const [status, setStatus] = useState('')
   const [category, setCategory] = useState('')
   const [page, setPage] = useState(1)
   const navigate = useNavigate()

   const { data, loading, error } = useApi(
      () =>
         getChanges({
            status: status || undefined,
            category: category || undefined,
            page,
            limit: 15,
         }),
      [status, category, page],
   )

   return (
      <div>
         <div className="page-title">Aniqlangan o'zgarishlar</div>
         <div className="page-sub">
            AI-agent tomonidan aniqlangan tarif o'zgarishlari. Har birini ochib,
            aynan nima o'zgarganini ko'ring va holatini belgilang.
         </div>

         <div className="toolbar">
            <div className="tabs">
               {STATUS_TABS.map(t => (
                  <button
                     key={t.key}
                     className={`tab ${status === t.key ? 'tab--active' : ''}`}
                     onClick={() => {
                        setStatus(t.key)
                        setPage(1)
                     }}
                  >
                     {t.label}
                  </button>
               ))}
            </div>
            <div className="toolbar__spacer" />
            <select
               className="select"
               value={category}
               onChange={e => {
                  setCategory(e.target.value)
                  setPage(1)
               }}
            >
               {CATEGORY_TABS.map(c => (
                  <option key={c.key} value={c.key}>
                     {c.label}
                  </option>
               ))}
            </select>
         </div>

         {loading ? (
            <Loading />
         ) : error ? (
            <ErrorBox message={error} />
         ) : !data || data.data.length === 0 ? (
            <div className="card">
               <EmptyState
                  icon={<CheckCircle2 size={40} strokeWidth={1.5} />}
                  title="O'zgarish topilmadi"
                  hint="Ushbu filtr bo'yicha aniqlangan o'zgarishlar yo'q"
               />
            </div>
         ) : (
            <>
               <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="table-wrap">
                     <table className="table table--clickable">
                        <thead>
                           <tr>
                              <th>Bank</th>
                              <th>Bo'lim</th>
                              <th>O'zgargan nuqtalar</th>
                              <th>Holat</th>
                              <th className="right">Aniqlangan</th>
                           </tr>
                        </thead>
                        <tbody>
                           {data.data.map(c => (
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
                                    <div
                                       className="row-flex"
                                       style={{ gap: 6, flexWrap: 'wrap' }}
                                    >
                                       <CountPill n={c.counts.added} type="added" />
                                       <CountPill
                                          n={c.counts.modified}
                                          type="modified"
                                       />
                                       <CountPill n={c.counts.removed} type="removed" />
                                    </div>
                                 </td>
                                 <td>
                                    <StatusBadge status={c.status as ChangeStatus} />
                                 </td>
                                 <td className="right muted nowrap">
                                    {timeAgo(c.detectedAt)}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
               <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  total={data.total}
                  onPage={setPage}
               />
            </>
         )}
      </div>
   )
}
