import { Routes, Route } from 'react-router-dom';
import { ScrollProgress } from '@dev-team-cv/ui';
import { Nav } from './components/nav';
import { HomePage } from './pages/home-page';
import { AllProjectsPage } from './pages/all-projects-page';

export function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
      </Routes>
    </>
  );
}

export default App;
