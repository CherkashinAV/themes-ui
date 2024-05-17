import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {MemberInvitationInfo, Rule} from '../../types';
import {RootState} from '..';
import {themesProvider} from '../../providers/themes';
import secrets from '../../secrets/secrets.json';

interface RegisterInvitationsState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	invitations: MemberInvitationInfo[];
	rules: Rule[];
}

const initialState: RegisterInvitationsState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	invitations: [],
	rules: []
}

export const invite = createAsyncThunk<MemberInvitationInfo[], void, {rejectValue: string}>(
	'registerInvitations/sendInvitations',
	async (_, {getState}) => {
		const state = (getState() as RootState).registerInvitations;
		const user = (getState() as RootState).user;

		const newInvitations: MemberInvitationInfo[] = [];

		for (const invitation of state.invitations) {
			if (invitation.status === 'SENT') {
				continue;
			}

			const [name, surname, patronymic] = invitation.name.split(' ');
			const inviteResult = await themesProvider.inviteMember({
				email: invitation.email,
				name,
				surname,
				patronymic,
				groupName: invitation.groupName,
				post: invitation.post,
				organizationName: user.userInfo!.organization.shortName,
				role: invitation.role === 'Руководитель' ? 'mentor' : 'default',
				linkToRegisterForm: 'http://localhost:3000/auth/register',
				senderOptions: {
					email: secrets.senderEmail,
					emailSecret: secrets.senderEmailSecret,
					templateUid: '22222222-f625-41ca-a353-068d6ed70fc5'
				}
			});

			newInvitations.push({...invitation, status: inviteResult.ok ? 'SENT' : 'ERROR'}); 
		}

		return newInvitations;
	}
);


const registerInvitationsSlice = createSlice({
	name: 'registerInvitations',
	initialState,
	reducers: {
		clearState(state) {
			state.isError = false;
			state.isSuccess = false;
			state.isFetching = false;

			return state;
		},
		setInvitations(state, action: PayloadAction<MemberInvitationInfo[]>) {
			state.invitations = action.payload;

			return state;
		},
		addInvitation(state, action: PayloadAction<MemberInvitationInfo>) {
			if (state.invitations.some((invitation) => invitation.email === action.payload.email)) {
				return state;
			}
			state.invitations.push(action.payload);

			return state;
		},
		removeInvitation(state, action: PayloadAction<string>) {
			state.invitations = state.invitations.filter((invitation) => invitation.email !== action.payload);

			return state;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(invite.pending, (state) => {
				state.isFetching = true
			})
			.addCase(invite.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.invitations = payload;
				return state;
			});
	}
});

export const {clearState, setInvitations, addInvitation, removeInvitation} = registerInvitationsSlice.actions;

export default registerInvitationsSlice.reducer;
