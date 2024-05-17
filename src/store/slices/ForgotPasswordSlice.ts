import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authProvider} from '../../providers/auth';
import secrets from '../../secrets/secrets.json';

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

export const sendEmail = createAsyncThunk<void, string, {rejectValue: string}>(
	'sendEmail/send',
	async (email: string, {rejectWithValue}) => {
		const result = await authProvider.sendPasswordRestoreLink({
			email,
			linkToResetForm: 'http://localhost:3000/auth/reset_password',
			senderOptions: {
				email: secrets.senderEmail,
				emailSecret: secrets.senderEmailSecret,
				templateUid: '11111111-f625-41ca-a353-068d6ed70fc5'
			}
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
