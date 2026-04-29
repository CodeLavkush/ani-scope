import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from "./store/store.js"
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
  Protected,
  About
} from "./components/index.js"


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verification", element: <OTP /> },
      {
        path: "home", element: (
          <Protected authentication>
            <Home />
          </Protected>
        )
      },
      { path: "about", element: <About /> },
      {
        path: "profile", element: (
          <Protected authentication>
            <Profile />
          </Protected>
        )
      },
      {
        path: "lists", element: (
          <Protected authentication>
            <Lists />
          </Protected>
        )
      },
      {
        path: "submission", element: (
          <Protected authentication>
            <Submission />
          </Protected>
        )
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
