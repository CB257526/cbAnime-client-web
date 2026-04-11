import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthRouter from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthRouter />
  </React.StrictMode>,
);