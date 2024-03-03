import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {CreateThemePayload, CreateThemeResponse, themesProvider} from '../../providers/themes';

interface CreateThemeState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	themeId: number
}

const initialState: CreateThemeState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	themeId: 0
}

export const createTheme = createAsyncThunk<CreateThemeResponse, CreateThemePayload, {rejectValue: string}>(
	'theme/create',
	async (payload: CreateThemePayload, {rejectWithValue}) => {
		const result = await themesProvider.createTheme(payload);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
)

const createThemeSlice = createSlice({
	name: 'createTheme',
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
			.addCase(createTheme.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
			})
			.addCase(createTheme.pending, (state) => {
				state.isFetching = true
			})
			.addCase(createTheme.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.themeId = payload.themeId;
			});
	}
});

export const {clearState} = createThemeSlice.actions;

export default createThemeSlice.reducer;
