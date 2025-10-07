import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ✅ Correct imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MovieDetails from "./Components/MovieDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
   {
    path: "/movie/:id",
    element: <MovieDetails />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
