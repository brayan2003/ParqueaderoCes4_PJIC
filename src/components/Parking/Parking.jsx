/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParking } from "../../context/ParkingContext";
import "./ParkingStyles.css"; // Importa el archivo de estilos
import Modal from "../Modal/Modal";

function Parking() {
  const { getParkingSpace, getVehicleAll, leaveParkingSpace } = useParking();
  const parkingSpace = getParkingSpace();
  const vehicles = getVehicleAll();

  const [filter, setFilter] = useState("disponibles");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [messageModal, setMessageModal] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };
  const handleDeleteCell = (spaceNumber) => {
    leaveParkingSpace(spaceNumber);
    setModalType("correct");
    setMessageModal("Vehiculo liberado");
    setShowModal(true);
  };

  const filteredData =
    filter === "disponibles"
      ? parkingSpace.filter((space) => !space.occupied)
      : vehicles.filter((space) => space.occupied);

  return (
    <div>
      <h4>Estado del parqueadero</h4>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="disponibles">Disponibles</option>
        <option value="ocupadas">Ocupadas</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Celda</th>
            {filter === "ocupadas" && <th>Placa</th>}
            {filter === "ocupadas" && <th>Hora de ingreso</th>}
            {filter === "ocupadas" && <th>Salida</th>}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((space, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>
                {`${space.type === "car" ? "Carro" : "Moto"} `}
              </td>
              <td style={{ textAlign: "center" }}>
                {`Celda ${space.number} ${space.occupied}`}
              </td>
              {filter === "ocupadas" && (
                <>
                  <td style={{ textAlign: "center" }}>
                    {`${space.vehicle.plateNumber}`}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {`${space.vehicle.entryTime}`}
                  </td>
                </>
              )}
              {filter === "ocupadas" && (
                <td>
                  <button onClick={() => handleDeleteCell(space.number)}>
                    Dar salida
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <Modal type={modalType} message={messageModal} onAccept={closeModal} />
      )}
    </div>
  );
}

export default Parking;
