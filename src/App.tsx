import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/auth/Register/Register';
import Login from './pages/auth/Login/Login';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import ProfileEdit from './pages/profile/ProfileEdit';
import CreateTheme from './pages/themes/CreateTheme';
import Theme from './pages/themes/Theme';
import Themes from './pages/themes/Themes';
import UpdateTheme from './pages/themes/UpdateTheme';
import MyThemes from './pages/themes/MyThemes';
import ProfileView from './pages/profile/ProfileView';
import Moderation from './pages/Moderation';
import ResetPassword from './pages/auth/ResetPassword/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'/>
        <Route path='auth'>
          <Route path='register' element={<Register/>}/>
          <Route path='register/:secret' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='forgot_password' element={<ForgotPassword/>}/>
          <Route path='reset_password/:userId/:secretCode' element={<ResetPassword/>}/>
        </Route>
        <Route element={<PrivateRoute/>}>
            <Route path='home'/>
            <Route path='profile'>
              <Route path='update' element={<ProfileEdit/>}/>
              <Route path=':uid' element={<ProfileView/>}/>
            </Route>
            <Route path='theme'>
                <Route path='create' element={<CreateTheme/>}/>
                <Route path=':themeId' element={<Theme/>}/>
                <Route path='find' element={<Themes/>}/>
                <Route path=':themeId/update' element={<UpdateTheme/>}/>
                <Route path='my' element={<MyThemes/>}/>
                <Route path=':themeId/find_mentor'/>
            </Route>

            <Route path='moderate' element={<Moderation/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
