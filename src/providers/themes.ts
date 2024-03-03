import {AsyncResult, ThemeType, User} from '../types';
import axios, {AxiosResponse, Method} from 'axios';
import {getFingerPrint} from '../utils/authUtils';

export type ThemesErrorStatus = |
	'UNAUTHORIZED' |
	'BAD_REQUEST' |
	'UNKNOWN';

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
}

export const themesProvider = new ThemesProvider();