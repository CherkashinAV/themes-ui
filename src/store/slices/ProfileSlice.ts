import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {themesProvider} from '../../providers/themes';
import {User} from '../../types';

interface ProfileState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	currentProfile: User | null
}

const initialState: ProfileState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	currentProfile: null
}

export const getProfile = createAsyncThunk<User, string, {rejectValue: string}>(
	'profile/get',
	async (userUid: string, {rejectWithValue}) => {
		const result = await themesProvider.getProfile(userUid);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
)

const profileSlice = createSlice({
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
			.addCase(getProfile.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false
				state.isError = true;
			})
			.addCase(getProfile.pending, (state) => {
				state.isFetching = true
			})
			.addCase(getProfile.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.currentProfile = payload;
			});
	}
});

export const {clearState} = profileSlice.actions;

export default profileSlice.reducer;
