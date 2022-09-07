import {string} from 'yup';

const baseValidationSchema = {
	email: string().email('Please enter valid email').required('Required'),
	password: string()
		.required('Required')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			'Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
		),
};

export default baseValidationSchema;
