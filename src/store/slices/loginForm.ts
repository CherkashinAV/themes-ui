import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginForm} from '../../types';
import {validateLoginFormValue} from '../../utils/validators';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import browserFingerprint from 'browser-fingerprint';
import {getFingerPrint} from '../../utils/authUtils';

interface LoginFormState {
	loading: boolean,
	error: string,
}

const initialState: LoginFormState = {
	loading: false,
	error: '',
}

export const login = createAsyncThunk<LoginResponse, LoginForm, {rejectValue: string}>(
	'login/login',
	async (formData: LoginForm, {rejectWithValue}) => {
		const validateResult = validateLoginFormValue(formData);
		if (!validateResult.ok) {
			return rejectWithValue(validateResult.error);
		}

		const fingerprint = await getFingerPrint();
		console.log(fingerprint);
		const result = await authProvider.login({
			...formData,
			fingerprint
		} as LoginPayload);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
)

const loginFormSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(login.rejected, (state, {payload}) => {
				if (payload) {
					state.error = payload;
				}
				state.loading = false
			})
			.addCase(login.pending, (state) => {
				state.loading = true
			})
			.addCase(login.fulfilled, (state, {payload}) => {
				state.error='';
				state.loading=false;
			});
	}
});

export default loginFormSlice.reducer;
