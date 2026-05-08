import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import 'animate.css';
import './momentConfig.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />
)
