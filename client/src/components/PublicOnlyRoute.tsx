import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/analyze" replace />;
  return <>{children}</>;
}
