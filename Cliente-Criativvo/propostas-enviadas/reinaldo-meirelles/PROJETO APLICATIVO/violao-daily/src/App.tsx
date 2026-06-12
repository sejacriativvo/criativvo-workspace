import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AppShell from './components/Layout/AppShell'
import BottomNavigation from './components/BottomNavigation/BottomNavigation'
import Onboarding from './pages/Onboarding/Onboarding'
import Home from './pages/Home/Home'
import Lesson from './pages/Lesson/Lesson'
import LessonResult from './pages/LessonResult/LessonResult'
import Practice from './pages/Practice/Practice'
import Songs from './pages/Songs/Songs'
import Progress from './pages/Progress/Progress'
import Ranking from './pages/Ranking/Ranking'
import Profile from './pages/Profile/Profile'
import Premium from './pages/Premium/Premium'
import { useApp } from './context/AppContext'

const HIDE_NAV_PATHS = ['/onboarding', '/lesson', '/lesson-result']

export default function App() {
  const location = useLocation()
  const { user, hasOnboarded } = useApp()

  const showNav = !HIDE_NAV_PATHS.some((path) => location.pathname.startsWith(path))

  return (
    <div className="min-h-screen w-full bg-gradient-soft md:py-6">
      <AppShell>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 overflow-y-auto no-scrollbar pb-28"
          >
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={hasOnboarded ? <Navigate to="/home" replace /> : <Navigate to="/onboarding" replace />}
              />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/lesson/:lessonId" element={<Lesson />} />
              <Route path="/lesson-result/:lessonId" element={<LessonResult />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        {showNav && user && <BottomNavigation />}
      </AppShell>
    </div>
  )
}
