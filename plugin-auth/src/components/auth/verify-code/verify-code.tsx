import {sendCode, verifyCode} from '../../../libs/cognito';
import styles from './verify-code.module.css';
import {Form, Formik} from 'formik';
import {MouseEventHandler, useState} from 'react';
import {useChangeHandler} from '../../../hooks/use-change-handler';
import {string, object} from 'yup';
import {useAuthContext} from '../../../hooks/use-auth-context';
import {AcmeMessage, AcmeTypography} from '@adi-ctx/acme-core-components-react';
import {CtxInput} from '../../ctx-input';
import {CtxButton} from '../../ctx-button';
import {MessageStatus} from '../../../common/interfaces/common';

type verifyCode = {
	email: string;
	code: string;
};
const VerifyCode = () => {
	const {userEmail, setIsSignInScreen} = useAuthContext();

	const [formAlert, setFormAlert] = useState('');
	const [formAlertStatus, setFormAlertStatus] = useState<
		MessageStatus | undefined
	>(undefined);

	const [code, setCode] = useState('');

	const initialValues: verifyCode = {
		email: userEmail,
		code: '',
	};

	const validationSchema = object({
		code: string()
			.required('This field is Required')
			.matches(
				/^\d{6}$/,
				'Code format is not valid, please enter your 6 digits code',
			),
	});

	const onSubmit = async () => {
		try {
			const res = await verifyCode(userEmail, code);

			if (res === 'SUCCESS') {
				setIsSignInScreen(true);
			}
		} catch (error: any) {
			if (error.name === 'ExpiredCodeException') {
				await sendCode(userEmail);
				setFormAlert(
					`Your code has expired. We're sending a new one to ${userEmail}`,
				);
				setFormAlertStatus('info');
			}

			setFormAlert(`Invalid Code or Email, please try again!`);
			setFormAlertStatus('error');
		}
	};

	const handleSubmit: MouseEventHandler<HTMLAcmeButtonElement> = e => {
		e.preventDefault;
		onSubmit();
	};

	return (
		<>
			<div style={{marginTop: '2rem'}}>
				<AcmeTypography variant='h4'>Verify Code</AcmeTypography>
			</div>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
			>
				{({errors, isSubmitting, isValid}) => (
					<Form>
						<div className={styles.container}>
							<CtxInput
								fieldtype='email'
								label='Email'
								value={userEmail}
								error={errors.email}
								disabled
							/>
							<CtxInput
								fieldtype='string'
								label='Code'
								value={code}
								error={errors.code}
								onChange={useChangeHandler(code, setCode)}
							/>

							<div style={{marginTop: '1rem'}}>
								<CtxButton
									isFullWidth
									isDisabled={!isValid || isSubmitting}
									handleClick={handleSubmit}
								>
									{isSubmitting ? 'Loading' : 'Verify'}
								</CtxButton>
							</div>
						</div>
					</Form>
				)}
			</Formik>
			{formAlert !== '' && <AcmeMessage status={formAlertStatus}>{formAlert}</AcmeMessage>}
		</>
	);
};

export default VerifyCode;
