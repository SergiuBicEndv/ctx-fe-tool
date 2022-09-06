import './app.css';
import Layout from './components/layout/layout';
import Page1 from './routes/page1/page1';
import Page2 from './routes/page2/page2';
import {Route, Routes} from 'react-router-dom';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Layout />} />
			<Route path='page1' element={<Page1 />} />
			<Route path='page2' element={<Page2 />} />
			<Route
				path='*'
				element={
					<main style={{padding: '1rem'}}>
						<p>The page can't be found</p>
					</main>
				}
			/>
		</Routes>
	);
}

export default App;
