import Navbar from "./navbar";
import Vehicles from "./pages/Vehicles";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import bgImage from "./assets/piter.png";
import Dashboard from "./Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDetails from "./pages/DriverDetails";
import DriverProfile from "./pages/DriverProfile";
import DriverManagement from "./pages/DriverManagement";
import ManagerDetails from "./pages/ManagerDetails";
import AddManager from "./pages/AddManager";
import AddDriver from "./pages/AddDriver";


function Layout() {
  const location = useLocation();


  const showNavbar = location.pathname === "/";

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          
          element={
            <h1 style={{ color: "white", textAlign: "center" }}>
              
            </h1>
          }
        />
        <Route path="/DriverDetails" element={<DriverDetails />} />
        <Route path="/DriverManagement" element={<DriverManagement />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/DriverProfile" element={<DriverProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-manager" element={<AddManager />} />
        <Route path="/add-driver" element={<AddDriver />} />
        <Route path="/ManagerDetails" element={<ManagerDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,
      }}
    >
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;