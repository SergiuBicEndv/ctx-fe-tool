import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import SignIn from './routes/auth/signIn';
import SignUp from './routes/auth/signUp';
import VerifyCode from './routes/auth/verify';
import RequestCode from './routes/auth/requestCode';
import ForgotPassword from './routes/auth/forgotPassword';
import ChangePassword from './routes/auth/changePassword';
import Landing from './routes/landing';

import './App.css';
import AuthProvider, {
	AuthIsNotSignedIn,
	AuthIsSignedIn,
} from './context/authContext';
import Home from './routes/home';

const SignInRoute: React.FunctionComponent = () => (
	<Router>
		<Switch>
			<Route path='/signin' component={SignIn} />
			<Route path='/signup' component={SignUp} />
			<Route path='/verify' component={VerifyCode} />
			<Route path='/requestcode' component={RequestCode} />
			<Route path='/forgotpassword' component={ForgotPassword} />
			<Route path='/' component={Landing} />
		</Switch>
	</Router>
);

const MainRoute: React.FunctionComponent = () => (
	<Router>
		<Switch>
			<Route path='/changepassword' component={ChangePassword} />
			<Route path='/' component={Home} />
		</Switch>
	</Router>
);

const App: React.FunctionComponent = () => (
	<AuthProvider>
		<AuthIsSignedIn>
			<MainRoute />
		</AuthIsSignedIn>
		<AuthIsNotSignedIn>
			<SignInRoute />
		</AuthIsNotSignedIn>
	</AuthProvider>
);

export default App;
