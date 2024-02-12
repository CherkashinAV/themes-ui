export type RegisterForm = {
	email: string;
	password: string;
	repeatPassword: string;
	code: string;
	name: string;
	surname: string;
	patronymic: string;
}

export type LoginForm = {
	email: string;
	password: string;
}

export type JwtPayload = {
	userId: string;
    expiresIn: number;
    role: string;
    iat: number;
}

type OkResult<T = null> = {
	ok: true,
	value: T
};

type ErrorResult<T = string> = {
	ok: false,
	error: T
};

export type Result<T, E> = OkResult<T> | ErrorResult<E>;
export type AsyncResult<T, E> = Promise<Result<T, E>>;