import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {themesProvider} from '../../providers/themes';
import {Theme, UserWithDetails} from '../../types';
import {RootState} from '..';

type AcceptRequestPayload = {
	groupId: number;
	userUid: string;
}

interface ThemeState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	data: Theme | null,
	isAlreadyJoined: boolean,
	isCreator: boolean,
	isApprover: boolean
}

const initialState: ThemeState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	data: null,
	isAlreadyJoined: false,
	isCreator: false,
	isApprover: false
}

export const getTheme = createAsyncThunk<Theme, string, {rejectValue: string}>(
	'theme/get',
	async (themeId: string, {rejectWithValue}) => {
		const result = await themesProvider.getTheme(themeId);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
)

export const joinRequest = createAsyncThunk<{user: UserWithDetails, requestDateTime: string}, number, {rejectValue: string}>(
	'theme/join',
	async (themeId: number, {rejectWithValue, getState}) => {
		const state = getState() as RootState;
		if (state.theme.isAlreadyJoined) {
			return rejectWithValue('Already sent request');
		}
		const result = await themesProvider.joinRequest(themeId);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
);

export const acceptRequest = createAsyncThunk<{user: UserWithDetails, requestDateTime: string}, AcceptRequestPayload, {rejectValue: string}>(
	'theme/acceptRequest',
	async (payload: AcceptRequestPayload, {rejectWithValue, getState}) => {
		const state = getState() as RootState;
		const user = state.theme.data?.joinRequests.find(({user}) => user.uid === payload.userUid);

		if (!user) {
			return rejectWithValue('No such requests');
		}

		const result = await themesProvider.acceptRequest(payload.groupId, payload.userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return user;
	}
);

export const deleteRequest = createAsyncThunk<{user: UserWithDetails, requestDateTime: string}, AcceptRequestPayload, {rejectValue: string}>(
	'theme/deleteRequest',
	async (payload: AcceptRequestPayload, {rejectWithValue, getState}) => {
		const state = getState() as RootState;
		const user = state.theme.data?.joinRequests.find(({user}) => user.uid === payload.userUid);

		if (!user) {
			return rejectWithValue('No such requests');
		}

		const result = await themesProvider.deleteRequest(payload.groupId, payload.userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return user;
	}
);

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		clearState(state) {
			state.isError = false;
			state.isSuccess = false;
			state.isFetching = false;

			return state;
		},
		checkIsJoined(state, action: PayloadAction<string>) {
			state.isAlreadyJoined = 
				state.data!.joinRequests.some(({user}) => user.uid === action.payload) || 
				state.data!.executorsGroup.participants.some((user) => user.uid === action.payload);
			return state;
		},
		checkUserRights(state, action: PayloadAction<string>) {
			state.isCreator = state.data?.creator.uid === action.payload;
			state.isApprover = state.data?.approver?.uid === action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getTheme.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
				state.data = null;
			})
			.addCase(getTheme.pending, (state) => {
				state.isFetching = true;
			})
			.addCase(getTheme.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.data = payload;
			})
			.addCase(joinRequest.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
			})
			.addCase(joinRequest.pending, (state) => {
				state.isFetching = true;
			})
			.addCase(joinRequest.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.data!.joinRequests.push(payload)
				return state;
			})
			.addCase(acceptRequest.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isError = true;
			})
			.addCase(acceptRequest.fulfilled, (state, {payload}) => {
				state.isSuccess = true;
				state.data!.joinRequests = state.data!.joinRequests.filter(({user}) => user.uid !== payload.user.uid);
				state.data!.executorsGroup.participants.push(payload.user)
				return state;
			})
			.addCase(deleteRequest.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
			})
			.addCase(deleteRequest.pending, (state) => {
				state.isFetching = true;
			})
			.addCase(deleteRequest.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.data!.joinRequests = state.data!.joinRequests.filter(({user}) => user.uid !== payload.user.uid);
				return state;
			})
			
	}
});

export const {clearState, checkIsJoined, checkUserRights} = themeSlice.actions;

export default themeSlice.reducer;
