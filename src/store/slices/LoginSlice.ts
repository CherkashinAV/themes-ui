import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import {parseJwt} from '../../utils';
import {JwtPayload} from '../../types';

interface LoginState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	uid: string
}

const initialState: LoginState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	uid: ''
}

export const login = createAsyncThunk<LoginResponse, LoginPayload, {rejectValue: string}>(
	'login/login',
	async (loginPayload: LoginPayload, {rejectWithValue}) => {
		// const validateResult = validateLoginFormValue(loginPayload);
		// if (!validateResult.ok) {
		// 	return rejectWithValue(validateResult.error);
		// }

		const result = await authProvider.login(loginPayload);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		localStorage.setItem('accessToken', result.value.accessToken);

		return result.value;
	}
)

const loginSlice = createSlice({
	name: 'login',
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
			.addCase(login.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false;
				state.isError = true;
			})
			.addCase(login.pending, (state) => {
				state.isFetching = true
			})
			.addCase(login.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				const jwtPayload = parseJwt<JwtPayload>(payload.accessToken);

				if (jwtPayload) {
					state.uid = jwtPayload.userId;
				}

				return state;
			});
	}
});

export const {clearState} = loginSlice.actions;

export default loginSlice.reducer;
