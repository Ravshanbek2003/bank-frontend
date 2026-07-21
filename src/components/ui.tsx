import type { ReactNode } from 'react'

import type { CategoryKey, ChangeStatus } from '../api/types'
import { CATEGORY_LABELS, STATUS_LABELS } from '../lib/format'
import { CategoryIcon, Inbox } from './icons'

export const Loading = ({ label }: { label?: string }) => (
   <div className="center">
      <div className="spinner" />
      {label && <div className="muted">{label}</div>}
   </div>
)

export const ErrorBox = ({ message }: { message: string }) => (
   <div className="error-box">⚠️ {message}</div>
)

export const EmptyState = ({
   icon,
   title,
   hint,
}: {
   icon?: ReactNode
   title: string
   hint?: string
}) => (
   <div className="empty">
      <div className="empty__icon">
         {icon ?? <Inbox size={40} strokeWidth={1.5} />}
      </div>
      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{title}</div>
      {hint && <div style={{ marginTop: 4, fontSize: 13 }}>{hint}</div>}
   </div>
)

export const CategoryBadge = ({ category }: { category: CategoryKey }) => (
   <span className="badge badge--blue">
      <CategoryIcon category={category} size={13} />
      {CATEGORY_LABELS[category]}
   </span>
)

const STATUS_CLASS: Record<ChangeStatus, string> = {
   pending: 'badge--amber',
   reviewed: 'badge--green',
   dismissed: 'badge--gray',
}

export const StatusBadge = ({ status }: { status: ChangeStatus }) => (
   <span className={`badge ${STATUS_CLASS[status]}`}>{STATUS_LABELS[status]}</span>
)

export const Card = ({
   title,
   action,
   children,
   noPad,
}: {
   title?: string
   action?: ReactNode
   children: ReactNode
   noPad?: boolean
}) => (
   <div className="card">
      {(title || action) && (
         <div className="card__header">
            <div className="card__title">{title}</div>
            {action}
         </div>
      )}
      {noPad ? children : <div className="card__body">{children}</div>}
   </div>
)

export const Pagination = ({
   page,
   totalPages,
   total,
   onPage,
}: {
   page: number
   totalPages: number
   total: number
   onPage: (p: number) => void
}) => {
   if (totalPages <= 1) return null
   return (
      <div className="pagination">
         <div>
            Jami {total} ta · {page}/{totalPages} sahifa
         </div>
         <div className="pagination__btns">
            <button
               className="btn btn--ghost btn--sm"
               disabled={page <= 1}
               onClick={() => onPage(page - 1)}
            >
               ← Oldingi
            </button>
            <button
               className="btn btn--ghost btn--sm"
               disabled={page >= totalPages}
               onClick={() => onPage(page + 1)}
            >
               Keyingi →
            </button>
         </div>
      </div>
   )
}

export const CountPill = ({
   n,
   type,
}: {
   n: number
   type: 'added' | 'removed' | 'modified'
}) => {
   if (!n) return null
   const map = {
      added: { cls: 'badge--green', sign: '+', label: 'yangi' },
      removed: { cls: 'badge--red', sign: '−', label: "o'chgan" },
      modified: { cls: 'badge--amber', sign: '~', label: "o'zgargan" },
   }
   const m = map[type]
   return (
      <span className={`badge ${m.cls}`}>
         {m.sign}
         {n} {m.label}
      </span>
   )
}

export const BankAvatar = ({ name }: { name: string }) => {
   const initials = name
      .replace(/["']/g, '')
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase()
   return <div className="bank-logo">{initials}</div>
}
