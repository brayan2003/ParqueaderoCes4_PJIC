/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext } from "react";
import { VehicleProvider } from "./VehicleContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal/Modal";

const UserContext = createContext();

export const UserLogin = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [messageModal, setMessageModal] = useState("");
  const navigate = useNavigate();

  const userProvider = "brayanrepo2015@gmail.com";
  const passwordProvider = "1234";

  const login = (username, password) => {
    if (userProvider == username && passwordProvider == password) {
      setModalType("correct");
      setMessageModal("Login correcto");
      setShowModal(true);
      setUser(username);
      navigate("/dashboard");
    } else {
      setMessageModal("Usuario incorrecto");
      setShowModal(true);
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const logout = () => {
    setUser(null);
    setModalType("correct");
    setMessageModal("Sesion cerrada");
    navigate("/");
  };
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      <VehicleProvider>
        {children}
        {showModal && (
          <Modal
            type={modalType}
            message={messageModal}
            onAccept={closeModal}
          />
        )}
      </VehicleProvider>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("User no esta siendo utilizado en el provider");
  }
  return context;
};
