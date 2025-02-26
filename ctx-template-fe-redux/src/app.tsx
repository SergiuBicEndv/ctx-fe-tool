import reactLogo from '/assets/react.svg';
import viteLogo from '/assets/vite.svg';
import './app.css';
import {Counter} from './components/counter/counter';

function App() {
	return (
		<div className='App'>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://reactjs.org' target='_blank'>
					<img src={reactLogo} className='logo' alt='React logo' />
				</a>
			</div>
			<h1>Vite / React / Typescript / Redux Toolkit</h1>
			<div className='card'>
				<Counter />
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
		</div>
	);
}

export default App;
