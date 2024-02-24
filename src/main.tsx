import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import UniversityPage from "./components/universities/page.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import AddEditUniversity from "./components/universities/AddEditUniversity.tsx";
import ScholarshipPage from "./components/scholarship/page.tsx";
import AddEditScholarship from "./components/scholarship/AddEditScholarship.tsx";
import MastersPage from "./components/masters/page.tsx";
import AddEditMasters from "./components/masters/AddEditMasters.tsx";
import StudentsInscriptionPage from "./components/studentinscription/page.tsx";
import AddEditStudentsInscription from "./components/studentinscription/AddEditStudentsInscription.tsx";


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
      //SCHOLARSHIP
      {
        path: "/scholarship",
        element: <ScholarshipPage />,
      },
      {
        path: "/scholarship/add",
        element: <AddEditScholarship />,
      },
      {
        path: "/scholarship/:id",
        element: <AddEditScholarship />,
      },
      //END SCHOLARSHIP
      //MASTERS
      {
        path: "/masters",
        element: <MastersPage />,
      },
      {
        path: "/masters/add",
        element: <AddEditMasters />,
      },
      {
        path: "/masters/:id",
        element: <AddEditMasters />,
      },
      //END MASTERS
      //STUDENTINSCRIPTION
      {
        path: "/studentinscription",
        element: <StudentsInscriptionPage />,
      },
      {
        path: "/student_inscription/add",
        element: <AddEditStudentsInscription/>,
      },
      {
        path: "/studentinscription/:id",
        element: <AddEditStudentsInscription />,
      },
      //END STUDENTINSCRIPTION
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
