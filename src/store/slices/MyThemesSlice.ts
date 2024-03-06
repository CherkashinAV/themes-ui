import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import {Theme} from '../../types';
import {themesProvider} from '../../providers/themes';
import {RootState} from '..';

interface ThemesState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	themes: Theme[],
	themeIds: number[]
}

const initialState: ThemesState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	themes: [],
	themeIds: [],
}

export const getThemesIds = createAsyncThunk<number[], {userUid: string | undefined}, {rejectValue: string}>(
	'myThemes/getIds',
	async (payload: {userUid?: string}, {rejectWithValue}) => {
		const result = await themesProvider.getThemes(payload.userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
);

export const getThemes = createAsyncThunk<Theme[], void, {rejectValue: string}>(
	'myThemes/getThemes',
	async (_, {rejectWithValue, getState}) => {
		const {themeIds} = (getState() as RootState).myThemes;
		const result = await Promise.all(themeIds.map((id) => themesProvider.getTheme(`${id}`)));
		const themes: Theme[] = [];
		for (const themeResult of result) {
			if (!themeResult.ok) {
				return rejectWithValue('Unknown error')
			}
			themes.push(themeResult.value);
		}

		return themes;
	}
);

const myThemesSlice = createSlice({
	name: 'myThemes',
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
			.addCase(getThemesIds.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false;
				state.isError = true;
			})
			.addCase(getThemesIds.pending, (state) => {
				state.isFetching = true
			})
			.addCase(getThemesIds.fulfilled, (state, {payload}) => {
				state.themeIds = payload;
				return state;
			})
			.addCase(getThemes.fulfilled, (state, {payload}) => {
				state.themes = payload;
				state.isSuccess = true;
			});

	}
});

export const {clearState} = myThemesSlice.actions;

export default myThemesSlice.reducer;
