import {forgotPassword, sendCode} from '../../../libs/cognito';
import styles from './forgot-password.module.css';
import {Form, Formik} from 'formik';
import {Box, Typography} from '@mui/material';
import {MouseEventHandler, useState} from 'react';
import {useChangeHandler} from '../../../hooks/use-change-handler';
import {useAuthContext} from '../../../hooks/use-auth-context';
import {string, ref, object} from 'yup';
import {VoidFunction} from '../../../common/interfaces/common';
import {CtxInput} from '../../ctx-input';
import {CtxButton} from '../../ctx-button';
import {AcmeMessage, AcmeTypography} from '@adi-ctx/acme-core-components-react';

type ForgotPasswordInputs = {
	email: string;
	code: string;
	newPassword: string;
	confirmNewPassword?: string;
};

const ForgotPassword = ({
	setDisplayForgot,
}: {
	setDisplayForgot: VoidFunction<boolean>;
}) => {
	const [formAlert, setFormAlert] = useState('');

	const {userEmail, setUserEmail} = useAuthContext();
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [isFirstStep, setIsFirsStep] = useState(true);

	const initialValues: ForgotPasswordInputs = {
		email: '',
		code: '',
		newPassword: '',
		confirmNewPassword: '',
	};

	const validationSchema = object({
		email: string().email('Please enter valid email').required('Required'),
		code: string()
			.required('This field is Required')
			.matches(
				/^\d{6}$/,
				'Code format is not valid, please enter your 6 digits code',
			),
		newPassword: string()
			.required('Required')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
				'Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
			),
		confirmNewPassword: string()
			.required('Required')
			.oneOf(
				[ref('password'), null],
				'Password and Confirm Password must match',
			),
	});

	const onSubmit = async () => {
		if (isFirstStep) {
			sendCode(userEmail)
				.then(() => {
					return setIsFirsStep(false);
				})
				.catch(error => {
					setFormAlert('Invalid Email, please try again!');
				});
		} else {
			try {
				const res = await forgotPassword(userEmail, code, newPassword);

				if (res === 'password updated') {
					setDisplayForgot(false);
				}
			} catch (error: any) {
				if (error.name === 'ExpiredCodeException') {
					await sendCode(userEmail);
					setFormAlert(
						`Your code has expired. We're sending a new one to ${userEmail}`,
					);
				}

				setFormAlert('Invalid Code, please try again!');
			}
		}
	};

	const handleSubmit: MouseEventHandler<HTMLAcmeButtonElement> = e => {
		e.preventDefault;
		onSubmit();
	};

	return (
		<>
			<Box m={2}>
				<AcmeTypography variant='h4'>Change Password</AcmeTypography>
			</Box>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({errors, isSubmitting, isValid}) => (
					<Form>
						<div className={styles.container}>
							<Box m={1}>
								<CtxInput
									fieldtype='email'
									label='Email'
									value={userEmail}
									error={errors.email}
									onChange={setUserEmail}
									disabled={!isFirstStep}
								/>
								<div
									style={{
										display: isFirstStep ? 'none' : 'block',
									}}
								>
									<CtxInput
										fieldtype='string'
										label='Code'
										value={code}
										error={errors.code}
										onChange={useChangeHandler(code, setCode)}
									/>
									<CtxInput
										fieldtype='password'
										label='New Password'
										value={newPassword}
										error={errors.newPassword}
										onChange={useChangeHandler(newPassword, setNewPassword)}
									/>
									<CtxInput
										fieldtype='password'
										label='Confirm Password'
										value={confirmNewPassword}
										error={errors.confirmNewPassword}
										onChange={useChangeHandler(
											confirmNewPassword,
											setConfirmNewPassword,
										)}
									/>
								</div>
								<CtxButton
									isFullWidth
									isDisabled={!isValid || isSubmitting}
									handleClick={handleSubmit}
								>
									{isSubmitting ? 'Loading' : 'Change Password'}
								</CtxButton>
							</Box>
						</div>
					</Form>
				)}
			</Formik>
			{formAlert !== '' && (
				<AcmeMessage status='error'>{formAlert}</AcmeMessage>
			)}
		</>
	);
};

export default ForgotPassword;
