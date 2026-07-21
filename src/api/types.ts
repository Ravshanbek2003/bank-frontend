export type CategoryKey = 'credits' | 'deposits' | 'tariffs' | 'transfers'
export type ChangeStatus = 'pending' | 'reviewed' | 'dismissed'
export type SourceType = 'html' | 'pdf'

export interface CategoryMeta {
   key: CategoryKey
   label_uz: string
   label_ru: string
   description_uz: string
}

export interface BankSource {
   category: CategoryKey
   url: string
   sourceType: SourceType
   adapter: string
   enabled: boolean
}

export interface Bank {
   _id: string
   name: string
   shortName: string
   slug: string
   website: string
   logo?: string
   ownershipType?: string
   sources: BankSource[]
   active: boolean
   createdAt: string
   updatedAt: string
}

export interface ScrapedItem {
   key: string
   section?: string
   label: string
   value: string
}

export interface ModifiedField {
   key: string
   section?: string
   label: string
   oldValue: string
   newValue: string
}

export interface Snapshot {
   _id: string
   bank: string
   bankSlug: string
   category: CategoryKey
   sourceUrl: string
   sourceType: SourceType
   adapter: string
   items?: ScrapedItem[]
   rawText?: string
   contentHash: string
   itemsCount: number
   ok: boolean
   error?: string
   fetchedAt: string
   isLatest: boolean
   createdAt: string
   updatedAt: string
}

export interface Change {
   _id: string
   bank: string
   bankSlug: string
   bankName: string
   category: CategoryKey
   fromSnapshot: string | Snapshot | null
   toSnapshot: string | Snapshot
   added: ScrapedItem[]
   removed: ScrapedItem[]
   modified: ModifiedField[]
   counts: { added: number; removed: number; modified: number; total: number }
   sourceUrl: string
   status: ChangeStatus
   reviewedAt?: string
   reviewNote?: string
   detectedAt: string
   createdAt: string
   updatedAt: string
}

export interface ScanTargetResult {
   bankSlug: string
   bankName: string
   category: CategoryKey
   ok: boolean
   changed: boolean
   itemsCount: number
   changeId?: string
   error?: string
}

export interface ScanRun {
   _id: string
   trigger: 'cron' | 'manual' | 'startup'
   startedAt: string
   finishedAt?: string
   durationMs?: number
   totalTargets: number
   succeeded: number
   failed: number
   changed: number
   results?: ScanTargetResult[]
}

export interface DashboardData {
   totals: {
      banksTotal: number
      banksActive: number
      categories: number
      monitoredSources: number
      snapshots: number
      changes: number
      pendingChanges: number
   }
   changesByCategory: Array<{
      category: CategoryKey
      label_uz: string
      count: number
   }>
   changesByStatus: Record<ChangeStatus, number>
   topBanksByChanges: Array<{
      bankSlug: string
      bankName: string
      count: number
      pending: number
   }>
   recentChanges: Change[]
   lastScan: ScanRun | null
}

export interface Paginated<T> {
   success: boolean
   page: number
   limit: number
   total: number
   totalPages: number
   data: T[]
}
