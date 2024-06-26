import {AsyncResult, Theme, ThemeType, User,  UserWithDetails, Notification, TeachingMaterial, DateInterval, Rule, OrderData} from '../types';
import axios, {AxiosResponse, Method} from 'axios';
import {getFingerPrint} from '../utils/authUtils';
import {Filters} from '../store/slices/ThemesSlice';
import {Role} from './auth';
import {Search} from 'react-router-dom';

export type ThemesErrorStatus = |
	'UNAUTHORIZED' |
	'BAD_REQUEST' |
	'UNKNOWN' |
	'NOT_ENOUGH_RIGHTS';

class ThemesError extends Error {
	status: ThemesErrorStatus;

	constructor(status: ThemesErrorStatus, message: string) {
		super(message);
		this.status = status;
	}
}

export type UpdateProfilePayload = {
	description: string;
	skills: string[];
}

export type CreateThemePayload = {
	title: string,
	shortDescription: string,
	description: string,
	executorsCount: number,
	type: ThemeType,
	teachingMaterials: TeachingMaterial[] | null,
	joinDate: string,
	realizationDates: DateInterval,
	private: boolean,
	ruleId: number | null
}

export type CreateThemeResponse = {
	status: 'OK',
	themeId: number
}

export type JoinRequestResponse = {
	status: 'OK',
	value: {user: UserWithDetails, requestDateTime: string}
}

export type UpdateThemePayload = {
	id: number,
	title: string,
	shortDescription: string,
	description: string,
	private: boolean,
	teachingMaterials: TeachingMaterial[] | null,
	joinDate: string,
	realizationDates: DateInterval,
	executorsCount: number,
	type: ThemeType,
	ruleId: number | null;
}

export type InviteMentorPayload = {
	themeId: number;
	mentorUid: string;
}

export type MentorResponsePayload = {
	themeId: number,
	notificationId: number,
	action: 'accept' | 'reject'
}

export type InviteMemberPayload = {
	email: string;
	name: string;
	surname: string;
	patronymic?: string;
	organizationName: string;
	post?: string | null;
	groupName?: string | null;
	role: Role;
	linkToRegisterForm: string;
	senderOptions: {
		email: string;
		emailSecret: string;
		templateUid: string;
	}
};

export type CreateRulePayload = {
	title: string;
	type: ThemeType;
	expirationDate: string;
	joinDate: string;
	realizationDates: DateInterval;
	downloadLink: string;
	organizationId: number;
};

export type CreateRuleResult = {
	status: 'OK',
	data: Rule
} 

class ThemesProvider {
	private _baseUrl: string;
	private _fingerprint: string = '';

	constructor() {
		this._baseUrl = 'http://localhost:8080/v1/themes/';
	}

