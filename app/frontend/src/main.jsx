import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {
  Home,
  Register,
  Login,
  OTP,
  Profile,
  Lists,
  Submission,
} from "./components/index.js"


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verification", element: <OTP /> },
      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "lists", element: <Lists /> },
      { path: "submission", element: <Submission /> },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
