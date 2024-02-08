import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginForm} from '../../types';
import {validateLoginFormValue} from '../../utils/validators';

interface LoginFormState {
	loading: boolean,
	error: string,
}

const initialState: LoginFormState = {
	loading: false,
	error: '',
}

export const login = createAsyncThunk<string, LoginForm, {rejectValue: string}>(
	'login/login',
	async (formData: LoginForm, {rejectWithValue}) => {
		const validateResult = validateLoginFormValue(formData);
		if (!validateResult.ok) {
			return rejectWithValue(validateResult.error);
		}

		try {
			const data = await new Promise<string>((res, rej) => setTimeout(() => res('ok'), 100));
			return data;
		} catch(err) {
			return rejectWithValue('Что-то пошло не так');
		}
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
				state.loading=false;
			});
	}
});

export default loginFormSlice.reducer;
