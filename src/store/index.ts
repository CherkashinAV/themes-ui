import {configureStore} from '@reduxjs/toolkit';
import signUpReducer from './slices/SignUpSlice'
import loginReducer from './slices/LoginSlice'
import forgotPasswordReducer from './slices/ForgotPasswordSlice'
import resetPasswordReducer from './slices/ResetPasswordSlice'
import userReducer from './slices/User'
import createThemeReducer from './slices/CreateThemeSlice'
import updateThemeReducer from './slices/UpdateThemeSlice'
import themeReducer from './slices/ThemeSlice'
import themesReducer from './slices/ThemesSlice'
import myThemesReducer from './slices/MyThemesSlice';
import profileReducer from './slices/ProfileSlice'

export const store = configureStore({
	reducer: {
		signUp: signUpReducer,
		login: loginReducer,
		forgotPassword: forgotPasswordReducer,
		resetPassword: resetPasswordReducer,
		user: userReducer,
		createTheme: createThemeReducer,
		updateTheme: updateThemeReducer,
		theme: themeReducer,
		themes: themesReducer,
		myThemes: myThemesReducer,
		profile: profileReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;