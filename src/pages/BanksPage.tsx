import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getBanks } from '../api/client'
import { useApi } from '../hooks/useApi'
import { OWNERSHIP_LABELS } from '../lib/format'
import {
   BankAvatar,
   EmptyState,
   ErrorBox,
   Loading,
} from '../components/ui'
import { Search } from '../components/icons'

export const BanksPage = () => {
   const [q, setQ] = useState('')
   const { data, loading, error } = useApi(
      () => getBanks(q ? { q } : undefined),
      [q],
   )
   const navigate = useNavigate()

   return (
      <div>
         <div className="page-title">Tijorat banklari</div>
         <div className="page-sub">
            Markaziy bank ro'yxatidagi 35 ta bank. Har bir bank uchun kuzatiladigan
            tarif sahifalarini sozlash mumkin.
         </div>

         <div className="toolbar">
            <div className="searchbox" style={{ width: 320 }}>
               <Search size={16} />
               <input
                  className="input"
                  placeholder="Bank qidirish..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
               />
            </div>
            <div className="toolbar__spacer" />
            {data && <span className="chip">{data.length} ta bank</span>}
         </div>

         {loading ? (
            <Loading />
         ) : error ? (
            <ErrorBox message={error} />
         ) : !data || data.length === 0 ? (
            <div className="card">
               <EmptyState title="Bank topilmadi" />
            </div>
         ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
               <div className="table-wrap">
                  <table className="table table--clickable">
                     <thead>
                        <tr>
                           <th>Bank</th>
                           <th>Turi</th>
                           <th>Kuzatilayotgan manba</th>
                           <th>Veb-sayt</th>
                           <th className="right">Holat</th>
                        </tr>
                     </thead>
                     <tbody>
                        {data.map(b => {
                           const enabled = b.sources.filter(s => s.enabled).length
                           return (
                              <tr
                                 key={b._id}
                                 onClick={() => navigate(`/banks/${b.slug}`)}
                              >
                                 <td>
                                    <div className="row-flex">
                                       <BankAvatar name={b.shortName} />
                                       <div>
                                          <div style={{ fontWeight: 600 }}>
                                             {b.shortName}
                                          </div>
                                          <div
                                             className="faint"
                                             style={{ fontSize: 12, maxWidth: 340 }}
                                          >
                                             {b.name}
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <span className="badge badge--gray">
                                       {OWNERSHIP_LABELS[b.ownershipType || ''] ||
                                          b.ownershipType ||
                                          '—'}
                                    </span>
                                 </td>
                                 <td>
                                    {enabled > 0 ? (
                                       <span className="badge badge--green">
                                          {enabled} ta manba
                                       </span>
                                    ) : (
                                       <span className="badge badge--gray">
                                          Sozlanmagan
                                       </span>
                                    )}
                                 </td>
                                 <td>
                                    <span className="mono muted">
                                       {b.website.replace(/^https?:\/\//, '')}
                                    </span>
                                 </td>
                                 <td className="right">
                                    <span
                                       className={`badge ${b.active ? 'badge--green' : 'badge--gray'}`}
                                    >
                                       {b.active ? 'Faol' : 'Nofaol'}
                                    </span>
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
   )
}
