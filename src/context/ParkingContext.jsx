/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useCallback } from "react";

const ParkingContext = createContext();

export const ParkingProvider = ({ children }) => {
  const [parkingSpace, setParkingSpace] = useState([]);
  const [occupiedSpace, setOccupiedSpace] = useState([]);
  const [listVehicle, setListVehicle] = useState([]);

  const initializeParkingSpace = useCallback(
    (carSpaces, motoSpaces) => {
      // Inicializa las celdas del parqueadero para carros y motos
      const carSpacesArray = Array(carSpaces)
        .fill(null)
        .map((_, index) => ({
          type: "car",
          number: index + 1,
          occupied: false,
        }));
      const motoSpacesArray = Array(motoSpaces)
        .fill(null)
        .map((_, index) => ({
          type: "motorcycle",
          number: index + 11,
          occupied: false,
        }));

      const updatedParkingSpaces = [...carSpacesArray, ...motoSpacesArray];

      // Elimina los espacios que están en la lista occupiedSpaces
      const filteredSpaces = updatedParkingSpaces.filter(
        (space) => !occupiedSpace.includes(space.number)
      );

      setParkingSpace(filteredSpaces);

      const availableSpaces = filteredSpaces.map((space) => space.number);
      return availableSpaces;
    },
    [occupiedSpace]
  );

  const getParkingSpace = () => {
    return parkingSpace;
  };

  const getOccupiedSpace = () => {
    return occupiedSpace;
  };

  const parkVehicle = (spaceNumber, selectVehicle) => {
    const updateSpace = parkingSpace.map((space) => {
      if (space.number === spaceNumber) {
        const formattedEntryTime = new Intl.DateTimeFormat("es", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(new Date());
        return {
          ...space,
          occupied: true,
          vehicle: {
            plateNumber: selectVehicle,
            entryTime: formattedEntryTime,
          },
        };
      }
      return space;
    });

    const changedSpace = updateSpace.find(
      (space) => space.number === spaceNumber
    );

    if (changedSpace) {
      setListVehicle((prevListCar) => [...prevListCar, changedSpace]);
    }

    setOccupiedSpace([...occupiedSpace, spaceNumber]);
    setParkingSpace(updateSpace);
  };
  const leaveParkingSpace = (spaceNumber) => {
    const updateSpace = parkingSpace.map((space) => {
      if (space.number === spaceNumber) {
        return { ...space, occupied: false };
      }
      return space;
    });
    setParkingSpace(updateSpace);
    setOccupiedSpace(occupiedSpace.filter((space) => space !== spaceNumber));
    setListVehicle(
      listVehicle.filter((vehicle) => vehicle.number != spaceNumber)
    );
  };

  const getVehicleByPlateNumber = (plateNumber, vehicle, selectedSpace) => {
    const space = vehicle.find((space) => space.plateNumber === plateNumber);
    if (space) {
      return { ...space };
    }
    return null;
  };

  const getVehicleAll = () => {
    return listVehicle;
  };

  return (
    <ParkingContext.Provider
      value={{
        initializeParkingSpace,
        getParkingSpace,
        getOccupiedSpace,
        parkVehicle,
        leaveParkingSpace,
        getVehicleByPlateNumber,
        getVehicleAll,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};
export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error(
      "useParking debe ser utilizado dentro de un ParkingProvider"
    );
  }
  return context;
};
