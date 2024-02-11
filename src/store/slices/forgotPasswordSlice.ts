import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {SendEmailForm} from '../../types';

interface ForgotPasswordState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string
}

const initialState: ForgotPasswordState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: ''
}

export const sendEmail = createAsyncThunk<string, string, {rejectValue: string}>(
	'sendEmail/send',
	async (email: string, {rejectWithValue}) => {
		try {
			const data = await new Promise<string>((res, rej) => setTimeout(() => res('ok'), 100));
			return data;
		} catch(err) {
			return rejectWithValue('Что-то пошло не так');
		}
	}
)

const forgotPasswordFormSlice = createSlice({
	name: 'forgotPassword',
	initialState,
	reducers: {
		clearState(state) {
			state.isError = false;
			state.isSuccess = false;
			state.isFetching = false;

			return state;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(sendEmail.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
			})
			.addCase(sendEmail.pending, (state) => {
				state.isFetching = true
			})
			.addCase(sendEmail.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
			});
	}
});

export const {clearState} = forgotPasswordFormSlice.actions;

export default forgotPasswordFormSlice.reducer;
