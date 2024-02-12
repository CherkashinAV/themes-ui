import {useEffect, useState} from 'react';
import {useAppDispatch} from '../store/hooks';
import {parseJwt} from '../utils';
import {JwtPayload} from '../types';
import {authProvider} from '../providers/auth';
import {getFingerPrint} from '../utils/authUtils';
import {logout} from '../store/slices/user';
import {useNavigate} from 'react-router-dom';

export const useRefreshToken = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isFresh, setIsFresh] = useState(false);
	
	useEffect(() => {
		const verifyTokens = async () => {
			const accessToken = localStorage.getItem('accessToken') ?? '';
			const fingerprint = await getFingerPrint() ?? '';

			let jwtInfo = parseJwt<JwtPayload>(accessToken);

			if(!jwtInfo || jwtInfo.expiresIn > Date.now() - 10_000) {
				const refreshResult = await authProvider.refreshTokens(fingerprint);

				if (!refreshResult.ok) {
					if (refreshResult.error.status === 'TOKEN_EXPIRED') {
						dispatch(logout());
						navigate('/auth/login');
					}
					return;
				}
			}
			setIsFresh(true);
		}

		verifyTokens();
	}, []);

	return isFresh;
}