import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {CreateThemePayload, CreateThemeResponse, UpdateThemePayload, themesProvider} from '../../providers/themes';
import {Theme} from '../../types';

interface UpdateThemeState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	currentTheme: Theme | null
}

const initialState: UpdateThemeState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	currentTheme: null
}

export const updateTheme = createAsyncThunk<null, UpdateThemePayload, {rejectValue: string}>(
	'theme/update',
	async (payload: UpdateThemePayload, {rejectWithValue}) => {
		const result = await themesProvider.updateTheme(payload);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
)

const updateThemeSlice = createSlice({
	name: 'updateTheme',
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
			.addCase(updateTheme.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
			})
			.addCase(updateTheme.pending, (state) => {
				state.isFetching = true
			})
			.addCase(updateTheme.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
			});
	}
});

export const {clearState} = updateThemeSlice.actions;

export default updateThemeSlice.reducer;
