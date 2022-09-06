import {useContext, useEffect} from 'react';
import {AuthContext} from '../components/providers/auth-provider';
import {getSession} from '../libs/cognito';

export const useAuthContext = () => {
	const {
		isAuthenticated,
		isAuthInProgress,
		isSignInScreen,
		userEmail,
		jwt,
		setIsSignInScreen,
		setAuthenticated,
		setAuthInProgress,
		setUserEmail,
		setJwt,
	} = useContext(AuthContext);

	useEffect(() => {
		const fetchSession = async () => {
			await getSession()
				.then(async session => {
					const jwt = await session.getIdToken().getJwtToken();
					setJwt?.(jwt);
					setAuthenticated?.(true);
				})
				.catch(() => {
					setAuthenticated?.(false);
				})
				.finally(() => {
					setAuthInProgress?.(false);
				});
		};

		fetchSession();
	}, [isAuthenticated]);

	return {
		isAuthenticated,
		isAuthInProgress,
		jwt,
		userEmail,
		isSignInScreen,
		setAuthenticated,
		setAuthInProgress,
		setJwt,
		setIsSignInScreen,
		setUserEmail,
	};
};
