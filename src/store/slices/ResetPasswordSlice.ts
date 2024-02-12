import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authProvider, ResetPasswordPayload} from '../../providers/auth';

interface ResetPasswordState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string
}

const initialState: ResetPasswordState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: ''
}

export const resetPassword = createAsyncThunk<void, ResetPasswordPayload, {rejectValue: string}>(
	'resetPassword/reset',
	async (resetPasswordPayload: ResetPasswordPayload, {rejectWithValue}) => {
		const result = await authProvider.resetPassword(resetPasswordPayload)

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}
	}
)

const resetPasswordSlice = createSlice({
	name: 'resetPassword',
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
			.addCase(resetPassword.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
			})
			.addCase(resetPassword.pending, (state) => {
				state.isFetching = true
			})
			.addCase(resetPassword.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
			});
	}
});

export const {clearState} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
