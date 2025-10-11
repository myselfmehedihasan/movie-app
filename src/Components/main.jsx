import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ✅ Correct imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MovieDetails from "./Components/MovieDetails.jsx";
import Login5 from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import Layout from "./Components/Layout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Trending from "./Pages/Trending.jsx";
import MyReviews from "./Pages/MyReviews.jsx";
import Favorites from "./Pages/Favorites.jsx";
import PrivateRoute from "./Private/PrivateRoute.jsx";
import ScrollToTop from "./ScrolltoTop.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "movie/:id",
        element: <MovieDetails />,
      },
      {
        path: "login",
        element: <Login5 />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "/trending",
        element: <Trending />,
      },
      {
        path: "/my-reviews",
        element: (
          <PrivateRoute>
            <MyReviews />
          </PrivateRoute>
        ),
      },
      {
        path: "/favorites",
        element: (
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);