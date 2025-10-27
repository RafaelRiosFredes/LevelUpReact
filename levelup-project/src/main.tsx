import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { NavBar } from './components/NavBar.tsx'
import { Noticia } from './pages/Noticia.tsx'
import { Footer } from './components/Footer.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavBar />
    <Noticia />
    <Footer/>
  
  </StrictMode>,
)
