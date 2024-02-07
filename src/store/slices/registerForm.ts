import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RegisterForm} from '../../types';
import {validateRegisterFormValue} from '../../utils/validators';
import {redirect, useNavigate} from 'react-router-dom';

interface RegisterFormState {
	checkBox: boolean,
	loading: boolean,
	error: string,
	registered: boolean
}

const initialState: RegisterFormState = {
	checkBox: true,
	loading: false,
	error: '',
	registered: false
}

export const register = createAsyncThunk<string, RegisterForm, {rejectValue: string}>(
	'registration/register',
	async (formData: RegisterForm, {rejectWithValue}) => {
		const validateResult = validateRegisterFormValue(formData);
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

const registrationFormSlice = createSlice({
	name: 'registration',
	initialState,
	reducers: {
		toggleCheckbox(state: RegisterFormState) {
			state.checkBox = !state.checkBox;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.rejected, (state, {payload}) => {
				if (payload) {
					state.error = payload;
				}
				state.loading = false
			})
			.addCase(register.pending, (state) => {
				state.loading = true
			})
			.addCase(register.fulfilled, (state, {payload}) => {
				state.loading=false;
				state.registered=true;
			});
	}
});

export const {toggleCheckbox, } = registrationFormSlice.actions;

export default registrationFormSlice.reducer;
