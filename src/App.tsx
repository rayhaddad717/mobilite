import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="flex max-h-[100vh] overflow-y-auto">
      <Sidebar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
