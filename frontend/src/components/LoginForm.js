import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api";
import "../Styles/LoginForm.css";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import Logo from "../images/Logo.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: "onChange" });

  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

    // 👁 estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

    // 👀 observar campos en tiempo real
  const email = watch("email");
  const password = watch("password");

   // ⚡ activar botón solo cuando ambos campos tengan texto
  const formReady = email && password;

  // -------------------------------
  // Cargar datos de "Recuérdame"
  // -------------------------------
  useEffect(() => {
    const savedCheck = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedCheck === "true" && savedEmail) {
      setRememberMe(true);
      setValue("email", savedEmail, { shouldDirty: true, shouldValidate: true });
    }
  }, [setValue]);

  // -------------------------------
  // Login
  // -------------------------------
  const onSubmit = async (formData) => {
    setErrorMessage("");

    // Normalizar email antes de enviar (nuevo)
    const emailNormalized = formData.email.trim().toLowerCase();
    const passwordToSend = formData.password;

    try {
      // Nota: si tu api.js tiene baseURL = "/api" entonces este endpoint está bien.
      // Si no, usa "/api/usuarios/login" o ajusta baseURL.
      const response = await api.post("/usuarios/login", {
        email: emailNormalized,
        password: passwordToSend,
      });

      // Guardar token en localStorage (nuevo)
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Guardar email si RememberMe está activo
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberEmail", emailNormalized);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberEmail");
      }

      // Guardar datos del usuario (sin password)
      // response.data.user viene del backend (según tu server.js)
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Redirección según rol
      if (response.data?.user?.rol === "administrador") navigate("/inicio");
      else navigate("/Dashboard");

      reset();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      // Mostrar mensaje amigable; si el backend envía 401 lo mostramos
      if (error.response?.status === 401) {
        setErrorMessage(error.response.data?.message || "Upss!! Credenciales incorrectas");
      } else {
        setErrorMessage("Error de conexión con el servidor");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <h2 className="login-title">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="form-group">
            <input
              type="text"
              placeholder="Email ID"
              className={errors.email ? "input error" : "input"}
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Formato de email inválido",
                },
              })}
            />
            <FaEnvelope className="icon-input" />
            {errors.email && <small className="error-text">{errors.email.message}</small>}
          </div>

          {/* PASSWORD con ojo 👁 */}
          <div className="form-group">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={errors.password ? "input error" : "input"}
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "Debe tener mínimo 8 caracteres",
                  },
                })}
              />
              {/* 👁 Ícono para mostrar/ocultar */}
              {showPassword ? (
                <FaEyeSlash className="icon-input" onClick={() => setShowPassword(false)} />
              ) : (
                <FaEye className="icon-input" onClick={() => setShowPassword(true)} />
              )}
            </div>

            {errors.password && <small className="error-text">{errors.password.message}</small>}
          </div>

          <div className="remember-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Recuérdame
            </label>
          </div>

          <button
            type="submit"
            className={`btn-login ${formReady ? "active" : "disabled"}`}
            disabled={!formReady || !isValid || !isDirty}
          >
            Login
          </button>

          {errorMessage && <p className="server-error">{errorMessage}</p>}
        </form>

        <p className="legal-text">© 2025 Cloud + Inventory. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default LoginForm;
