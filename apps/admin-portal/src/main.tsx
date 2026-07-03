import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@dev-team-cv/theme';
import { AuthProvider } from '@dev-team-cv/auth';
import { App } from './app/app';
import './styles.css';

const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
document.documentElement.classList.add(initialTheme);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={basename || undefined}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
