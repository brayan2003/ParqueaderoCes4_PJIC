/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);

  const checkIfVehicleExists = (plateNumber) => {
    return new Promise((resolve) => {
      const existsInList = vehicles.some(
        (vehicle) => vehicle.plateNumber === plateNumber
      );

      resolve(existsInList);
    });
  };

  const searchVehicles = (query) => {
    return new Promise((resolve) => {
      const matchingVehicles = vehicles.filter(
        (vehicle) =>
          vehicle.documentNumber === query || vehicle.plateNumber === query
      );

      if (matchingVehicles.length > 0) {
        resolve(matchingVehicles);
      } else {
        resolve(matchingVehicles);
      }
    });
  };

  const registerVehicle = (vehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, vehicle]);
  };

  const getVehicles = () => {
    // Puedes implementar lógica para obtener la lista de vehículos
    return vehicles;
  };

  return (
    <VehicleContext.Provider
      value={{
        checkIfVehicleExists,
        searchVehicles,
        registerVehicle,
        getVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error(
      "VehicleContext debe ser utilizado dentro de VehicleProvider"
    );
  }
  return context;
};
