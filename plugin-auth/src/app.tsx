import Auth from './routes/auth';
import {Navigate, Route, Routes} from 'react-router-dom';

import './app.css';
import {useAuthContext} from './hooks/use-auth-context';
import {Header} from './components/header/Header';

function App() {
	const {isAuthenticated} = useAuthContext();

	return (
		<>
			<Header />
			<Routes>
				{!isAuthenticated && <Route path='/auth' element={<Auth />} />}
				{isAuthenticated && <Route path='/' />}
				<Route
					path='*'
					element={
						<Navigate to={`${isAuthenticated ? '/' : '/auth'}`} replace />
					}
				/>
			</Routes>
		</>
	);
}

export default App;
