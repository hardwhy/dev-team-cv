import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@dev-team-cv/auth';
import { AdminLayout } from './layout/admin-layout';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { TeamPage } from './pages/team-page';
import { TeamFormPage } from './pages/team-form-page';
import { ProjectsPage } from './pages/projects-page';
import { ProjectFormPage } from './pages/project-form-page';
import { ContactsPage } from './pages/contacts-page';
import { BrandingPage } from './pages/settings-branding-page';
import { ContactInfoPage } from './pages/settings-contact-page';
import { AboutPage } from './pages/about-page';

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
        <Route path="team">
          <Route index element={<TeamPage />} />
          <Route path="new" element={<TeamFormPage />} />
          <Route path=":memberId/edit" element={<TeamFormPage />} />
        </Route>
        <Route path="projects">
          <Route index element={<ProjectsPage />} />
          <Route path="new" element={<ProjectFormPage />} />
          <Route path=":projectId/edit" element={<ProjectFormPage />} />
        </Route>
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="settings" element={<Navigate to="/settings/branding" replace />} />
        <Route path="settings/branding" element={<BrandingPage />} />
        <Route path="settings/contact" element={<ContactInfoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
