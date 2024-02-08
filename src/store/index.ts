import {configureStore} from '@reduxjs/toolkit';
import registrationReducer from './slices/registerForm'
import loginReducer from './slices/loginForm'
import forgotPasswordReducer from './slices/forgotPasswordForm'

export const store = configureStore({
	reducer: {
		registrationForm: registrationReducer,
		loginForm: loginReducer,
		forgotPasswordForm: forgotPasswordReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;