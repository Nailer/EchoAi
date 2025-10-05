import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// @ts-ignore: No declaration file for BlockDAGWallet (JSX module)
import CrowdFundingProvider from "../Context/EchoAid"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CrowdFundingProvider>
    <App />
    </CrowdFundingProvider>
  </StrictMode>
);
