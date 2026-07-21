import type { CategoryKey, ChangeStatus } from '../api/types'

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
   credits: 'Kreditlar',
   deposits: 'Omonatlar',
   tariffs: 'Tariflar',
   transfers: "Pul o'tkazmalari",
}

export const STATUS_LABELS: Record<ChangeStatus, string> = {
   pending: 'Yangi',
   reviewed: "Ko'rib chiqilgan",
   dismissed: 'Rad etilgan',
}

export const OWNERSHIP_LABELS: Record<string, string> = {
   state: 'Davlat',
   'joint-stock': 'Aksiyadorlik',
   private: 'Xususiy',
   foreign: 'Chet el kapitali',
}

export const formatDate = (iso?: string): string => {
   if (!iso) return '—'
   const d = new Date(iso)
   return d.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
   })
}

export const formatDateShort = (iso?: string): string => {
   if (!iso) return '—'
   return new Date(iso).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
   })
}

export const timeAgo = (iso?: string): string => {
   if (!iso) return '—'
   const diff = Date.now() - new Date(iso).getTime()
   const min = Math.floor(diff / 60000)
   if (min < 1) return 'hozirgina'
   if (min < 60) return `${min} daqiqa oldin`
   const hours = Math.floor(min / 60)
   if (hours < 24) return `${hours} soat oldin`
   const days = Math.floor(hours / 24)
   return `${days} kun oldin`
}
