import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import UniversityPage from "./components/universities/page.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import AddUniversity from "./components/universities/AddUniversity.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/university",
        element: <UniversityPage />,
      },
      {
        path: "/university/add",
        element: <AddUniversity />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
