import {signOut} from '../../../libs/cognito';
import {useNavigate} from 'react-router-dom';
import {AcmeLink} from '@adi-ctx/acme-core-components-react';
import {useAuthContext} from '../../../hooks/use-auth-context';

const SignOut = () => {
	const navigate = useNavigate();
	const {setAuthenticated} = useAuthContext();

	const onClickSignOut = () => {
		signOut();
		setAuthenticated(false);
		navigate('/auth');
	};

	return (
		<AcmeLink type='secondary' onClick={onClickSignOut}>
			Sign Out
		</AcmeLink>
	);
};

export default SignOut;
