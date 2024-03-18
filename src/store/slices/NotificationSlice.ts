import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {themesProvider} from '../../providers/themes';
import {Notification} from '../../types';

interface NotificationsState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	notifications: Notification[]
}

const initialState: NotificationsState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	notifications: []
}

export const getNotifications = createAsyncThunk<Notification[], void, {rejectValue: string}>(
	'notifications/get',
	async (_, {rejectWithValue}) => {
		const result = await themesProvider.getNotifications();

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return result.value;
	}
)

export const lookNotification = createAsyncThunk<number, number, {rejectValue: string}>(
	'notifications/look',
	async (id: number, {rejectWithValue}) => {
		const result = await themesProvider.lookNotification(id);

		if (!result.ok) {
			return rejectWithValue(result.error.message);
		}

		return id;
	}
)

const notificationSlice = createSlice({
	name: 'notifications',
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
			.addCase(getNotifications.rejected, (state, {payload}) => {
				if (payload) {
					state.errorMessage = payload;
				}
				state.isFetching = false;
				state.isError = true;
			})
			.addCase(getNotifications.pending, (state) => {
				state.isFetching = true
			})
			.addCase(getNotifications.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.notifications = payload;
				return state;
			})
			.addCase(lookNotification.fulfilled, (state, {payload}) => {
				state.notifications = state.notifications.map((notification) => {
					if (notification.id === payload) {
						notification.new = false;
					}

					return notification;
				})
			});
	}
});

export const {clearState} = notificationSlice.actions;

export default notificationSlice.reducer;
