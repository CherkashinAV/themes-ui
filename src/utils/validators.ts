import {LoginForm, RegisterForm, Result} from '../types';

export function validateRegisterFormValue(formData: RegisterForm): Result<null, string> {
	if (formData.password.length < 6) {
		return {
			ok: false,
			error: 'Минимальная длина пароля - 6 символов'
		}
	}
	if (formData.password !== formData.repeatPassword) {
		return {
			ok: false,
			error: 'Пароли не совпадают'
		}
	}

	return {
		ok: true,
		value: null
	}
}

export function validateLoginFormValue(formData: LoginForm): Result<null, string> {
	if (formData.password.length < 6) {
		return {
			ok: false,
			error: 'Минимальная длина пароля - 6 символов'
		}
	}

	return {
		ok: true,
		value: null
	}
}