	private async _request<T>(args: {
		path: string;
		method: Method;
		body?: Record<string, unknown>
		query?: Record<string, string | undefined>
	}): AsyncResult<AxiosResponse<T>, ThemesError> {
		const requestUrl = new URL(args.path, this._baseUrl);
		// let response: AxiosResponse<T>;
		const accessToken = localStorage.getItem('accessToken');

		if (this._fingerprint === '') {
			this._fingerprint = await getFingerPrint() ?? '';
		}

		try {
			const response = await axios.request<T>({
				method: args.method,
				url: requestUrl.toString(),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
					'X-Fingerprint': this._fingerprint
				},
				data: args.body,
				params: args.query,
				responseType: 'json',
				withCredentials: true,
			});

			return {
				ok: true,
				value: response
			}
		} catch (error) {
			const errorInstance = error as any;
			return {
				ok: false,
				error: new ThemesError(errorInstance.code, errorInstance.message)
			}
		}
	}

	async getProfile(userId: string): AsyncResult<User, ThemesError> {
		const result = await this._request<User>({
			path: 'ui/profile/get',
			method: 'GET',
			query: {userId}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data
		}
	}

	async updateProfile(payload: UpdateProfilePayload): AsyncResult<null, ThemesError> {
		const result = await this._request({
			path: 'ui/profile/update',
			method: 'PATCH',
			body: payload
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async createTheme(payload: CreateThemePayload): AsyncResult<CreateThemeResponse, ThemesError> {
		const result = await this._request<CreateThemeResponse>({
			path: 'ui/theme/create',
			method: 'POST',
			body: payload
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data
		}
	}

	async updateTheme(payload: UpdateThemePayload): AsyncResult<null, ThemesError> {
		const result = await this._request({
			path: 'ui/theme/update',
			method: 'PATCH',
			body: payload
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async getTheme(themeId: string): AsyncResult<Theme, ThemesError> {
		const result = await this._request<Theme>({
			path: 'ui/theme',
			method: 'GET',
			query: {themeId}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data
		}
	}

	async joinRequest(themeId: number): AsyncResult<{user: UserWithDetails, requestDateTime: string}, ThemesError> {
		const result = await this._request<JoinRequestResponse>({
			path: 'ui/theme/join_request',
			method: 'POST',
			body: {themeId}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data.value
		}
	}

	async acceptRequest(groupId: number, userUid: string): AsyncResult<null, ThemesError> {
		const result = await this._request({
			path: 'ui/theme/accept_request',
			method: 'POST',
			body: {groupId, userUid}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async deleteRequest(groupId: number, userUid: string): AsyncResult<null, ThemesError> {
		const result = await this._request({
			path: 'ui/theme/delete_request',
			method: 'DELETE',
			body: {groupId, userUid}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async getThemes(orgId: number, userUid?: string, filters?: Filters, search?: string): AsyncResult<number[], ThemesError> {
		let filtersDict: Record<string, string> = {};

		for (const [key, value] of Object.entries(filters ?? {})) {
			if (value === undefined) {
				continue;
			}
			filtersDict[key] = value.toString();
		}

		const result = await this._request<number[]>({
			path: 'ui/theme/all',
			method: 'get',
			query: {
				userId: userUid,
				...filtersDict,
				search,
				orgId: orgId.toString()
			}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data
		}
	}

	async inviteMentor(payload: InviteMentorPayload): AsyncResult<null, ThemesError> {
		const result = await this._request<number[]>({
			path: 'ui/theme/invite_mentor',
			method: 'post',
			body: payload
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async getNotifications(): AsyncResult<Notification[], ThemesError> {
		const result = await this._request<Notification[]>({
			path: 'ui/notifications',
			method: 'get',
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data
		}
	}

	async lookNotification(notificationId: number): AsyncResult<null, ThemesError> {
		const result = await this._request<Notification[]>({
			path: 'ui/notifications/look',
			method: 'patch',
			body: {notificationId}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async mentorResponse(payload: MentorResponsePayload): AsyncResult<null, ThemesError> {
		const result = await this._request({
			path: 'ui/theme/mentor_invite_response',
			method: 'post',
			body: payload
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async inviteMember(payload: InviteMemberPayload): AsyncResult<null, ThemesError> {
		const result = await this._request({
			path: 'admin/invite',
			method: 'post',
			body: payload
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async createRule(payload: CreateRulePayload): AsyncResult<Rule, ThemesError> {
		const result = await this._request<CreateRuleResult>({
			path: 'admin/create_rule',
			method: 'post',
			body: payload
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data.data
		}
	}

	async getRules(organizationId: number): AsyncResult<Rule[], ThemesError> {
		const result = await this._request<Rule[]>({
			path: 'admin/rules',
			method: 'get',
			query: {organizationId: String(organizationId)}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data
		}
	}

	async getOrderData(ruleId: number): AsyncResult<OrderData, ThemesError> {
		const result = await this._request<OrderData>({
			path: 'admin/order_data',
			method: 'get',
			query: {ruleId: ruleId.toString()}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: result.value.data
		}
	}
}

export const themesProvider = new ThemesProvider();