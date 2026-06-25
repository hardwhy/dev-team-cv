import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@dev-team-cv/auth';
import { AdminLayout } from './layout/admin-layout';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { TeamPage } from './pages/team-page';
import { ProjectsPage } from './pages/projects-page';
import { ContactsPage } from './pages/contacts-page';
import { SettingsPage } from './pages/settings-page';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
