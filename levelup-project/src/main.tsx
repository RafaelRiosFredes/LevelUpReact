import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Navbar } from './components/NavBar.tsx'
import { Home } from './pages/Home.tsx'
import { Footer } from './components/footer.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar />
    <Home />
    <Footer/>
  
  </StrictMode>,
)
