import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/auth/Register/Register';
import Login from './pages/auth/Login/Login';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='auth'>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='forgot_password' element={<ForgotPassword/>}/>
        </Route>
        <Route element={<PrivateRoute/>}>
            <Route path="/home"/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
