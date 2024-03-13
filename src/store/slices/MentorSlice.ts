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
	mentorUids: string[],
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
	mentorUids: [],
	loadCount: 10,
	lastIndex: 0,
	filters: {}
}

export const getMentorIds = createAsyncThunk<string[], void, {rejectValue: string}>(
	'mentor/getMentorIds',
	async (_, {rejectWithValue}) => {
		const result = await authProvider.users('mentor');

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
);

export const getMentors = createAsyncThunk<{mentors: User[], lastIndex: number}, {count?: number}, {rejectValue: string}>(
	'mentor/getMentors',
	async (payload: {count?: number}, {rejectWithValue, getState}) => {
		const {mentorUids, lastIndex, loadCount} = (getState() as RootState).mentors;
		let to = lastIndex + loadCount;
		if (payload.count) {
			to = lastIndex + payload.count;
		}

		if (to > mentorUids.length - 1) {
			to = mentorUids.length;
		}

		const fetchIds = mentorUids.slice(lastIndex, to);
		console.log(lastIndex, to)
		const result = await Promise.all(fetchIds.map((uid) => themesProvider.getProfile(uid)));
		const mentors: User[] = [];
		for (const userResult of result) {
			if (!userResult.ok) {
				return rejectWithValue('Unknown error')
			}
			mentors.push(userResult.value);
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
			state.mentorUids = [];
			state.mentors = [];
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
				state.mentorUids = payload;
				return state;
			})
			.addCase(getMentors.fulfilled, (state, {payload}) => {
				state.mentors.push(...payload.mentors);
				state.lastIndex = payload.lastIndex;
				return state;
			});

	}
});

export const {clearState} = mentorSlice.actions;

export default mentorSlice.reducer;
