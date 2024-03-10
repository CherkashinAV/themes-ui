import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import {Theme, User} from '../../types';
import {themesProvider} from '../../providers/themes';
import {RootState} from '..';

interface MentorsState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	mentors: User[],
	mentorIds: number[],
	loadCount: number,
	lastIndex: number,
	filters: Record<string, string>
}

const initialState: MentorsState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	mentors: [],
	mentorIds: [],
	loadCount: 10,
	lastIndex: 0,
	filters: {}
}

export const getMentorIds = createAsyncThunk<number[], {userUid: string | undefined}, {rejectValue: string}>(
	'themes/getIds',
	async (payload: {userUid?: string}, {rejectWithValue}) => {
		const result = await themesProvider.getThemes(payload.userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
);

export const getMentors = createAsyncThunk<{mentors: User[], lastIndex: number}, {count?: number}, {rejectValue: string}>(
	'themes/getThemes',
	async (payload: {count?: number}, {rejectWithValue, getState}) => {
		const {mentorIds, lastIndex, loadCount} = (getState() as RootState).mentors;
		let to = lastIndex + loadCount;
		if (payload.count) {
			to = lastIndex + payload.count;
		}

		if (to > mentorIds.length - 1) {
			to = mentorIds.length - 1;
		}

		const fetchIds = mentorIds.slice(lastIndex, to);
		const result = await Promise.all(fetchIds.map((id) => themesProvider.getProfile(`${id}`)));
		const mentors: User[] = [];
		for (const themeResult of result) {
			if (!themeResult.ok) {
				return rejectWithValue('Unknown error')
			}
			mentors.push(themeResult.value);
		}

		return {mentors, lastIndex: to};
	}
);

const mentorSlice = createSlice({
	name: 'mentor',
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
			.addCase(getMentorIds.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false;
				state.isError = true;
			})
			.addCase(getMentorIds.pending, (state) => {
				state.isFetching = true
			})
			.addCase(getMentorIds.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.mentorIds = payload;
				return state;
			})
			// .addCase(getMentors.fulfilled, (state, {payload}) => {
			// 	state.mentors.push(...payload.mentors);
			// 	state.lastIndex = payload.lastIndex;
			// });

	}
});

export const {clearState} = mentorSlice.actions;

export default mentorSlice.reducer;
