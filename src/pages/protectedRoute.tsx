import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux-toolkit';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((store) => store.user);
  if (!user) {
    return <Navigate to='/landing' />;
  }
  return children;
};
export default ProtectedRoute;
