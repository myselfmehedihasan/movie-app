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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);