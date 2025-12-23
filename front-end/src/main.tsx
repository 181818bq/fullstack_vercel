import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMoxlZN8CrWCgTv-ePZuO9VJqeB_RL9is",
  authDomain: "full-stack-react-4975f.firebaseapp.com",
  projectId: "full-stack-react-4975f",
  storageBucket: "full-stack-react-4975f.firebasestorage.app",
  messagingSenderId: "517819392657",
  appId: "1:517819392657:web:1bb1edbe1c663bab73d530"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
