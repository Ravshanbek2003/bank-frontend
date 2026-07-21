import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { useApi } from '../hooks/useApi'
import { getDashboard } from '../api/client'
import {
   Bell,
   Landmark,
   LayoutDashboard,
   Layers,
   Radar,
   ShieldCheck,
} from './icons'

const NAV = [
   { to: '/', label: 'Boshqaruv paneli', Icon: LayoutDashboard, end: true },
   { to: '/changes', label: "O'zgarishlar", Icon: Bell, badge: true },
   { to: '/banks', label: 'Banklar', Icon: Landmark },
   { to: '/snapshots', label: 'Snapshotlar', Icon: Layers },
   { to: '/scans', label: 'Skanerlashlar', Icon: Radar },
]

const PAGE_TITLES: Record<string, { title: string; crumb: string }> = {
   '/': { title: 'Boshqaruv paneli', crumb: 'Umumiy ko\'rsatkichlar' },
   '/changes': { title: "O'zgarishlar", crumb: 'Aniqlangan tarif o\'zgarishlari' },
   '/banks': { title: 'Banklar', crumb: '35 ta tijorat banki' },
   '/snapshots': { title: 'Snapshotlar', crumb: 'Yig\'ilgan ma\'lumot holatlari' },
   '/scans': { title: 'Skanerlashlar', crumb: 'Avtomatik kuzatuv tarixi' },
}

export const Layout = () => {
   const { data } = useApi(getDashboard, [])
   const pending = data?.totals.pendingChanges || 0
   const { pathname } = useLocation()

   const matched =
      PAGE_TITLES[pathname] ||
      (pathname.startsWith('/changes')
         ? { title: "O'zgarish tafsiloti", crumb: "O'zgarishlar" }
         : pathname.startsWith('/banks')
           ? { title: 'Bank tafsiloti', crumb: 'Banklar' }
           : { title: '', crumb: '' })

   return (
      <div className="app">
         <aside className="sidebar">
            <div className="sidebar__brand">
               <div className="sidebar__logo">
                  <ShieldCheck size={24} strokeWidth={2} color="#fff" />
               </div>
               <div>
                  <div className="sidebar__title">Tarif Monitoring</div>
                  <div className="sidebar__subtitle">Markaziy bank · MXIHHX</div>
               </div>
            </div>

            <div className="nav__section">Menyu</div>
            <nav className="nav">
               {NAV.map(item => {
                  const Icon = item.Icon
                  return (
                     <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                           `nav__item ${isActive ? 'nav__item--active' : ''}`
                        }
                     >
                        <span className="nav__icon">
                           <Icon size={18} strokeWidth={2} />
                        </span>
                        <span>{item.label}</span>
                        {item.badge && pending > 0 && (
                           <span className="nav__badge">{pending}</span>
                        )}
                     </NavLink>
                  )
               })}
            </nav>

            <div style={{ marginTop: 'auto', padding: '16px 12px 4px' }}>
               <div
                  style={{
                     fontSize: 11,
                     color: '#6f86b0',
                     lineHeight: 1.5,
                  }}
               >
                  AI-agent tarif o'zgarishlarini avtomatik kuzatadi va aynan
                  o'zgargan nuqtalarni ko'rsatadi.
               </div>
            </div>
         </aside>

         <div className="main">
            <header className="topbar">
               <div>
                  <div className="topbar__title">{matched.title}</div>
                  <div className="topbar__crumb">{matched.crumb}</div>
               </div>
            </header>
            <div className="content">
               <Outlet />
            </div>
         </div>
      </div>
   )
}
