import {Link} from 'react-router-dom';
import viteLogo from '/assets/vite.svg';
import reactLogo from '/assets/react.svg';
import reactRouterLogo from '/assets/reactRouter.svg';

const Layout = () => {
	return (
		<div>
			<nav
				style={{
					borderBottom: 'solid 1px',
					paddingBottom: '1rem',
				}}
			>
				<Link to='/page1'>Page1</Link> | <Link to='/page2'>Page2</Link>
			</nav>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://reactjs.org' target='_blank'>
					<img src={reactLogo} className='logo' alt='React logo' />
				</a>
				<a
					href='https://reactrouter.com/docs/en/v6/getting-started/overview'
					target='_blank'
				>
					<img src={reactRouterLogo} className='logo' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React + React Router</h1>
			<div className='card'>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React and Router logos to learn more
			</p>
		</div>
	);
};

export default Layout;
