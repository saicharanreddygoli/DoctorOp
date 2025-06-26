import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Import Bootstrap CSS here
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Ant Design CSS (often needed for base styles)
// Check Ant Design docs, typically you import a theme or the base styles
// For now, let's assume this is needed for messages/modals if not coming via component
// import 'antd/dist/reset.css'; // Or similar depending on Antd version

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);