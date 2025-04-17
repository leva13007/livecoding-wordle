import { createRoot } from 'react-dom/client';
import { App } from './App.tsx'

const word = "happy";

createRoot(document.getElementById('root')!).render(
  <>
    <App word={word} />
  </>,
)
