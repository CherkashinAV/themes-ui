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
import mentorsReducer from './slices/MentorSlice'
import notificationsReducer from './slices/NotificationSlice';
import registerInvitationsReducer from './slices/RegisterInvitationsSlice';
import rulesReducer from './slices/RulesSlice';

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
		profile: profileReducer,
		mentors: mentorsReducer,
		notifications: notificationsReducer,
		registerInvitations: registerInvitationsReducer,
		rules: rulesReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;