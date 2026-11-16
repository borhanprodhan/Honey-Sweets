import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

(window as Window & { __HONEY_SWEETS_MOUNTED__?: boolean }).__HONEY_SWEETS_MOUNTED__ = true;

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

