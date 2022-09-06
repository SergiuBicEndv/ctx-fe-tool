import {useAuthContext} from '../../../hooks/use-auth-context';
import {Navigate} from 'react-router-dom';

export function PrivateRoute({children}: {children: React.ReactElement}) {
	const {isAuthenticated} = useAuthContext();

	if (!isAuthenticated) {
		return <Navigate to={'/auth'} />;
	}

	return children;
}
