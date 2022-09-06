import {useNavigate} from 'react-router-dom';
import {useAuthContext} from '../../hooks/use-auth-context';
import {signOut} from '../../libs/cognito';
import styles from './header.module.css';

export const Header = () => {
	const navigate = useNavigate();
	const {setAuthenticated, isAuthenticated} = useAuthContext();

	const onClickSignIn = () => {
		navigate('/signin');
	};

	const onClickSignOut = async () => {
		const res = await signOut();

		if (res === 'success') {
			setAuthenticated?.(false);
			navigate('/');
		}
	};

	return (
		<div className={styles.Header}>
			{isAuthenticated ? (
				<button onClick={onClickSignOut}> Sign Out </button>
			) : (
				<button onClick={onClickSignIn}> Sign In </button>
			)}
		</div>
	);
};
