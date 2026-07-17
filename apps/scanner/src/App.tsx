import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { HealthPage } from '@/pages/HealthPage';
import { LoginPage } from '@/pages/LoginPage';
import { RootRedirect } from '@/pages/RootRedirect';
import { ScanPage } from '@/pages/ScanPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/scan"
        element={
          <RequireAuth>
            <ScanPage />
          </RequireAuth>
        }
      />
      <Route path="/health" element={<HealthPage />} />
    </Routes>
  );
}
