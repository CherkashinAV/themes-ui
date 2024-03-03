import {configureStore} from '@reduxjs/toolkit';
import signUpReducer from './slices/SignUpSlice'
import loginReducer from './slices/LoginSlice'
import forgotPasswordReducer from './slices/ForgotPasswordSlice'
import resetPasswordReducer from './slices/ResetPasswordSlice'
import userReducer from './slices/User'
import createThemeReducer from './slices/CreateThemeSlice'

export const store = configureStore({
	reducer: {
		signUp: signUpReducer,
		login: loginReducer,
		forgotPassword: forgotPasswordReducer,
		resetPassword: resetPasswordReducer,
		user: userReducer,
		createTheme: createThemeReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;