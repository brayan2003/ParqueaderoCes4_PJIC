/* eslint-disable no-unused-vars */
import React from "react";
import { useUser } from "../../context/UserContext";
import GenericForm from "./GenericForm";
import styles from "./Login.module.css"; // Importa el archivo de estilos

const LoginForm = () => {
  const { login } = useUser();

  const fields = [
    { name: "username", label: "Usuario", type: "text" },
    { name: "password", label: "Contraseña", type: "password" },
  ];

  const handleSubmit = (formData) => {
    login(formData.username, formData.password);
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <GenericForm
        fields={fields}
        handleSubmit={handleSubmit}
        submitButtonText="Iniciar sesión"
      />
    </div>
  );
};

export default LoginForm;
