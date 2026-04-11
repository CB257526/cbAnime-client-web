import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage, RegisterPage } from './pages/auth';
import { HomePage } from './pages/home';

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
]);

function AuthRouter() {
  return <RouterProvider router={router} />;
}

export default AuthRouter;