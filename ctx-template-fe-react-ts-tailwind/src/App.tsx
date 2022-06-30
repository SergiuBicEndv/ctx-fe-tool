import { useState } from 'react'
import viteLogo from '/vite.svg'
import reactLogo from './assets/react.svg'
import './App.css'
import { Header } from './components/header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-start items-center m-5 space-y-5">
        <div className="flex justify-center items-center min-w-400 ">
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo" alt="React logo" />
          </a>
          <a href="https://tailwindcss.com/" target="_blank">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/900px-Tailwind_CSS_Logo.svg.png?20211001194333"
              className="logo w-10"
              alt="TailwindCSS logo"
            />
          </a>
        </div>

        <h1 className="text-xl font-bold text-blue-200">
          Vite + React + Typescript + Tailwind CSS 3
        </h1>

        <div className="card flex-col items-center justify-center">
          <button
            className="btn-primary ml-2"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
        </div>
        <p className="read-the-docs">
          Click on the Vite, React and TailwindCSS logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
