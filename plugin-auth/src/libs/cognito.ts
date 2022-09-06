import {SignUpInput} from '../components/auth/register/register';
import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUserSession,
} from 'amazon-cognito-identity-js';

const userPoolId = import.meta.env.VITE_USERPOOL_ID;
const clientId = import.meta.env.VITE_CLIENT_ID;

const poolData = {
	UserPoolId: `${userPoolId}`,
	ClientId: `${clientId}`,
};

const userPool: CognitoUserPool = new CognitoUserPool(poolData);

let currentUser = userPool.getCurrentUser();

export function getCurrentUser() {
	return currentUser;
}

function getCognitoUser(username: string) {
	const userData = {
		Username: username,
		Pool: userPool,
	};
	const cognitoUser = new CognitoUser(userData);

	return cognitoUser;
}

export async function getSession() {
	if (!currentUser) {
		currentUser = userPool.getCurrentUser();
	}

	return new Promise<CognitoUserSession>(function (resolve, reject) {
		currentUser?.getSession(function (error: any, session: CognitoUserSession) {
			if (error) {
				reject(error);
			} else {
				resolve(session);
			}
		});
	}).catch(error => {
		throw error;
	});
}

const setCognitoUserAttribute = (name: string, value: string) =>
	new CognitoUserAttribute({
		Name: name,
		Value: value,
	});
export async function signUpCognitoUser(values: SignUpInput) {
	return new Promise(function (resolve, reject) {
		const {password, email, givenName, familyName} = values;
		const attributeList = [];
		attributeList.push(setCognitoUserAttribute('email', email));
		attributeList.push(setCognitoUserAttribute('given_name', givenName));
		attributeList.push(setCognitoUserAttribute('family_name', familyName));

		userPool.signUp(
			email,
			password,
			attributeList,
			[],
			function (error, result) {
				if (error) {
					reject(error);
				} else {
					resolve(result!);
				}
			},
		);
	}).catch(error => {
		throw error;
	});
}

export async function signUpUserWithEmail(email: string, password: string) {
	return new Promise(function (resolve, reject) {
		const attributeList = [
			new CognitoUserAttribute({
				Name: 'email',
				Value: email,
			}),
		];

		userPool.signUp(email, password, attributeList, [], function (error, res) {
			if (error) {
				reject(error);
			} else {
				resolve(res);
			}
		});
	}).catch(error => {
		throw error;
	});
}

export async function verifyCode(email: string, code: string) {
	return new Promise(function (resolve, reject) {
		const cognitoUser = getCognitoUser(email);

		cognitoUser.confirmRegistration(code, true, function (error, result) {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	}).catch(error => {
		throw error;
	});
}

export async function signInWithEmail(username: string, password: string) {
	return new Promise(function (resolve, reject) {
		const authenticationData = {
			Username: username,
			Password: password,
		};
		const authenticationDetails = new AuthenticationDetails(authenticationData);

		currentUser = getCognitoUser(username);

		currentUser?.authenticateUser(authenticationDetails, {
			onSuccess(res: CognitoUserSession) {
				resolve(res);
			},
			onFailure(error: any) {
				reject(error);
			},
		});
	}).catch(error => {
		throw error;
	});
}

export async function signOut() {
	return new Promise(function (resolve, reject) {
		currentUser?.signOut(() => resolve('success'));
	}).catch(error => {
		throw error;
	});
}

export async function getAttributes() {
	return new Promise(function (resolve, reject) {
		currentUser?.getUserAttributes(function (error: any, attributes: any) {
			if (error) {
				reject(error);
			} else {
				resolve(attributes);
			}
		});
	}).catch(error => {
		throw error;
	});
}

export async function setAttribute(attribute: any) {
	return new Promise(function (resolve, reject) {
		const attributeList = [];
		const res = new CognitoUserAttribute(attribute);
		attributeList.push(res);

		currentUser?.updateAttributes(attributeList, (error: any, res: any) => {
			if (error) {
				reject(error);
			} else {
				resolve(res);
			}
		});
	}).catch(error => {
		throw error;
	});
}

export async function sendCode(email: string) {
	return new Promise(function (resolve, reject) {
		const cognitoUser = getCognitoUser(email);

		if (!cognitoUser) {
			reject(`could not find ${email}`);
			return;
		}

		cognitoUser.forgotPassword({
			onSuccess(res) {
				resolve(res);
			},
			onFailure(error) {
				reject(error);
			},
		});
	}).catch(error => {
		throw error;
	});
}

export async function forgotPassword(
	email: string,
	code: string,
	password: string,
) {
	return new Promise(function (resolve, reject) {
		const cognitoUser = getCognitoUser(email);

		if (!cognitoUser) {
			reject(`could not find ${email}`);
			return;
		}

		cognitoUser.confirmPassword(code, password, {
			onSuccess() {
				resolve('password updated');
			},
			onFailure(error) {
				reject(error);
			},
		});
	});
}

export async function changePassword(oldPassword: string, newPassword: string) {
	return new Promise(function (resolve, reject) {
		currentUser?.changePassword(
			oldPassword,
			newPassword,
			function (error: any, res: any) {
				if (error) {
					reject(error);
				} else {
					resolve(res);
				}
			},
		);
	});
}
