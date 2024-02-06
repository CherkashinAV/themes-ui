import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import AuthRouter from './pages/auth/AuthRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthRouter/>
    </BrowserRouter>
  );
}

export default App;
