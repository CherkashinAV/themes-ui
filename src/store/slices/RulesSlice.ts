import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {LoginPayload, LoginResponse, authProvider} from '../../providers/auth';
import {DateInterval, MemberInvitationInfo, Rule, ThemeType} from '../../types';
import {RootState} from '..';
import {themesProvider} from '../../providers/themes';
import {getDownloadLink, s3Client} from '../../lib/s3';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import {v4} from 'uuid';

interface RulesState {
	isFetching: boolean,
	isSuccess: boolean,
	isError: boolean,
	errorMessage: string,
	rules: Rule[];
}

const initialState: RulesState = {
	isFetching: false,
	isSuccess: false,
	isError: false,
	errorMessage: '',
	rules: []
}

interface AddRulePayload{
	joinDate: string;
	realizationDates: DateInterval;
	title: string;
	type: ThemeType;
	expirationDate: string;
	file: File | null;
	organizationId: number;
}

export const createRule = createAsyncThunk<Rule, AddRulePayload, {rejectValue: string}>(
	'moderation/addRule',
	async (payload, {rejectWithValue, getState}) => {
		const {userInfo} = (getState() as RootState).user;
		if (!payload.file) {
			return rejectWithValue('Файл не загружен');
		}

		const s3Name = `${v4()}.${payload.file!.name.split('.')[1]}`;

		let url: string;

		try {
			await s3Client.send(new PutObjectCommand({
				Bucket: 'project-rules',
				Key: `${userInfo!.organization.shortName}/${s3Name}`,
				Body: payload.file!,
			}));

			url = await getDownloadLink('project-rules', `${userInfo!.organization.shortName}/${s3Name}`);
		} catch (error) {
			return rejectWithValue('Ошибка при загрузке файла')
		}

		const rulePayload = {
			downloadLink: url!,
			expirationDate: payload.expirationDate,
			joinDate: payload.joinDate,
			realizationDates: payload.realizationDates,
			title: payload.title,
			type: payload.type,
			organizationId: payload.organizationId
		};

		
		const createRuleResult = await themesProvider.createRule(rulePayload);
		console.log(createRuleResult)

		if (!createRuleResult.ok) {
			return rejectWithValue('Не удалось сохранить регламент');
		}

		return createRuleResult.value;
	}
);

export const getRules = createAsyncThunk<Rule[], void, {rejectValue: string}>(
	'moderation/getRules',
	async (_, {rejectWithValue, getState}) => {
		const {userInfo} = (getState() as RootState).user;

		const rulesResult = await themesProvider.getRules(userInfo!.organization.id);

		if (!rulesResult.ok) {
			return rejectWithValue('Не получилось загрузить доступные регламенты')
		}

		return rulesResult.value;
	}
);

const rulesSlice = createSlice({
	name: 'rules',
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
			.addCase(createRule.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;
				state.rules.push(payload);
				return state;
			})
			.addCase(createRule.rejected,(state, {payload}) => {
				state.isFetching = false;
				state.isError = true;

				if (payload) {
					state.errorMessage = payload;
				}
				return state;
			})
			.addCase(getRules.pending, (state) => {
				state.isFetching = true;
			})
			.addCase(getRules.fulfilled, (state, {payload}) => {
				state.isFetching = false;
				state.isSuccess = true;

				state.rules = payload;

				return state;
			})
			.addCase(getRules.rejected, (state, {payload}) => {
				state.isFetching = false;
				state.isError = true;

				if (payload) {
					state.errorMessage = payload;
				}
				return state;
			});
	}
});

export const {clearState} = rulesSlice.actions;

export default rulesSlice.reducer;
