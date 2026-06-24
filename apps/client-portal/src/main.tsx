import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@dev-team-cv/theme';
import { App } from './app/app';
import './styles.css';

// Prevent theme flicker: apply stored theme before React renders
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
document.documentElement.classList.add(initialTheme);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
