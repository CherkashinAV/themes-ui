import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {User} from '../../types';
import {parseJwt} from '../../utils';

interface UserState {
	userInfo: User | null,
	accessToken: string
}

const initialState: UserState = {
	accessToken: '',
	userInfo: null
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		storeToken(state, action: PayloadAction<string>) {
			state.accessToken = action.payload;

			const decoded = parseJwt<User>(action.payload);

			state.userInfo = decoded;
		}
	},
	extraReducers: (builder) => {
	}
});

export const {storeToken} = userSlice.actions;

export default userSlice.reducer;