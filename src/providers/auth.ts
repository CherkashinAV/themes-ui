import {AsyncResult} from '../types';
import axios, {AxiosError, AxiosResponse, Method} from 'axios';

export type RegisterPayload = {
	email: string;
	password: string;
} & (
	{
		name: string;
		surname: string;
	} |
	{
		invitationCode: string;
	}
);

export type LoginPayload = {
	email: string;
	password: string;
	fingerprint: string;
}

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
}

export type SendPasswordRestoreLinkPayload = {
	email: string;
	linkToResetForm: string;
}

export type ResetPasswordPayload = {
	userId: string;
	password: string;
	secretCode: string;
}

export type LogoutPayload = {
	accessToken: string;
	fingerprint: string;
}

export type refreshTokensResponse = {
	accessToken: string;
	refreshToken: string;
}

export type UserInfoPayload = {
	accessToken: string;
	userId: string;
}

export type User = {
	name: string;
	surname: string;
	email: string;
	role: string;
	uid: string;
}

type AuthErrorStatus = 
	| 'BAD_REQUEST'
	| 'NO_INVITATION_FOR_USER'
	| 'ALREADY_EXISTS'
	| 'INVALID_SECRET'
	| 'NOT_FOUND'
	| 'INVALID_PASSWORD'
	| 'NEED_PASSWORD_RESET'
	| 'INVALID_TOKEN'
	| 'TOKEN_EXPIRED'
	| 'NOT_ENOUGH_RIGHTS';

const errorMessages: Record<AuthErrorStatus, string> = {
	'BAD_REQUEST': 'Что-то пошло не так',
	'NO_INVITATION_FOR_USER': 'Не существует такого приглашения',
	'ALREADY_EXISTS': 'Проверьте данные',
	'INVALID_SECRET': 'Неверный код',
	'NOT_FOUND': 'Что-то пошло не так',
	'INVALID_PASSWORD': 'Неверный пароль',
	'NEED_PASSWORD_RESET': 'Мы заподозрили нежелательную активность. Пожалуйста, смените пароль',
	'INVALID_TOKEN': 'Неверный токен авторизации',
	'TOKEN_EXPIRED': 'Токен недействителен',
	'NOT_ENOUGH_RIGHTS': 'Недостаточно прав'
};
	
class AuthError extends Error {
	status: AuthErrorStatus;

	constructor(status: AuthErrorStatus, message: string) {
		super(message);
		this.status = status;
	}
}

class AuthProvider {
	private _baseUrl: string;
	private _partition: string;

	constructor() {
		this._baseUrl = 'http://localhost:8080/v1/passport/';
		this._partition = 'themes';
	}

	private async _request<T>(args: {
		path: string;
		method: Method;
		accessToken?: string;
		body?: Record<string, unknown>
		query?: Record<string, string>
	}): AsyncResult<AxiosResponse<T>, AuthError> {
		const requestUrl = new URL(args.path, this._baseUrl);
		// let response: AxiosResponse<T>;
		try {
			const response = await axios.request<T>({
				method: args.method,
				url: requestUrl.toString(),
				headers: {
					'Authorization': `Bearer ${args.accessToken}`,
				},
				data: args.body,
				params: args.query,
				responseType: 'json'
			});

			return {
				ok: true,
				value: response
			}
		} catch (error) {
			const code = (error as any).response.data.code as AuthErrorStatus ?? 'BAD_REQUEST';
			return {
				ok: false,
				error: new AuthError(code, errorMessages[code])
			}
		}
	}

	async register(payload: RegisterPayload): AsyncResult<null, AuthError> {
		const result = await this._request({
			path: 'register',
			method: 'POST',
			body: payload,
			query: {
				partition: this._partition
			}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async login(payload: LoginPayload): AsyncResult<LoginResponse, AuthError> {
		const result = await this._request<LoginResponse>({
			path: 'login',
			method: 'POST',
			body: payload,
			query: {
				partition: this._partition
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

	async sendPasswordRestoreLink(payload: SendPasswordRestoreLinkPayload): AsyncResult<null, AuthError> {
		const result = await this._request<LoginResponse>({
			path: 'password_forgot',
			method: 'POST',
			body: payload,
			query: {
				partition: this._partition
			}
		});

		if (!result.ok) {
			return result;
		}

		return {
			ok: true,
			value: null
		}
	}

	async resetPassword(payload: ResetPasswordPayload): AsyncResult<null, AuthError> {
		const result = await this._request<null>({
			path: 'reset_password',
			method: 'POST',
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

	async logout(payload: LogoutPayload): AsyncResult<null, AuthError> {
		const result = await this._request<null>({
			path: 'logout',
			method: 'POST',
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

	async refreshTokens(fingerprint: string): AsyncResult<refreshTokensResponse, AuthError> {
		const result = await this._request<refreshTokensResponse>({
			path: 'refresh_tokens',
			method: 'POST',
			body: {fingerprint}
		});

		if (!result.ok) {
			return result;
		}

		localStorage.setItem('accessToken', result.value.data.accessToken)

		return {
			ok: true,
			value: result.value.data
		}
	}

	async userInfo(payload: UserInfoPayload): AsyncResult<User, AuthError> {
		const result = await this._request<User>({
			path: 'user_info',
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

export const authProvider = new AuthProvider();