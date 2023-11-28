/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useVehicle } from "../../context/VehicleContext";
import { useParking } from "../../context/ParkingContext";
import styles from "./VehicleForm.module.css";
import Modal from "../Modal/Modal";

function VehicleEntryForm() {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("");
  const { searchVehicles, getVehicles } = useVehicle();
  const [typeSelected, setTypeSelected] = useState("");

  const [identification, setIdentification] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [messageModal, setMessageModal] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };
  const {
    initializeParkingSpace,
    getParkingSpace,
    getOccupiedSpace,
    parkVehicle,
    getVehicleByPlateNumber,
    getVehicleAll,
  } = useParking();

  const [parkingSpacesList, setParkingSpacesList] = useState([]);
  const occupiedSpaces = getOccupiedSpace();
  const vehiclesAll = getVehicleAll();
  const vehicles = getVehicles();
  const parkingSpaces = getParkingSpace();

  // Inicializa el espacio
  useEffect(() => {
    const updatedSpacesList = initializeParkingSpace(10, 10);
    setParkingSpacesList(updatedSpacesList);
  }, [initializeParkingSpace]);

  // Buscador
  const handleSearch = () => {
    const query = identification || plateNumber;
    setSearchResults([]);

    // Llamar a la función de búsqueda del contexto
    searchVehicles(query)
      .then((results) => {
        setSearchResults(results);
        if (results.length === 1) {
          // Si hay un solo resultado, selecciona automáticamente el vehículo
          handleVehicleChange(results[0].plateNumber);
        } else if (results.length === 0) {
          setModalType("error");
          setMessageModal("No se encontró el vehículo registrado");
          setShowModal(true);
        }
      })
      .catch((error) => {
        setModalType("error");
        setMessageModal(error.message);
        setShowModal(true);
      });
  };

  // Manejar cambio de vehículo
  const handleVehicleChange = (value) => {
    const type = vehicles.find((e) => e.plateNumber === value);
    console.log(type.type);
    setTypeSelected(type.type);
    setSelectedVehicle(value);
    console.log(setSelectedVehicle(value));
  };

  // Asigna parqueadero
  const handleSpaceParking = (event) => {
    const selectedSpace = event.target.value;
    if (occupiedSpaces.includes(selectedSpace)) {
      setModalType("error");
      setMessageModal("Celda ocupada");
      setShowModal(true);
    } else {
      setSelectedSpace(selectedSpace);
    }
  };

  // Establecer el vehículo seleccionado al cargar los resultados
  useEffect(() => {
    if (searchResults.length === 1) {
      handleVehicleChange(searchResults[0].plateNumber);
    }
  }, [searchResults]);

  // Registrar vehículo
  const handleParkVehicle = () => {
    if (!selectedVehicle || !selectedSpace) {
      setModalType("error");
      setMessageModal("Seleccione un vehículo y el espacio del parqueadero");
      setShowModal(true);
      return;
    }

    const spaceNumber = parseInt(selectedSpace, 10);
    const vehicleInfo = getVehicleByPlateNumber(
      selectedVehicle,
      vehicles,
      spaceNumber
    );

    const validateRegisterVehicle = vehiclesAll.map(
      (i) => i.vehicle.plateNumber
    );
    console.log("resultado: " + validateRegisterVehicle);
    if (vehicleInfo && !validateRegisterVehicle.includes(selectedVehicle)) {
      parkVehicle(spaceNumber, selectedVehicle, vehicleInfo.plateNumber);
      setModalType("correct");
      setMessageModal("Vehículo registrado");
      setShowModal(true);
      const updatedSpaceList = parkingSpacesList.filter(
        (space) => space !== spaceNumber
      );
      setParkingSpacesList(updatedSpaceList);
      setSelectedVehicle("");
      setSelectedSpace("");
    } else {
      setModalType("error");
      setMessageModal("Ya está registrado");
      setShowModal(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Ingreso de Vehículo al Parqueadero</h2>
      <label className={styles.label}>
        Cédula del Usuario o Número de Placa:
      </label>
      <input
        type="text"
        value={identification}
        onChange={(e) => setIdentification(e.target.value)}
        className={styles.input}
      />
      <br />
      <button onClick={handleSearch}>Buscar Vehículo</button>

      {searchResults.length > 0 && (
        <div>
          <h3>Seleccione el Vehículo:</h3>
          {searchResults.length === 1 ? (
            <div>
              <p>Solo hay un vehículo:</p>
              <p>{searchResults[0].plateNumber}</p>
            </div>
          ) : (
            <select
              value={selectedVehicle}
              onChange={(e) => handleVehicleChange(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              {searchResults.map((vehicle) => (
                <option key={vehicle.plateNumber} value={vehicle.plateNumber}>
                  {vehicle.plateNumber}
                </option>
              ))}
            </select>
          )}
          <h3>Seleccione el lugar de parqueadero:</h3>
          <select
            value={selectedSpace}
            onChange={handleSpaceParking}
            disabled={!selectedVehicle}
          >
            <option value="">Seleccione una opción</option>
            {parkingSpaces.map((space, index) => {
              if (!space.occupied) {
                if (
                  (typeSelected === "motorcycle" &&
                    space.type === "motorcycle") ||
                  (typeSelected === "car" && space.type === "car")
                ) {
                  return (
                    <option key={index} value={space.number}>
                      {space.number}
                    </option>
                  );
                }
              }

              return null;
            })}
          </select>
          <button onClick={handleParkVehicle}>Registrar Vehículo</button>
        </div>
      )}
      {showModal && (
        <Modal type={modalType} message={messageModal} onAccept={closeModal} />
      )}
    </div>
  );
}

export default VehicleEntryForm;
