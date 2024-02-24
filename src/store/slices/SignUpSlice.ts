import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RegisterPayload, authProvider} from '../../providers/auth';

interface SignUpState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
}

const initialState: SignUpState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: ''
}


export const signUp = createAsyncThunk<void, RegisterPayload, {rejectValue: string}>(
	'registration/register',
	async (registerPayload: RegisterPayload, {rejectWithValue}) => {
		const result = await authProvider.register(registerPayload);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}
	}
)

const signUpSlice = createSlice({
	name: 'registration',
	initialState,
	reducers: {
		clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isFetching = false;

            return state;
        }
	},
	extraReducers: (builder) => {
		builder
			.addCase(signUp.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false;
				state.isError = true;
			})
			.addCase(signUp.pending, (state) => {
				state.isFetching = true
			})
			.addCase(signUp.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				return state;
			});
	}
});

export const {clearState} = signUpSlice.actions;

export default signUpSlice.reducer;
