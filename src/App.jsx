import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { UserLogin } from "./context/UserContext";
import { VehicleProvider } from "./context/VehicleContext";
import DashboardPage from "./pages/DashboardPage";
import { ParkingProvider } from "./context/ParkingContext";

function App() {
  return (
    <UserLogin>
      <VehicleProvider>
        <ParkingProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />}></Route>
          </Routes>
        </ParkingProvider>
      </VehicleProvider>
    </UserLogin>
  );
}

export default App;
