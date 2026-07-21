import { useState } from 'react'

import { getScanRuns, triggerScan } from '../api/client'
import { useApi } from '../hooks/useApi'
import { formatDate } from '../lib/format'
import {
   EmptyState,
   ErrorBox,
   Loading,
   Pagination,
} from '../components/ui'
import { Radar, RefreshCw, Search } from '../components/icons'

const TRIGGER_LABELS: Record<string, string> = {
   cron: 'Avtomatik',
   manual: "Qo'lda",
   startup: 'Ishga tushishda',
}

export const ScanRunsPage = () => {
   const [page, setPage] = useState(1)
   const [scanning, setScanning] = useState(false)
   const { data, loading, error, reload } = useApi(
      () => getScanRuns({ page, limit: 20 }),
      [page],
   )

   const runScan = async () => {
      setScanning(true)
      try {
         await triggerScan()
         reload()
      } finally {
         setScanning(false)
      }
   }

   return (
      <div>
         <div className="toolbar">
            <div>
               <div className="page-title">Skanerlashlar tarixi</div>
               <div className="muted" style={{ fontSize: 14 }}>
                  Avtomatik va qo'lda ishga tushirilgan kuzatuv sikllar
               </div>
            </div>
            <div className="toolbar__spacer" />
            <button className="btn btn--primary" onClick={runScan} disabled={scanning}>
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

         {loading ? (
            <Loading />
         ) : error ? (
            <ErrorBox message={error} />
         ) : !data || data.data.length === 0 ? (
            <div className="card">
               <EmptyState
                  icon={<Radar size={40} strokeWidth={1.5} />}
                  title="Skanerlash tarixi yo'q"
               />
            </div>
         ) : (
            <>
               <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="table-wrap">
                     <table className="table">
                        <thead>
                           <tr>
                              <th>Sana</th>
                              <th>Turi</th>
                              <th>Tekshirildi</th>
                              <th>Muvaffaqiyatli</th>
                              <th>Xato</th>
                              <th>O'zgargan</th>
                              <th className="right">Davomiyligi</th>
                           </tr>
                        </thead>
                        <tbody>
                           {data.data.map(r => (
                              <tr key={r._id}>
                                 <td className="nowrap">{formatDate(r.startedAt)}</td>
                                 <td>
                                    <span className="badge badge--blue">
                                       {TRIGGER_LABELS[r.trigger] || r.trigger}
                                    </span>
                                 </td>
                                 <td>{r.totalTargets}</td>
                                 <td>
                                    <span className="badge badge--green">
                                       {r.succeeded}
                                    </span>
                                 </td>
                                 <td>
                                    {r.failed > 0 ? (
                                       <span className="badge badge--red">
                                          {r.failed}
                                       </span>
                                    ) : (
                                       <span className="muted">0</span>
                                    )}
                                 </td>
                                 <td>
                                    {r.changed > 0 ? (
                                       <span className="badge badge--amber">
                                          {r.changed}
                                       </span>
                                    ) : (
                                       <span className="muted">0</span>
                                    )}
                                 </td>
                                 <td className="right muted nowrap">
                                    {r.durationMs
                                       ? `${(r.durationMs / 1000).toFixed(1)} s`
                                       : '—'}
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
