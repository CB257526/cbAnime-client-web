import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage, RegisterPage } from './pages/auth';
import { HomePage } from './pages/home';
import { SearchPage } from './pages/search';
import { ProfilePage, FavoritesPage, HistoryPage } from './pages/profile';
import { AnimeDetailPage } from './pages/anime';
import { AdminLayout } from './components/AdminLayout';
import { AdminRoute } from './components/AdminRoute';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { FeedbackManagementPage } from './pages/admin/FeedbackManagementPage';
import { RecommendationManagementPage } from './pages/admin/RecommendationManagementPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/profile/favorites',
    element: <FavoritesPage />,
  },
  {
    path: '/profile/history',
    element: <HistoryPage />,
  },
  {
    path: '/anime/:id',
    element: <AnimeDetailPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'feedback',
        element: <FeedbackManagementPage />,
      },
      {
        path: 'recommend',
        element: <RecommendationManagementPage />,
      },
    ],
  },
]);

function AuthRouter() {
  return <RouterProvider router={router} />;
}

export default AuthRouter;