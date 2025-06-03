// components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase/firebase.config';

interface ProtectedRouteProps {
  children?: React.ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!auth.currentUser) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;