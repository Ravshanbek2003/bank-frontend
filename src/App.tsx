import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout'
import { BankDetailPage } from './pages/BankDetailPage'
import { BanksPage } from './pages/BanksPage'
import { ChangeDetailPage } from './pages/ChangeDetailPage'
import { ChangesPage } from './pages/ChangesPage'
import { DashboardPage } from './pages/DashboardPage'
import { ScanRunsPage } from './pages/ScanRunsPage'
import { SnapshotDetailPage } from './pages/SnapshotDetailPage'
import { SnapshotsPage } from './pages/SnapshotsPage'

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<Layout />}>
               <Route path="/" element={<DashboardPage />} />
               <Route path="/changes" element={<ChangesPage />} />
               <Route path="/changes/:id" element={<ChangeDetailPage />} />
               <Route path="/banks" element={<BanksPage />} />
               <Route path="/banks/:slug" element={<BankDetailPage />} />
               <Route path="/snapshots" element={<SnapshotsPage />} />
               <Route path="/snapshots/:id" element={<SnapshotDetailPage />} />
               <Route path="/scans" element={<ScanRunsPage />} />
               <Route path="*" element={<DashboardPage />} />
            </Route>
         </Routes>
      </BrowserRouter>
   )
}

export default App
