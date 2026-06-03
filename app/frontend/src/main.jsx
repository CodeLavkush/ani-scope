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
  Explore,
  Watchlist,
  Anime,
  AdminLogin,
  AdminDashboard,
} from "./pages"
import { Protected } from "./components"


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, element: (
          <Protected authentication>
            <Home />
          </Protected>
        )
      },
      {
        path: "login", element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        )
      },
      {
        path: "register", element: (
          <Protected authentication={false}>
            <Register />
          </Protected>
        )
      },
      {
        path: "verification", element: (
          <Protected authentication={false}>
            <OTP />
          </Protected>
        )
      },
      {
        path: "home", element: (
          <Protected authentication>
            <Home />
          </Protected>
        )
      },
      {
        path: "explore", element: (
          <Protected authentication>
            <Explore />
          </Protected>
        )
      },
      {
        path: "watchlist", element: (
          <Protected authentication>
            <Watchlist />
          </Protected>
        )
      },
      {
        path: "profile", element: (
          <Protected authentication>
            <Profile />
          </Protected>
        )
      },
      {
        path: "anime/:animeId", element: (
          <Protected authentication>
            <Anime />
          </Protected>
        )
      },
      {
        path: "admin-login", element: (
          <Protected authentication={false}>
            <AdminLogin />
          </Protected>
        )
      },
      {
        path: "admin/dashboard", element: (
          <Protected authentication adminOnly>
            <AdminDashboard />
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
