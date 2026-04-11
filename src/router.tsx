import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage, RegisterPage } from './pages/auth';
import { HomePage } from './pages/home';
import { SearchPage } from './pages/search';
import { ProfilePage } from './pages/profile';
import { AnimeDetailPage } from './pages/anime';

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
    path: '/anime/:id',
    element: <AnimeDetailPage />,
  },
]);

function AuthRouter() {
  return <RouterProvider router={router} />;
}

export default AuthRouter;