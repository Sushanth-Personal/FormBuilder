
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './main.css'
import { UserProvider } from "./Contexts/UserContext";

createRoot(document.getElementById('root')).render(

  <UserProvider>
    <App />
  </UserProvider>

)

