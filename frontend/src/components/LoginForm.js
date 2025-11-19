import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Validación de los campos
  const validate = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    // Validar email vacío
    if (!email.trim()) {
      newErrors.email = "El campo email es obligatorio";
      valid = false;
    } else {
      // Validar formato
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        newErrors.email = "El formato del email es incorrecto";
        valid = false;
      }
    }

    // Validar contraseña
    if (!password.trim()) {
      newErrors.password = "El campo contraseña es obligatorio";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Manejador de la lógica de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del formulario
    if (!validate()) return;

    console.log("Iniciando sesión...");

    try {
      // Enviar los datos al servidor usando fetch
      const response = await fetch(
        "https://proyecto-fullstack-nfai.onrender.com/api/usuarios/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // Verificar si la respuesta es correcta
      if (!response.ok) {
        alert(data.message || "Credenciales incorrectas");
        return;
      }

      // Guardar los datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data));

      alert("Inicio de sesión exitoso");

      // Redirigir a otra página (como el Dashboard)
      window.location.href = "/dashboard"; // o usa React Router para una navegación más controlada

    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      {/* LADO IZQUIERDO */}
      <div className="left-section">
        <h1 className="title">invantario al alcanxe de un click</h1>

        <img src="/images/mockup.png" className="mockup-img" alt="mockup" />
      </div>

      {/* FORM */}
      <div className="right-section">
        <div className="form-card">
          <h2 className="form-title">Iniciar Sesión</h2>

          <label>Email:</label>
          <input
            className={errors.email ? "input error" : "input"}
            type="email"
            placeholder="Correo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label>Contraseña:</label>
          <input
            className={errors.password ? "input error" : "input"}
            type="password"
            placeholder="introduzca su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <div className="remember-container">
            <span>Recuérdame</span>

            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="button-group">
            {/* Usamos el onSubmit en el form en lugar de onClick */}
            <button className="btn-login" onClick={handleSubmit}>
              Ingresar
            </button>
            <button className="btn-register">Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
