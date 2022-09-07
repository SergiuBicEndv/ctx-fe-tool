import {lazy, MouseEventHandler, Suspense, useState} from 'react';

import {signUpCognitoUser} from '../../../libs/cognito';
import styles from './register.module.css';
import {Form, Formik} from 'formik';

import {useChangeHandler} from '../../../hooks/use-change-handler';
import {useAuthContext} from '../../../hooks/use-auth-context';
import {string, ref, object} from 'yup';
import baseValidationSchema from '../../../common/constants/base-validation-schema';
import {
	AcmeLoader,
	AcmeMessage,
	AcmeTypography,
} from '@adi-ctx/acme-core-components-react';
import {CtxInput} from '../../ctx-input';
import {CtxButton} from '../../ctx-button';
import {MessageStatus} from '../../../common/interfaces/common';

export type SignUpInput = {
	givenName: string;
	familyName: string;
	email: string;
	password: string;
};
type register = {
	confirmPassword: string;
} & SignUpInput;

const Verify = lazy(async () => import('../verify-code/verify-code'));

const Register = () => {
	const [formAlert, setFormAlert] = useState('');
	const [formAlertStatus, setFormAlertStatus] = useState<
		MessageStatus | undefined
	>(undefined);

	const [loading, setLoading] = useState(false);
	const [givenName, setGivenName] = useState('');
	const [familyName, setFamilyName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [displayVerify, setDisplayVerify] = useState(false);
	const {userEmail, setIsSignInScreen, setUserEmail} = useAuthContext();

	const initialValues: register = {
		givenName: '',
		familyName: '',
		email: '',
		password: '',
		confirmPassword: '',
	};

	const validationSchema = object({
		...baseValidationSchema,
		givenName: string().required('Required'),
		familyName: string().required('Required'),
		confirmPassword: string()
			.required('Required')
			.oneOf(
				[ref('password'), null],
				'Password and Confirm Password must match',
			),
	});

	const onSubmit = () => {
		setLoading(true);
		signUpCognitoUser({
			givenName,
			familyName,
			email: userEmail,
			password,
		})
			.then(() => {
				setFormAlert(
					'User successfuly created! Verify yor email address for confirmation!',
				);
				setFormAlertStatus('success');
			})
			.catch(error => {
				setFormAlert(
					`User creation error: ${error.message}. Please try again!`,
				);
				setFormAlertStatus('error');
			})
			.finally(() => {
				setLoading(false);
				setDisplayVerify(true);
			});
	};

	const handleSubmit: MouseEventHandler<HTMLAcmeButtonElement> = e => {
		e.preventDefault;
		onSubmit();
	};

	if (loading)
		<div
			style={{
				display: 'grid',
				placeItems: 'center stretch',
				width: '30rem',
				height: 'calc(100vh - 9.25rem)',
			}}
		>
			<AcmeLoader text='Loading' />
		</div>;

	if (displayVerify)
		return (
			<Suspense fallback='...'>
				<Verify />
			</Suspense>
		);

	return (
		<div>
			<div style={{margin: '2rem'}}>
				<AcmeTypography variant='h5'>Sign up with a new account</AcmeTypography>
			</div>
			<Formik
				initialValues={initialValues}
				onSubmit={() => {}}
				validationSchema={validationSchema}
			>
				{({errors, isValid}) => (
					<Form>
						<div className={styles.container}>
							<CtxInput
								fieldtype='string'
								label='Given Name'
								value={givenName}
								error={errors.givenName}
								onChange={useChangeHandler(givenName, setGivenName)}
							/>
							<CtxInput
								fieldtype='string'
								label='Family Name'
								value={familyName}
								error={errors.familyName}
								onChange={useChangeHandler(familyName, setFamilyName)}
							/>

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
								error={errors.password}
								onChange={useChangeHandler(password, setPassword)}
							/>

							<CtxInput
								fieldtype='password'
								label='Confirm Password'
								value={confirmPassword}
								error={errors.confirmPassword}
								onChange={useChangeHandler(confirmPassword, setConfirmPassword)}
							/>

							<div style={{margin: '1px'}}>
								<CtxButton
									isFullWidth
									isDisabled={!isValid || loading}
									handleClick={handleSubmit}
								>
									Sign Up
								</CtxButton>
							</div>
						</div>
					</Form>
				)}
			</Formik>
			<div style={{marginTop: '2rem'}}>
				<div>
					{formAlert !== '' && (
						<AcmeMessage status={formAlertStatus}>{formAlert}</AcmeMessage>
					)}
					<AcmeTypography variant='body1'>
						Already have an account?
						<a className={styles.hover} onClick={() => setIsSignInScreen(true)}>
							{' '}
							Sign in
						</a>
					</AcmeTypography>
				</div>
			</div>
		</div>
	);
};

export default Register;
