import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {JwtPayload} from '../../types';
import {parseJwt} from '../../utils';
import {getFingerPrint} from '../../utils/authUtils';
import {User, authProvider} from '../../providers/auth';
import {cookieStorageManager} from '@chakra-ui/react';

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
		const {userId} = await parseJwt<JwtPayload>(accessToken) ?? {userId: ''}

		const result = await authProvider.userInfo({accessToken, userId});

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
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
	}
});

export const {storeUserInfo} = userSlice.actions;

export default userSlice.reducer;