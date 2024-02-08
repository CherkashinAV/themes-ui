import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {SendEmailForm} from '../../types';

interface ForgotPasswordFormState {
	loading: boolean,
	error: string,
	emailSent: boolean
}

const initialState: ForgotPasswordFormState = {
	loading: false,
	error: '',
	emailSent: false
}

export const sendEmail = createAsyncThunk<string, SendEmailForm, {rejectValue: string}>(
	'sendEmail/send',
	async (formData: SendEmailForm, {rejectWithValue}) => {
		try {
			const data = await new Promise<string>((res, rej) => setTimeout(() => res('ok'), 100));
			return data;
		} catch(err) {
			return rejectWithValue('Что-то пошло не так');
		}
	}
)

const forgotPasswordFormSlice = createSlice({
	name: 'sendEmail',
	initialState,
	reducers: {
		trySendAgain(state) {
			state.emailSent = false;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(sendEmail.rejected, (state, {payload}) => {
				if (payload) {
					state.error = payload;
				}
				state.loading = false
				state.emailSent = false;
			})
			.addCase(sendEmail.pending, (state) => {
				state.loading = true
			})
			.addCase(sendEmail.fulfilled, (state, {payload}) => {
				state.loading = false;
				state.emailSent = true;
			});
	}
});

export const {trySendAgain} = forgotPasswordFormSlice.actions;

export default forgotPasswordFormSlice.reducer;
