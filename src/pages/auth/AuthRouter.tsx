import React from 'react'
import {Route, Routes} from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import ForgotPassword from './ForgotPassword/ForgotPassword';

const AuthRouter = () => {
  return (
    <Routes>
      <Route path='auth'>
        <Route path='register' element={<Register/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='recovery' element={<ForgotPassword/>}/>
      </Route>
    </Routes>
  );
}

export default AuthRouter