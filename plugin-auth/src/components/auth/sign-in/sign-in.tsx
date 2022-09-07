import {lazy, MouseEventHandler, Suspense, useState} from 'react';
import {signInWithEmail} from '../../../libs/cognito';
import styles from './sign-in.module.css';
import {useNavigate} from 'react-router-dom';
import {CognitoUserSession} from 'amazon-cognito-identity-js';
import {Form, Formik} from 'formik';
import {useChangeHandler} from '../../../hooks/use-change-handler';
import {useAuthContext} from '../../../hooks/use-auth-context';
import baseValidationSchema from '../../../common/constants/base-validation-schema';
import {object} from 'yup';
import {AcmeMessage, AcmeTypography} from '@adi-ctx/acme-core-components-react';
import {CtxInput} from '../../ctx-input';
import {CtxButton} from '../../ctx-button';

type SignInInputs = {
	email: string;
	password: string;
};

const ForgotPassword = lazy(
	async () => import('../forgot-password/forgot-password'),
);

const SignIn = () => {
	const {
		isAuthInProgress,
		userEmail,
		setAuthenticated,
		setAuthInProgress,
		setJwt,
		setIsSignInScreen,
		setUserEmail,
	} = useAuthContext();
	const navigate = useNavigate();

	const [formAlert, setFormAlert] = useState('');

	const [password, setPassword] = useState('');
	const [isDisplayForgotPassword, setDisplayForgotPassword] = useState(false);
	const validationSchema = object({...baseValidationSchema});

	const initialValues: SignInInputs = {
		email: '',
		password: '',
	};

	const handlePasswordChange = useChangeHandler(password, setPassword);
	const handleDisplayChange = useChangeHandler(
		isDisplayForgotPassword,
		setDisplayForgotPassword,
	);

	const onSubmit = async () => {
		setAuthInProgress(true);
		try {
			const res = (await signInWithEmail(
				userEmail,
				password,
			)) as CognitoUserSession;
			const jwtToken = res.getIdToken().getJwtToken();
			setAuthenticated(true);
			setJwt(jwtToken);
			navigate('/app');
		} catch {
			setFormAlert(`Login error: Please try again!`);
		} finally {
			setAuthInProgress(false);
		}
	};

	const handleSubmit: MouseEventHandler<HTMLAcmeButtonElement> = e => {
		e.preventDefault;
		onSubmit();
	};

	if (isDisplayForgotPassword)
		return (
			<Suspense fallback='...'>
				<ForgotPassword setDisplayForgot={handleDisplayChange} />
			</Suspense>
		);

	return (
		<>
			<div style={{marginTop: '2rem'}}>
				<AcmeTypography variant='h4'>Sign In</AcmeTypography>
			</div>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={() => {}}
			>
				{({errors, isValid, dirty}) => (
					<Form>
						<div className={styles.container}>
							<CtxInput
								fieldtype='email'
								label='Email'
								value={userEmail}
								error={errors.email}
								onChange={setUserEmail}
							/>
							<CtxInput
								fieldtype='password'
								label='Password'
								value={password}
								onChange={handlePasswordChange}
								error={errors.password}
							/>
							<div style={{marginTop: '1rem'}}>
								<CtxButton
									isFullWidth
									isDisabled={!isValid || isAuthInProgress}
									handleClick={handleSubmit}
								>
									{isAuthInProgress ? 'Loading' : 'Sign in'}
								</CtxButton>
							</div>
						</div>
					</Form>
				)}
			</Formik>
			<div style={{marginTop: '2rem'}}>
				<div>
					{formAlert !== '' && <AcmeMessage>{formAlert}</AcmeMessage>}
					<AcmeTypography variant='body1'>
						Don't have an account?
						<a
							className={styles.hover}
							onClick={() => setIsSignInScreen(false)}
						>
							Sign Up
						</a>
					</AcmeTypography>
				</div>
				<div>
					<AcmeTypography variant='body1'>
						<a
							className={styles.hover}
							onClick={() => handleDisplayChange(true)}
						>
							Forgot your password?
						</a>
					</AcmeTypography>
				</div>
			</div>
		</>
	);
};

export default SignIn;
