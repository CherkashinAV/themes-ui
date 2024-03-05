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
	themeIds: number[],
	loadCount: number,
	lastIndex: number,
	filters: Record<string, string>
}

const initialState: ThemesState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	themes: [],
	themeIds: [],
	loadCount: 10,
	lastIndex: 0,
	filters: {}
}

export const getThemesIds = createAsyncThunk<number[], {userUid: string | undefined}, {rejectValue: string}>(
	'themes/getIds',
	async (payload: {userUid?: string}, {rejectWithValue}) => {
		const result = await themesProvider.getThemes(payload.userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
);

export const getThemes = createAsyncThunk<{themes: Theme[], lastIndex: number}, {count?: number}, {rejectValue: string}>(
	'themes/getThemes',
	async (payload: {count?: number}, {rejectWithValue, getState}) => {
		const {themeIds, lastIndex, loadCount} = (getState() as RootState).themes;
		let to = lastIndex + loadCount;
		if (payload.count) {
			to = lastIndex + payload.count;
		}

		if (to > themeIds.length - 1) {
			to = themeIds.length - 1;
		}

		const fetchIds = themeIds.slice(lastIndex, to);
		console.log(lastIndex, to)
		const result = await Promise.all(fetchIds.map((id) => themesProvider.getTheme(`${id}`)));
		const themes: Theme[] = [];
		for (const themeResult of result) {
			if (!themeResult.ok) {
				return rejectWithValue('Unknown error')
			}
			themes.push(themeResult.value);
		}

		return {themes, lastIndex: to};
	}
);

const themesSlice = createSlice({
	name: 'themes',
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
				state.isFetching = false;
				state.isSuccess = true;
				state.themeIds = payload;
				return state;
			})
			.addCase(getThemes.fulfilled, (state, {payload}) => {
				state.themes.push(...payload.themes);
				state.lastIndex = payload.lastIndex;
			});

	}
});

export const {clearState} = themesSlice.actions;

export default themesSlice.reducer;
