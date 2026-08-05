import type { ReactNode } from 'react'
import { CollectionPage } from './components/CollectionPage'
import { SiteLayout } from './components/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { JourneyPage } from './pages/JourneyPage'
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
    '/shelf/games': <CollectionPage kind="games" />,
    '/shelf/books': <CollectionPage kind="books" />,
    '/shelf/music': <CollectionPage kind="music" />,
    '/shelf/films': <CollectionPage kind="films" />,
  }

  return <SiteLayout>{routes[pathname] ?? <NotFoundPage />}</SiteLayout>
}

export default function App() {
  return (
    <RouterProvider>
      <CurrentRoute />
    </RouterProvider>
  )
}
