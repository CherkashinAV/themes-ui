import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authProvider} from '../../providers/auth';
import {Rule, User} from '../../types';
import {MentorResponsePayload, themesProvider} from '../../providers/themes';
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
	filters: Record<string, string>,
	search: string | null;
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
	filters: {},
	search: null
}

export const getMentorIds = createAsyncThunk<string[], void, {rejectValue: string}>(
	'mentor/getMentorIds',
	async (_, {rejectWithValue, getState}) => {
		const state = (getState() as RootState).mentors;
		const result = await authProvider.users('mentor', state.search ?? undefined);

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
		console.log('here')
		let to = lastIndex + loadCount;
		if (payload.count) {
			to = lastIndex + payload.count;
		}
		
		if (to > mentorUids.length) {
			to = mentorUids.length;
		}
		
		if (lastIndex === to) {
			rejectWithValue('Already fetched');
		}

		const fetchIds = mentorUids.slice(lastIndex, to);
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
			state.lastIndex = 0;
			return state;
		},
		setSearch(state, action: PayloadAction<string>) {
			state.search = action.payload;
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
				if (state.mentorUids.length === state.mentors.length) {
					return state;
				}
				state.mentors.push(...payload.mentors);
				state.lastIndex = payload.lastIndex;
				return state;
			});
	}
});

export const {clearState, setSearch} = mentorSlice.actions;

export default mentorSlice.reducer;
