/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import VehicleEntryForm from "../components/Vehicle/VehicleEntryForm";
import Parking from "../components/Parking/Parking";
import styles from "./DashboardPage.module.css";
import VehicleForm from "../components/Vehicle/VehicleForm";

const DashboardPage = () => {
  const { logout } = useUser();
  const [selectedForm, setSelectedForm] = useState("registerInParking");

  const handleSelectForm = (formName) => {
    setSelectedForm(formName);
  };

  return (
    <div>
      <nav className={styles.navMenu}>
        <button onClick={() => handleSelectForm("registerInParking")}>
          Registrar Vehículo
        </button>
        <button onClick={() => handleSelectForm("registerVehicle")}>
          Parquear Vehiculo
        </button>
        <button onClick={() => handleSelectForm("parking")}>Parqueadero</button>
        <button onClick={logout}>Cerrar Sesión</button>
      </nav>

      {selectedForm === "registerInParking" && <VehicleForm />}
      {selectedForm === "registerVehicle" && <VehicleEntryForm />}
      {selectedForm === "parking" && <Parking />}
    </div>
  );
};

export default DashboardPage;
