import {configureStore} from '@reduxjs/toolkit';
import registrationReducer from './slices/registerForm'
import loginReducer from './slices/loginForm'
import forgotPasswordReducer from './slices/forgotPasswordForm'
import userSlice from './slices/user'

export const store = configureStore({
	reducer: {
		registrationForm: registrationReducer,
		loginForm: loginReducer,
		forgotPasswordForm: forgotPasswordReducer,
		user: userSlice
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;