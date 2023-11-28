/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useVehicle } from "../../context/VehicleContext";
import styles from "./VehicleForm.module.css";
import Modal from "../Modal/Modal";

const VehicleForm = () => {
  const { registerVehicle, checkIfVehicleExists, getVehicles } = useVehicle();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [messageModal, setMessageModal] = useState("");

  const [vehicleType, setVehicleType] = useState("car");
  const [plateNumber, setPlateNumber] = useState("");
  const [nameConductor, setNameConductor] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedEngineSize, setSelectedEngineSize] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const vehicles = getVehicles();
  const documentOptions = [
    ...new Set(vehicles.map((vehicle) => vehicle.documentNumber)),
  ];

  const brandOptions = ["Toyota", "Honda", "Ford"];
  const modelOptions = ["Sedan", "SUV", "Truck"];
  const engineSizeOptions = ["1500cc", "2000cc", "2500cc"];

  const isValidPlateNumber = (value) => {
    const plateRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    return plateRegex.test(value);
  };

  useEffect(() => {
    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.documentNumber === selectedDocument
    );
    if (selectedVehicle) {
      setNameConductor(selectedVehicle.nameConductor);
    } else {
      setNameConductor("");
    }
  }, [selectedDocument, vehicles]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const documentNumber =
      selectedDocument !== "otro" ? selectedDocument : newDocument;

    const brand = selectedBrand;

    const model = selectedModel;

    const engineSize = selectedEngineSize;
    if (
      !plateNumber ||
      !brand ||
      (!model && vehicleType === "car") ||
      (!engineSize && vehicleType === "motorcycle") ||
      !documentNumber ||
      !nameConductor
    ) {
      setModalType("error");
      setMessageModal("Rellene todos los campos");
      setShowModal(true);
    } else {
      const isVehicleExists = await checkIfVehicleExists(plateNumber);
      if (isVehicleExists) {
        setModalType("error");
        setMessageModal("El vehículo ya está registrado");
        setShowModal(true);
      } else {
        if (!isValidPlateNumber(plateNumber) || plateNumber.length !== 6) {
          setModalType("error");
          setMessageModal("Número de placa incorrecto");
          setShowModal(true);
          return;
        } else if (parseInt(documentNumber) > 0 && documentNumber.length >= 6) {
          registerVehicle({
            type: vehicleType,
            plateNumber,
            brand,
            model,
            engineSize,
            documentNumber,
            nameConductor,
          });
          setModalType("correct");
          console.log(registerVehicle.type);
          setMessageModal(`Se registra correctamente `);
          setShowModal(true);
          setPlateNumber("");
          setSelectedDocument("");
          setNameConductor("");
          setSelectedBrand("");
          setSelectedModel("");
          setSelectedEngineSize("");
        } else {
          setModalType("error");
      setMessageModal("El numero de documento no valido");
      setShowModal(true);
        }
      }
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className={styles.formContainer}>
      <h2>Registrar Vehiculo</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Tipo de Vehículo:</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="car">Carro</option>
          <option value="motorcycle">Moto</option>
        </select>

        <label>Número de Documento:</label>
        <select
          value={selectedDocument}
          onChange={(e) => setSelectedDocument(e.target.value)}
        >
          <option value="">Seleccione una opción</option>
          {documentOptions.map((document, index) => (
            <option key={index} value={document}>
              {document}
            </option>
          ))}
          <option value="otro">Otro</option>
        </select>

        {selectedDocument === "otro" && (
          <input
            type="text"
            value={newDocument}
            onChange={(e) => setNewDocument(e.target.value)}
            placeholder="Ingrese nuevo documento"
          />
        )}

        <label>Nombre del conductor:</label>
        <input
          type="text"
          value={nameConductor}
          onChange={(e) => setNameConductor(e.target.value)}
        />
        <label>Número de Placa:</label>
        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
        />

        <label>Marca:</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Seleccione una opción</option>
          {brandOptions.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {vehicleType === "car" && (
          <>
            <label>Modelo:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              {modelOptions.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </>
        )}

        {vehicleType === "motorcycle" && (
          <>
            <label>Cilindraje:</label>
            <select
              value={selectedEngineSize}
              onChange={(e) => setSelectedEngineSize(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              {engineSizeOptions.map((engineSize, index) => (
                <option key={index} value={engineSize}>
                  {engineSize}
                </option>
              ))}
            </select>
          </>
        )}
        {showModal && (
          <Modal
            type={modalType}
            message={messageModal}
            onAccept={closeModal}
          />
        )}

        <button type="submit">Registrar Vehículo</button>
      </form>
    </div>
  );
};

export default VehicleForm;
