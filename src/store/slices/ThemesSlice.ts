import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import {Theme, ThemeType} from '../../types';
import {themesProvider} from '../../providers/themes';
import {RootState} from '..';

export type Filters = Partial<{
	type: ThemeType | 'no' ,
	private: string
	slotsCount: number
}>

interface ThemesState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	themes: Theme[],
	themeIds: number[],
	loadCount: number,
	lastIndex: number,
	filters: Filters | null
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
	filters: null
}

export const getThemesIds = createAsyncThunk<number[], {userUid: string | undefined}, {rejectValue: string}>(
	'themes/getIds',
	async (payload: {userUid?: string}, {rejectWithValue, getState}) => {
		const {filters} = (getState() as RootState).themes;
		const result = await themesProvider.getThemes(payload.userUid, filters ?? undefined);

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

		if (to > themeIds.length) {
			to = themeIds.length;
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
			state.themes = [];
			state.themeIds = [];
			state.errorMessage = '';
			state.lastIndex = 0;
			state.filters = null;

			return state;
		},
		setFilters(state, action: PayloadAction<Filters>) {
			state.filters = action.payload;
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

				return state;
			})
			.addCase(getThemesIds.pending, (state) => {
				state.isFetching = true

				return state;
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

				return state;
			});

	}
});

export const {clearState, setFilters} = themesSlice.actions;

export default themesSlice.reducer;
