import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getChange, reviewChange } from '../api/client'
import type { Change, ChangeStatus, Snapshot } from '../api/types'
import { useApi } from '../hooks/useApi'
import { formatDate } from '../lib/format'
import { DiffView } from '../components/DiffView'
import {
   BankAvatar,
   CategoryBadge,
   Card,
   CountPill,
   ErrorBox,
   Loading,
   StatusBadge,
} from '../components/ui'
import {
   Check,
   ChevronLeft,
   ExternalLink,
   RotateCcw,
   X,
} from '../components/icons'

const snapDate = (s: string | Snapshot | null): string => {
   if (!s || typeof s === 'string') return '—'
   return formatDate(s.fetchedAt)
}

export const ChangeDetailPage = () => {
   const { id = '' } = useParams()
   const { data, loading, error, reload } = useApi(() => getChange(id), [id])
   const [note, setNote] = useState('')
   const [saving, setSaving] = useState(false)

   const doReview = async (status: ChangeStatus) => {
      setSaving(true)
      try {
         await reviewChange(id, status, note || undefined)
         reload()
      } finally {
         setSaving(false)
      }
   }

   if (loading) return <Loading />
   if (error) return <ErrorBox message={error} />
   if (!data) return null

   const c: Change = data

   return (
      <div>
         <Link
            to="/changes"
            className="link row-flex"
            style={{ fontSize: 13, gap: 4, display: 'inline-flex' }}
         >
            <ChevronLeft size={15} /> O'zgarishlarga qaytish
         </Link>

         <div
            className="toolbar"
            style={{ marginTop: 14, alignItems: 'flex-start' }}
         >
            <div className="row-flex">
               <BankAvatar name={c.bankName} />
               <div>
                  <div className="page-title" style={{ marginBottom: 2 }}>
                     {c.bankName}
                  </div>
                  <div className="row-flex" style={{ gap: 8 }}>
                     <CategoryBadge category={c.category} />
                     <StatusBadge status={c.status} />
                  </div>
               </div>
            </div>
            <div className="toolbar__spacer" />
            <a
               href={c.sourceUrl}
               target="_blank"
               rel="noreferrer"
               className="btn btn--ghost btn--sm"
            >
               <ExternalLink size={15} /> Manba sahifasi
            </a>
         </div>

         <div className="grid-2">
            <Card title="Aynan o'zgargan nuqtalar" noPad>
               <div className="card__body">
                  <div
                     className="row-flex"
                     style={{ gap: 8, marginBottom: 18, flexWrap: 'wrap' }}
                  >
                     <CountPill n={c.counts.added} type="added" />
                     <CountPill n={c.counts.modified} type="modified" />
                     <CountPill n={c.counts.removed} type="removed" />
                     {c.counts.total === 0 && (
                        <span className="muted">O'zgarish yo'q</span>
                     )}
                  </div>
                  <DiffView
                     added={c.added}
                     removed={c.removed}
                     modified={c.modified}
                  />
               </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
               <Card title="Ma'lumot">
                  <div
                     style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        fontSize: 13,
                     }}
                  >
                     <Info label="Aniqlangan" value={formatDate(c.detectedAt)} />
                     <Info label="Oldingi holat" value={snapDate(c.fromSnapshot)} />
                     <Info label="Yangi holat" value={snapDate(c.toSnapshot)} />
                     <Info
                        label="Jami o'zgarish"
                        value={`${c.counts.total} ta nuqta`}
                     />
                     {c.reviewedAt && (
                        <Info
                           label="Ko'rib chiqilgan"
                           value={formatDate(c.reviewedAt)}
                        />
                     )}
                  </div>
               </Card>

               <Card title="Mutaxassis qarori">
                  <textarea
                     className="textarea"
                     rows={3}
                     placeholder="Izoh (ixtiyoriy)..."
                     value={note}
                     onChange={e => setNote(e.target.value)}
                     style={{ marginBottom: 12 }}
                  />
                  {c.reviewNote && (
                     <div
                        className="chip"
                        style={{ marginBottom: 12, whiteSpace: 'normal' }}
                     >
                        💬 {c.reviewNote}
                     </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                     <button
                        className="btn btn--green btn--sm"
                        disabled={saving || c.status === 'reviewed'}
                        onClick={() => doReview('reviewed')}
                     >
                        <Check size={15} /> Ko'rib chiqildi
                     </button>
                     <button
                        className="btn btn--danger btn--sm"
                        disabled={saving || c.status === 'dismissed'}
                        onClick={() => doReview('dismissed')}
                     >
                        <X size={15} /> Rad etish
                     </button>
                     {c.status !== 'pending' && (
                        <button
                           className="btn btn--ghost btn--sm"
                           disabled={saving}
                           onClick={() => doReview('pending')}
                        >
                           <RotateCcw size={15} /> Yangi deb belgilash
                        </button>
                     )}
                  </div>
               </Card>
            </div>
         </div>
      </div>
   )
}

const Info = ({ label, value }: { label: string; value: string }) => (
   <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span className="muted">{label}</span>
      <strong style={{ textAlign: 'right' }}>{value}</strong>
   </div>
)
