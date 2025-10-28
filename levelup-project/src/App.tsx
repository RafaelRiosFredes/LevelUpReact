import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import HomePage from './pages/HomePage';
import { Navbar } from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import { Footer } from './components/Footer';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles.css";

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App
