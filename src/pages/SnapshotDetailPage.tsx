import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getSnapshot } from '../api/client'
import type { ScrapedItem } from '../api/types'
import { useApi } from '../hooks/useApi'
import { formatDate } from '../lib/format'
import {
   CategoryBadge,
   Card,
   ErrorBox,
   Loading,
} from '../components/ui'
import { ChevronLeft, ExternalLink, Search } from '../components/icons'

export const SnapshotDetailPage = () => {
   const { id = '' } = useParams()
   const { data, loading, error } = useApi(() => getSnapshot(id), [id])
   const [q, setQ] = useState('')

   const filtered = useMemo(() => {
      const items = data?.items || []
      if (!q.trim()) return items
      const needle = q.toLowerCase()
      return items.filter(
         (i: ScrapedItem) =>
            i.label.toLowerCase().includes(needle) ||
            i.value.toLowerCase().includes(needle) ||
            (i.section || '').toLowerCase().includes(needle),
      )
   }, [data, q])

   if (loading) return <Loading />
   if (error) return <ErrorBox message={error} />
   if (!data) return null

   return (
      <div>
         <Link
            to="/snapshots"
            className="link row-flex"
            style={{ fontSize: 13, gap: 4, display: 'inline-flex' }}
         >
            <ChevronLeft size={15} /> Snapshotlarga qaytish
         </Link>

         <div className="toolbar" style={{ marginTop: 14 }}>
            <div>
               <div className="page-title" style={{ marginBottom: 6 }}>
                  {data.bankSlug.toUpperCase()}
               </div>
               <div className="row-flex" style={{ gap: 8 }}>
                  <CategoryBadge category={data.category} />
                  <span className="badge badge--gray">{data.itemsCount} yozuv</span>
                  <span className="muted" style={{ fontSize: 13 }}>
                     {formatDate(data.fetchedAt)}
                  </span>
               </div>
            </div>
            <div className="toolbar__spacer" />
            <a
               href={data.sourceUrl}
               target="_blank"
               rel="noreferrer"
               className="btn btn--ghost btn--sm"
            >
               <ExternalLink size={15} /> Manba
            </a>
         </div>

         <Card
            title={`Yozuvlar (${filtered.length})`}
            action={
               <div className="searchbox" style={{ width: 240 }}>
                  <Search size={15} />
                  <input
                     className="input"
                     placeholder="Qidirish..."
                     value={q}
                     onChange={e => setQ(e.target.value)}
                  />
               </div>
            }
            noPad
         >
            <div className="table-wrap">
               <table className="table">
                  <thead>
                     <tr>
                        <th style={{ width: '55%' }}>Xizmat / band</th>
                        <th>Qiymat</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filtered.map((i: ScrapedItem, idx: number) => (
                        <tr key={i.key + idx}>
                           <td>
                              {i.section && (
                                 <div className="faint" style={{ fontSize: 12 }}>
                                    {i.section}
                                 </div>
                              )}
                              {i.label}
                           </td>
                           <td>
                              <strong>{i.value || '—'}</strong>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
   )
}
