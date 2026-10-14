import React from 'react';
import { createRoot } from 'react-dom/client';
import NexusStudio from './nexus_studio(4).tsx';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('NEXUS STUDIO could not start: #root element is missing.');

createRoot(rootElement).render(
  <React.StrictMode>
    <NexusStudio />
  </React.StrictMode>,
);
