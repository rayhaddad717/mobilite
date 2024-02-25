import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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
import StudentsPage from "./components/students/page.tsx";
import AddEditStudent from "./components/students/AddEditStudents.tsx";
import LoginPage from "./components/login/LoginPage.tsx";

const ProtectedRoute = ({ children }: any) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      //UNIVERSITY
      {
        path: "/university",
        element: (
          <ProtectedRoute>
            <UniversityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/university/add",
        element: (
          <ProtectedRoute>
            <AddEditUniversity />
          </ProtectedRoute>
        ),
      },
      {
        path: "/university/:id",
        element: (
          <ProtectedRoute>
            <AddEditUniversity />
          </ProtectedRoute>
        ),
      },
      //END UNIVERSITY
      //SCHOLARSHIP
      {
        path: "/scholarship",
        element: (
          <ProtectedRoute>
            <ScholarshipPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/scholarship/add",
        element: (
          <ProtectedRoute>
            <AddEditScholarship />
          </ProtectedRoute>
        ),
      },
      {
        path: "/scholarship/:id",
        element: (
          <ProtectedRoute>
            <AddEditScholarship />
          </ProtectedRoute>
        ),
      },
      //END SCHOLARSHIP
      //MASTERS
      {
        path: "/masters",
        element: (
          <ProtectedRoute>
            <MastersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/masters/add",
        element: (
          <ProtectedRoute>
            <AddEditMasters />
          </ProtectedRoute>
        ),
      },
      {
        path: "/masters/:id",
        element: (
          <ProtectedRoute>
            <AddEditMasters />
          </ProtectedRoute>
        ),
      },
      //END MASTERS
      // STUDENTS
      {
        path: "/students",
        element: (
          <ProtectedRoute>
            <StudentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/students/add",
        element: (
          <ProtectedRoute>
            <AddEditStudent />
          </ProtectedRoute>
        ),
      },
      {
        path: "/students/:id",
        element: (
          <ProtectedRoute>
            <AddEditStudent />
          </ProtectedRoute>
        ),
      },
      //END STUDENTS
      //STUDENTINSCRIPTION
      {
        path: "/student_inscription",
        element: (
          <ProtectedRoute>
            <StudentsInscriptionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student_inscription/add",
        element: (
          <ProtectedRoute>
            <AddEditStudentsInscription />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student_inscription/:id",
        element: (
          <ProtectedRoute>
            <AddEditStudentsInscription />
          </ProtectedRoute>
        ),
      },
      //END STUDENTINSCRIPTION
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <LoginPage />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
