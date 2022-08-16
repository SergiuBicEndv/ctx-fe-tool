import { Header } from '../components/header/Header'

import viteLogo from '/assets/vite.svg'
import reactLogo from '/assets/react.svg'

function Landing() {
  return (
    <>
    <Header/>
		<div className="App">
			<h1>Vite + React + AWS Cognito Auth</h1>
			<div className="card">
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</div>
    </>
  )
}

export default Landing
