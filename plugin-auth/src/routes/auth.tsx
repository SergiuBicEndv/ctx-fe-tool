import {AcmeCard} from '@adi-ctx/acme-core-components-react';
import {lazy, Suspense} from 'react';
import {useAuthContext} from '../hooks/use-auth-context';

const Register = lazy(
	async () => import('../components/auth/register/register'),
);

const SignIn = lazy(
	async () => import('../components/auth/sign-in/sign-in'),
);

const withSuspense = (children: React.ReactElement) => (
	<Suspense fallback={'...'}>{children}</Suspense>
);

const Auth = () => {
	const {isSignInScreen} = useAuthContext();

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<AcmeCard
				height='100%'
				width='100%'
				style={{
					padding: 32,
					textAlign: 'center',
				}}
			>
				{isSignInScreen ? withSuspense(<SignIn />) : withSuspense(<Register />)}
			</AcmeCard>
		</div>
	);
};

export default Auth;
