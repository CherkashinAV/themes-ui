import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/auth/Register/Register';
import Login from './pages/auth/Login/Login';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import Profile from './pages/profile/Profile/ProfileEdit';
import CreateTheme from './pages/themes/CreateTheme';
import Theme from './pages/themes/Theme';
import Themes from './pages/themes/Themes';
import UpdateTheme from './pages/themes/UpdateTheme';
import MyThemes from './pages/themes/MyThemes';

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
            <Route path='home'/>
            <Route path='profile'>
              <Route path='update' element={<Profile/>}/>
            </Route>
            <Route path='theme'>
                <Route path='create' element={<CreateTheme/>}/>
                <Route path=':themeId' element={<Theme/>}/>
                <Route path='find' element={<Themes/>}/>
                <Route path=':themeId/update' element={<UpdateTheme/>}/>
                <Route path='my' element={<MyThemes/>}/>
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
