import type { ReactNode } from 'react'
import { CollectionPage } from './components/CollectionPage'
import { SiteLayout } from './components/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { JourneyPage } from './pages/JourneyPage'
import { MusicPage } from './pages/MusicPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ShelfPage } from './pages/ShelfPage'
import { RouterProvider, useLocation } from './router'

function CurrentRoute() {
  const { pathname } = useLocation()

  const routes: Record<string, ReactNode> = {
    '/': <HomePage />,
    '/about': <AboutPage />,
    '/journey': <JourneyPage />,
    '/shelf': <ShelfPage />,
    '/shelf/games': <GamesPage />,
    '/shelf/books': <CollectionPage kind="books" />,
    '/shelf/music': <MusicPage />,
    '/shelf/films': <CollectionPage kind="films" />,
  }

  return (
    <SiteLayout>
      <div className="route-stage" key={pathname}>
        {routes[pathname] ?? <NotFoundPage />}
      </div>
    </SiteLayout>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <CurrentRoute />
    </RouterProvider>
  )
}
