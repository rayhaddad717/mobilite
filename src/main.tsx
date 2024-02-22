import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import UniversityPage from "./components/universities/page.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import AddEditUniversity from "./components/universities/AddEditUniversity.tsx";
import DepartmentPage from "./components/departments/page.tsx";
import AddEditDepartment from "./components/departments/AddEditDepartment.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      //UNIVERSITY
      {
        path: "/university",
        element: <UniversityPage />,
      },
      {
        path: "/university/add",
        element: <AddEditUniversity />,
      },
      {
        path: "/university/:id",
        element: <AddEditUniversity />,
      },
      //END UNIVERSITY
      //UNIVERSITY
      {
        path: "/department",
        element: <DepartmentPage />,
      },
      {
        path: "/department/add",
        element: <AddEditDepartment />,
      },
      {
        path: "/department/:id",
        element: <AddEditDepartment />,
      },
      //END UNIVERSITY
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
