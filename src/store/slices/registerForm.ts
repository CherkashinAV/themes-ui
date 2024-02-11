import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RegisterForm} from '../../types';
import {validateRegisterFormValue} from '../../utils/validators';
import {authProvider} from '../../providers/auth';
import {getRegisterPayload} from '../../utils/authUtils';

interface RegisterFormState {
	checkBox: boolean,
	loading: boolean,
	error: string,
}

const initialState: RegisterFormState = {
	checkBox: true,
	loading: false,
	error: '',
}

export const register = createAsyncThunk<void, RegisterForm, {rejectValue: string}>(
	'registration/register',
	async (formData: RegisterForm, {rejectWithValue}) => {
		const validateResult = validateRegisterFormValue(formData);
		if (!validateResult.ok) {
			return rejectWithValue(validateResult.error);
		}

		const result = await authProvider.register(getRegisterPayload(formData));

		if (!result.ok) {
			console.log(result.error.message)
			return rejectWithValue(result.error.message);
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
				state.error='';
				state.loading=false;
			});
	}
});

export const {toggleCheckbox, } = registrationFormSlice.actions;

export default registrationFormSlice.reducer;
