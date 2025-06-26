import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Import global CSS files here
import './index.css';
import './App.css'; // Import App.css here
// Import Bootstrap CSS here
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Ant Design CSS (often needed for base styles)
import 'antd/dist/reset.css'; // Recommended Antd v5 reset CSS

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);