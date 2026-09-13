import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/modules/layout'
import { HomePage, NotFoundPage } from '@/pages'
import { ROUTES } from '@/shared/constants'
import { resetToHomeOnReload } from '@/shared/motion/resetOnReload'

resetToHomeOnReload()

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.about, element: <Navigate to={ROUTES.hashes.about} replace /> },
      { path: '/about', element: <Navigate to={ROUTES.hashes.about} replace /> },
      { path: ROUTES.services, element: <Navigate to={ROUTES.hashes.services} replace /> },
      { path: '/services', element: <Navigate to={ROUTES.hashes.services} replace /> },
      { path: ROUTES.contact, element: <Navigate to={ROUTES.hashes.contact} replace /> },
      { path: '/contact', element: <Navigate to={ROUTES.hashes.contact} replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
