import React from 'react';
import reportWebVitals from '../report-web-vitals';
import App from './app';
import './index.css';
import ParallelInitializer from './components/providers/parallel-initializer';
import {createRoot} from 'react-dom/client';
import {providers} from './utils/providers';

const container = document.querySelector('#root')!;
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<ParallelInitializer providers={providers}>
			<App />
		</ParallelInitializer>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
