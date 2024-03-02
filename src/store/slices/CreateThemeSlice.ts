import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authProvider} from '../../providers/auth';

interface CreateThemeState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string
}

const initialState: CreateThemeState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: ''
}

export const sendEmail = createAsyncThunk<void, string, {rejectValue: string}>(
	'sendEmail/send',
	async (email: string, {rejectWithValue}) => {
		const result = await authProvider.sendPasswordRestoreLink({
			email,
			linkToResetForm: 'http://localhost:3000/auth/reset_password'
		});

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}
	}
)

const forgotPasswordSlice = createSlice({
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

export const {clearState} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
