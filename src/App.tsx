import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="flex ">
      <Sidebar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
