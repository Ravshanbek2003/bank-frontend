import {
   ArrowLeftRight,
   CreditCard,
   PiggyBank,
   ReceiptText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { CategoryKey } from '../api/types'

// Kategoriya → icon xaritasi
export const CATEGORY_ICON: Record<CategoryKey, LucideIcon> = {
   credits: CreditCard,
   deposits: PiggyBank,
   tariffs: ReceiptText,
   transfers: ArrowLeftRight,
}

export const CategoryIcon = ({
   category,
   size = 15,
}: {
   category: CategoryKey
   size?: number
}) => {
   const Icon = CATEGORY_ICON[category]
   return <Icon size={size} strokeWidth={2} />
}

// Ko'p ishlatiladigan iconlarni bitta joydan qayta eksport qilamiz
export {
   LayoutDashboard,
   Bell,
   Landmark,
   Building2,
   Layers,
   Radar,
   ShieldCheck,
   Search,
   RefreshCw,
   RotateCcw,
   Check,
   X,
   Plus,
   Trash2,
   ChevronLeft,
   ChevronRight,
   Inbox,
   CheckCircle2,
   Link2,
   ExternalLink,
   Clock,
   Globe,
   FileText,
   Camera,
   TrendingUp,
   AlertCircle,
} from 'lucide-react'
