import "./App.css";
import Sidebar from "./components/Sidebar";
import DemoPage from "./components/payments/page";

function App() {
  return (
    <div className="flex ">
      <Sidebar />
      <DemoPage />
    </div>
  );
}

export default App;
