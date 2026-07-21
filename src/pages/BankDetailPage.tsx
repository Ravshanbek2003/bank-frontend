import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
   getBank,
   getSnapshots,
   triggerScan,
   updateBankSources,
} from '../api/client'
import type { Bank, BankSource, CategoryKey, Snapshot } from '../api/types'
import { useApi } from '../hooks/useApi'
import {
   CATEGORY_LABELS,
   OWNERSHIP_LABELS,
   formatDate,
} from '../lib/format'
import {
   BankAvatar,
   CategoryBadge,
   Card,
   EmptyState,
   ErrorBox,
   Loading,
} from '../components/ui'
import {
   ChevronLeft,
   Layers,
   Link2,
   Plus,
   RefreshCw,
   Search,
} from '../components/icons'

const CATEGORIES: CategoryKey[] = ['credits', 'deposits', 'tariffs', 'transfers']

const emptySource = (): BankSource => ({
   category: 'tariffs',
   url: '',
   sourceType: 'html',
   adapter: 'generic',
   enabled: true,
})

export const BankDetailPage = () => {
   const { slug = '' } = useParams()
   const navigate = useNavigate()
   const { data: bank, loading, error, reload } = useApi(() => getBank(slug), [slug])
   const { data: snapData, reload: reloadSnaps } = useApi(
      () => getSnapshots({ bankSlug: slug, latest: 'true', limit: 20 }),
      [slug],
   )

   const [sources, setSources] = useState<BankSource[]>([])
   const [saving, setSaving] = useState(false)
   const [scanning, setScanning] = useState(false)
   const [savedMsg, setSavedMsg] = useState('')

   useEffect(() => {
      if (bank) setSources(bank.sources.length ? bank.sources : [])
   }, [bank])

   if (loading) return <Loading />
   if (error) return <ErrorBox message={error} />
   if (!bank) return null

   const b: Bank = bank
   const snapshots: Snapshot[] = snapData?.data || []

   const updateSource = (i: number, patch: Partial<BankSource>) =>
      setSources(prev => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))

   const save = async () => {
      setSaving(true)
      setSavedMsg('')
      try {
         const clean = sources.filter(s => s.url.trim())
         await updateBankSources(slug, clean)
         setSavedMsg('Saqlandi ✓')
         reload()
         setTimeout(() => setSavedMsg(''), 2500)
      } catch (e) {
         setSavedMsg((e as Error).message)
      } finally {
         setSaving(false)
      }
   }

   const scan = async () => {
      setScanning(true)
      try {
         await triggerScan({ bankSlug: slug })
         reloadSnaps()
      } finally {
         setScanning(false)
      }
   }

   return (
      <div>
         <Link
            to="/banks"
            className="link row-flex"
            style={{ fontSize: 13, gap: 4, display: 'inline-flex' }}
         >
            <ChevronLeft size={15} /> Banklarga qaytish
         </Link>

         <div className="toolbar" style={{ marginTop: 14 }}>
            <div className="row-flex">
               <BankAvatar name={b.shortName} />
               <div>
                  <div className="page-title" style={{ marginBottom: 2 }}>
                     {b.shortName}
                  </div>
                  <div className="muted" style={{ fontSize: 13, maxWidth: 560 }}>
                     {b.name}
                  </div>
               </div>
            </div>
            <div className="toolbar__spacer" />
            <button className="btn btn--primary" onClick={scan} disabled={scanning}>
               {scanning ? (
                  <>
                     <RefreshCw size={16} className="spin" /> Skanerlanmoqda...
                  </>
               ) : (
                  <>
                     <Search size={16} /> Ushbu bankni skanerlash
                  </>
               )}
            </button>
         </div>

         <div className="stats-grid">
            <InfoCard label="Turi" value={OWNERSHIP_LABELS[b.ownershipType || ''] || '—'} />
            <InfoCard
               label="Veb-sayt"
               value={b.website.replace(/^https?:\/\//, '')}
               href={b.website}
            />
            <InfoCard label="Manbalar" value={`${b.sources.length} ta`} />
            <InfoCard label="Holat" value={b.active ? 'Faol' : 'Nofaol'} />
         </div>

         <div className="grid-2">
            <Card
               title="Kuzatiladigan manbalar"
               action={
                  <button
                     className="btn btn--ghost btn--sm"
                     onClick={() => setSources(prev => [...prev, emptySource()])}
                  >
                     <Plus size={15} /> Manba qo'shish
                  </button>
               }
            >
               {sources.length === 0 ? (
                  <EmptyState
                     icon={<Link2 size={40} strokeWidth={1.5} />}
                     title="Manba sozlanmagan"
                     hint="Kuzatiladigan tarif sahifasi URL manzilini qo'shing"
                  />
               ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                     {sources.map((s, i) => (
                        <div
                           key={i}
                           style={{
                              border: '1px solid var(--border)',
                              borderRadius: 8,
                              padding: 14,
                           }}
                        >
                           <div
                              style={{
                                 display: 'flex',
                                 gap: 8,
                                 marginBottom: 10,
                                 flexWrap: 'wrap',
                              }}
                           >
                              <select
                                 className="select"
                                 value={s.category}
                                 onChange={e =>
                                    updateSource(i, {
                                       category: e.target.value as CategoryKey,
                                    })
                                 }
                              >
                                 {CATEGORIES.map(c => (
                                    <option key={c} value={c}>
                                       {CATEGORY_LABELS[c]}
                                    </option>
                                 ))}
                              </select>
                              <select
                                 className="select"
                                 value={s.sourceType}
                                 onChange={e =>
                                    updateSource(i, {
                                       sourceType: e.target.value as 'html' | 'pdf',
                                    })
                                 }
                              >
                                 <option value="html">HTML</option>
                                 <option value="pdf">PDF</option>
                              </select>
                              <input
                                 className="input"
                                 style={{ width: 110 }}
                                 placeholder="adapter"
                                 value={s.adapter}
                                 onChange={e =>
                                    updateSource(i, { adapter: e.target.value })
                                 }
                              />
                              <div className="toolbar__spacer" />
                              <button
                                 className="btn btn--danger btn--sm"
                                 onClick={() =>
                                    setSources(prev =>
                                       prev.filter((_, idx) => idx !== i),
                                    )
                                 }
                              >
                                 O'chirish
                              </button>
                           </div>
                           <input
                              className="input"
                              style={{ width: '100%' }}
                              placeholder="https://bank.uz/.../tariflar"
                              value={s.url}
                              onChange={e => updateSource(i, { url: e.target.value })}
                           />
                        </div>
                     ))}
                     <div className="row-flex">
                        <button
                           className="btn btn--primary"
                           onClick={save}
                           disabled={saving}
                        >
                           {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                        </button>
                        {savedMsg && (
                           <span className="muted" style={{ fontSize: 13 }}>
                              {savedMsg}
                           </span>
                        )}
                     </div>
                  </div>
               )}
            </Card>

            <Card title="Oxirgi holatlar (snapshot)">
               {snapshots.length === 0 ? (
                  <EmptyState
                     icon={<Layers size={40} strokeWidth={1.5} />}
                     title="Snapshot yo'q"
                     hint="Skanerlashdan so'ng bu yerda paydo bo'ladi"
                  />
               ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                     {snapshots.map(s => (
                        <div
                           key={s._id}
                           className="row-flex"
                           style={{
                              padding: '10px 0',
                              borderBottom: '1px solid var(--border)',
                              cursor: 'pointer',
                           }}
                           onClick={() => navigate(`/snapshots/${s._id}`)}
                        >
                           <div style={{ flex: 1 }}>
                              <CategoryBadge category={s.category} />
                              <div className="faint" style={{ fontSize: 12, marginTop: 5 }}>
                                 {formatDate(s.fetchedAt)}
                              </div>
                           </div>
                           <span className="badge badge--gray">
                              {s.itemsCount} yozuv
                           </span>
                        </div>
                     ))}
                  </div>
               )}
            </Card>
         </div>
      </div>
   )
}

const InfoCard = ({
   label,
   value,
   href,
}: {
   label: string
   value: string
   href?: string
}) => (
   <div className="stat">
      <div className="stat__label" style={{ marginTop: 0, marginBottom: 6 }}>
         {label}
      </div>
      {href ? (
         <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="link"
            style={{ fontSize: 16, fontWeight: 700, wordBreak: 'break-all' }}
         >
            {value}
         </a>
      ) : (
         <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
      )}
   </div>
)
