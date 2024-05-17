import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import {Theme, UserWithDetails} from '../../types';
import {themesProvider} from '../../providers/themes';
import {RootState} from '..';

type AcceptRequestPayload = {
	groupId: number;
	userUid: string;
	themeId: number;
}

type AcceptRequestReturn = {
	user: UserWithDetails;
	requestDateTime: string;
	themeId: number;
}

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

export const getThemesIds = createAsyncThunk<number[], {orgId: number, userUid: string | undefined}, {rejectValue: string}>(
	'myThemes/getIds',
	async (payload: {orgId: number, userUid?: string}, {rejectWithValue}) => {
		const result = await themesProvider.getThemes(payload.orgId, payload.userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
);

export const acceptRequest = createAsyncThunk<AcceptRequestReturn, AcceptRequestPayload, {rejectValue: string}>(
	'mythemes/acceptRequest',
	async (payload: AcceptRequestPayload, {rejectWithValue, getState}) => {
		const state = getState() as RootState;
		const currentTheme = state.myThemes.themes.find((theme) => theme.id === payload.themeId)

		if (!currentTheme) {
			return rejectWithValue('No such theme');
		}

		const user = currentTheme.joinRequests.find(({user}) => user.uid === payload.userUid);

		if (!user) {
			return rejectWithValue('No such requests');
		}

		const result = await themesProvider.acceptRequest(payload.groupId, payload.userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return {
			...user,
			themeId: payload.themeId
		};
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

		return themes.sort((a, b) => {
			if (a.executorsGroup.participants < b.executorsGroup.participants) {
				return 1;
			}

			if (a.joinRequests.length < b.joinRequests.length) {
				return 1;
			}

			return -1;
		});
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
			})
			.addCase(acceptRequest.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isError = true;
			})
			.addCase(acceptRequest.fulfilled, (state, {payload}) => {
				state.isSuccess = true;
				state.themes = state.themes!.map((theme) => {
					if (theme.id === payload.themeId) {
						theme.joinRequests = theme.joinRequests.filter((request) => request.user.uid !== payload.user.uid);
						theme.executorsGroup.participants.push(payload.user)
					}

					return theme;
				});
				return state;
			});

	}
});

export const {clearState} = myThemesSlice.actions;

export default myThemesSlice.reducer;
