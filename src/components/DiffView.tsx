import type { ModifiedField, ScrapedItem } from '../api/types'
import { EmptyState } from './ui'

/**
 * O'zgargan nuqtalarni ko'rsatadi:
 *  - modified: eski → yangi qiymat (yonma-yon)
 *  - added: yangi qo'shilgan yozuvlar
 *  - removed: o'chirilgan yozuvlar
 */
export const DiffView = ({
   added,
   removed,
   modified,
}: {
   added: ScrapedItem[]
   removed: ScrapedItem[]
   modified: ModifiedField[]
}) => {
   const empty = !added.length && !removed.length && !modified.length
   if (empty) {
      return <EmptyState icon="✅" title="O'zgarish yo'q" />
   }

   return (
      <div>
         {modified.length > 0 && (
            <div className="diff-group">
               <div className="diff-group__head">
                  <span className="dot" style={{ background: 'var(--amber)' }} />
                  O'zgargan qiymatlar ({modified.length})
               </div>
               {modified.map(m => (
                  <div className="diff-row" key={m.key}>
                     {m.section && <div className="diff-row__section">{m.section}</div>}
                     <div className="diff-row__label">{m.label}</div>
                     <div className="diff-values">
                        <div className="diff-val diff-val--old">
                           {m.oldValue || '(bo\'sh)'}
                        </div>
                        <div className="diff-arrow">→</div>
                        <div className="diff-val diff-val--new">
                           {m.newValue || '(bo\'sh)'}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {added.length > 0 && (
            <div className="diff-group">
               <div className="diff-group__head">
                  <span className="dot" style={{ background: 'var(--green)' }} />
                  Yangi qo'shilgan ({added.length})
               </div>
               {added.map(a => (
                  <div className="diff-row diff-added" key={a.key}>
                     {a.section && <div className="diff-row__section">{a.section}</div>}
                     <div className="diff-row__label">{a.label}</div>
                     <div className="diff-val diff-val--single">
                        {a.value || '(qiymatsiz)'}
                     </div>
                  </div>
               ))}
            </div>
         )}

         {removed.length > 0 && (
            <div className="diff-group">
               <div className="diff-group__head">
                  <span className="dot" style={{ background: 'var(--red)' }} />
                  O'chirilgan ({removed.length})
               </div>
               {removed.map(r => (
                  <div className="diff-row diff-removed" key={r.key}>
                     {r.section && <div className="diff-row__section">{r.section}</div>}
                     <div className="diff-row__label">{r.label}</div>
                     <div className="diff-val diff-val--single">
                        {r.value || '(qiymatsiz)'}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}
