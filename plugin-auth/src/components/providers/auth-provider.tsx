import React, {useState} from 'react';
import {VoidFunction} from '../../common/interfaces/common';
import {useChangeHandler} from '../../hooks/use-change-handler';

import {InitializerComponent} from './../../components/providers/parallel-initializer';

export interface AuthState {
	jwt: string;
	isAuthenticated: boolean;
	isAuthInProgress: boolean;
	isSignInScreen: boolean;
	userEmail: string;
	setAuthenticated: VoidFunction<boolean>;
	setJwt: VoidFunction<string>;
	setAuthInProgress: VoidFunction<boolean>;
	setIsSignInScreen: VoidFunction<boolean>;
	setUserEmail: VoidFunction<string>;
}

const defaultState: AuthState = {
	jwt: '',
	isAuthenticated: false,
	isAuthInProgress: false,
	isSignInScreen: false,
	userEmail: '',
	setAuthenticated: () => {},
	setJwt: () => {},
	setAuthInProgress: () => {},
	setIsSignInScreen: () => {},
	setUserEmail: () => {},
};

export const AuthContext = React.createContext(defaultState);
AuthContext.displayName = 'Auth';

const AuthProvider: InitializerComponent<{
	state: AuthState;
	children?: React.ReactNode;
}> = {
	component: ({children}) => {
		const [isLoggedIn, setIsLoggedIn] = useState(false);
		const [isAuthInProgress, setIsLoading] = useState(false);
		const [jwt, setToken] = useState('');
		const [isSignInScreen, setIsSignIn] = useState(true);
		const [userEmail, setEmail] = useState('');

		const setAuthenticated = useChangeHandler(isLoggedIn, setIsLoggedIn);
		const setJwt = useChangeHandler(jwt, setToken);
		const setAuthInProgress = useChangeHandler(isAuthInProgress, setIsLoading);
		const setIsSignInScreen = useChangeHandler(isSignInScreen, setIsSignIn);
		const setUserEmail = useChangeHandler(userEmail, setEmail);

		return (
			<AuthContext.Provider
				value={{
					isAuthenticated: isLoggedIn,
					isAuthInProgress,
					jwt,
					isSignInScreen,
					userEmail,
					setAuthenticated,
					setJwt,
					setAuthInProgress,
					setIsSignInScreen,
					setUserEmail,
				}}
			>
				{children}
			</AuthContext.Provider>
		);
	},
};

export default AuthProvider;
