import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {parseJwt} from '../../utils';
import {getFingerPrint} from '../../utils/authUtils';
import {authProvider} from '../../providers/auth';
import {UpdateProfilePayload, themesProvider} from '../../providers/themes';
import {JwtPayload, User} from '../../types';

interface UserState {
	userInfo: User | null,
	isLoading: boolean
}

const initialState: UserState = {
	userInfo: null,
	isLoading: false
}

export const logout = createAsyncThunk<void, undefined, {rejectValue: string}>(
	'user/logout',
	async (_, {rejectWithValue}) => {
		const accessToken = localStorage.getItem('accessToken') ?? '';
		const fingerprint = await getFingerPrint() ?? '';

		const result = await authProvider.logout({
			accessToken,
			fingerprint
		});

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}
	}
);

export const getUserInfo = createAsyncThunk<User, undefined, {rejectValue: string}>(
	'user/userInfo',
	async (_, {rejectWithValue}) => {
		const accessToken = localStorage.getItem('accessToken') ?? '';

		const jwtPayload = parseJwt<JwtPayload>(accessToken);

		if (!jwtPayload) {
			return rejectWithValue('Error while parsing JWT');
		}

		const result = await themesProvider.getProfile(jwtPayload.userId);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
);

export const updateUser = createAsyncThunk<UpdateProfilePayload, UpdateProfilePayload, {rejectValue: string}>(
	'user/updateUser',
	async (payload: UpdateProfilePayload, {rejectWithValue}) => {
		const result = await themesProvider.updateProfile(payload);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return payload;
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		storeUserInfo(state, action: PayloadAction<string>) {
			const decoded = parseJwt<User>(action.payload);

			state.userInfo = decoded;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(logout.fulfilled, (state) => {
				state.userInfo = null;
				localStorage.removeItem('accessToken');
			})
			.addCase(getUserInfo.fulfilled, (state, {payload}) => {
				if (payload) {
					state.userInfo = payload
				}
			})
			.addCase(getUserInfo.rejected, (state) => {
				state.userInfo = null;
			})
			.addCase(updateUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateUser.fulfilled, (state, {payload}) => {
				if (payload && state.userInfo) {
					state.userInfo.description = payload.description;
				}
				state.isLoading = false;
			})
			.addCase(updateUser.rejected, (state) => {
				state.isLoading = false;
			})
	}
});

export const {storeUserInfo} = userSlice.actions;

export default userSlice.reducer;