import {AsyncResult, Theme, ThemeType, User, UserDetails, UserWithDetails} from '../types';
import axios, {AxiosResponse, Method} from 'axios';
import {getFingerPrint} from '../utils/authUtils';

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
}

export type CreateThemePayload = {
	title: string,
	shortDescription: string,
	description: string,
	executorsCount: number,
	type: ThemeType,
	private: boolean
}

export type CreateThemeResponse = {
	status: 'OK',
	themeId: number
}

export type JoinRequestResponse = {
	status: 'OK',
	value: UserWithDetails
}

class ThemesProvider {
	private _baseUrl: string;

	constructor() {
		this._baseUrl = 'http://localhost:8080/v1/themes/';
	}

	private async _request<T>(args: {
		path: string;
		method: Method;
		body?: Record<string, unknown>
		query?: Record<string, string>
	}): AsyncResult<AxiosResponse<T>, ThemesError> {
		const requestUrl = new URL(args.path, this._baseUrl);
		// let response: AxiosResponse<T>;
		const accessToken = localStorage.getItem('accessToken');
		const fingerprint = await getFingerPrint() ?? '';

		try {
			const response = await axios.request<T>({
				method: args.method,
				url: requestUrl.toString(),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
					'X-Fingerprint': fingerprint
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

	async joinRequest(themeId: number): AsyncResult<UserWithDetails, ThemesError> {
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
}

export const themesProvider = new ThemesProvider();