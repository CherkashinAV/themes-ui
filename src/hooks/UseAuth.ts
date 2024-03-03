import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {parseJwt} from '../utils';
import {JwtPayload} from '../types';
import {authProvider} from '../providers/auth';
import {getFingerPrint} from '../utils/authUtils';
import {getUserInfo, logout} from '../store/slices/User';
import {useNavigate} from 'react-router-dom';
import {unwrapResult} from '@reduxjs/toolkit';

export const useAuth = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const state = useAppSelector((state) => state.user);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	
	useEffect(() => {
		const verifyTokens = async () => {
			const accessToken = localStorage.getItem('accessToken') ?? '';

			let jwtInfo = parseJwt<JwtPayload>(accessToken);

			if(!jwtInfo || jwtInfo.expiresIn < (Date.now() - 10_000)) {
				const fingerprint = await getFingerPrint() ?? '';
				const refreshResult = await authProvider.refreshTokens(fingerprint);

				console.log(fingerprint)

				if (!refreshResult.ok) {
					await dispatch(logout())
					setIsError(() => true);
					return;
				}
			}

			if (!state.userInfo) {
				try {
					unwrapResult(await dispatch(getUserInfo()));
				} catch(err) {
					await dispatch(logout())
					setIsError(() => true);
					return;
				}
			}

			setIsLoading(() => false);
		}

		verifyTokens();
	});

	useEffect(() => {
		if (isError) {
			navigate('/auth/login')
		}
	}, [isError])

	return isLoading;
}