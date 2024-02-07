import {configureStore} from '@reduxjs/toolkit';
import registrationReducer from './slices/registerForm'

export const store = configureStore({
	reducer: {
		registrationForm: registrationReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;