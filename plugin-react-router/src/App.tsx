import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Page1 from './components/routes/page1/Page1';
import Page2 from './components/routes/page2/Page2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='page1' element={<Page1 />} />
        <Route path='page2' element={<Page2 />} />
        <Route
          path='*'
          element={
            <main style={{ padding: '1rem' }}>
              <p>The page can't be found</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
