import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getSnapshots } from '../api/client'
import { useApi } from '../hooks/useApi'
import { CATEGORY_LABELS, formatDate } from '../lib/format'
import {
   CategoryBadge,
   EmptyState,
   ErrorBox,
   Loading,
   Pagination,
} from '../components/ui'
import { Layers } from '../components/icons'

const CATEGORY_TABS = [
   { key: '', label: "Barcha bo'limlar" },
   { key: 'credits', label: CATEGORY_LABELS.credits },
   { key: 'deposits', label: CATEGORY_LABELS.deposits },
   { key: 'tariffs', label: CATEGORY_LABELS.tariffs },
   { key: 'transfers', label: CATEGORY_LABELS.transfers },
]

export const SnapshotsPage = () => {
   const [category, setCategory] = useState('')
   const [latestOnly, setLatestOnly] = useState(true)
   const [page, setPage] = useState(1)
   const navigate = useNavigate()

   const { data, loading, error } = useApi(
      () =>
         getSnapshots({
            category: category || undefined,
            latest: latestOnly ? 'true' : undefined,
            page,
            limit: 20,
         }),
      [category, latestOnly, page],
   )

   return (
      <div>
         <div className="page-title">Snapshotlar</div>
         <div className="page-sub">
            Har bir skanerlashda yig'ilgan ma'lumot holatlari. O'zgarishlar shu
            holatlarni taqqoslash orqali aniqlanadi.
         </div>

         <div className="toolbar">
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
            <label className="chip" style={{ cursor: 'pointer' }}>
               <input
                  type="checkbox"
                  checked={latestOnly}
                  onChange={e => {
                     setLatestOnly(e.target.checked)
                     setPage(1)
                  }}
               />
               Faqat oxirgi holat
            </label>
         </div>

         {loading ? (
            <Loading />
         ) : error ? (
            <ErrorBox message={error} />
         ) : !data || data.data.length === 0 ? (
            <div className="card">
               <EmptyState
                  icon={<Layers size={40} strokeWidth={1.5} />}
                  title="Snapshot topilmadi"
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
                              <th>Yozuvlar</th>
                              <th>Manba turi</th>
                              <th className="right">Yig'ilgan</th>
                           </tr>
                        </thead>
                        <tbody>
                           {data.data.map(s => (
                              <tr
                                 key={s._id}
                                 onClick={() => navigate(`/snapshots/${s._id}`)}
                              >
                                 <td>
                                    <strong>{s.bankSlug.toUpperCase()}</strong>
                                 </td>
                                 <td>
                                    <CategoryBadge category={s.category} />
                                 </td>
                                 <td>
                                    <span className="badge badge--gray">
                                       {s.itemsCount} yozuv
                                    </span>
                                 </td>
                                 <td>
                                    <span className="mono muted">
                                       {s.sourceType.toUpperCase()}
                                    </span>
                                 </td>
                                 <td className="right muted nowrap">
                                    {formatDate(s.fetchedAt)}
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
