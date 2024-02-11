import {configureStore} from '@reduxjs/toolkit';
import signUpReducer from './slices/SignUpSlice'
import loginReducer from './slices/LoginSlice'
import forgotPasswordReducer from './slices/forgotPasswordSlice'
import userSlice from './slices/user'

export const store = configureStore({
	reducer: {
		signUp: signUpReducer,
		login: loginReducer,
		forgotPassword: forgotPasswordReducer,
		user: userSlice
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;