import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { useForm } from "react-hook-form";
import api from "../api";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty, isValid } } = useForm({ mode: "onChange" });
  
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedCheck = localStorage.getItem("isChecked");
    const savedEmail = localStorage.getItem("email");

    if (savedCheck === "true" && savedEmail) {
      setRememberMe(true);
      setValue("email", savedEmail, { shouldDirty: true, shouldValidate: true });
      setValue("isChecked", true);
    }
  }, [setValue]);

  const loginSubmit = async ({ email, password }) => {
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("isChecked", "true");
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("isChecked");
    }

    try {
      const response = await api.post("/usuarios/login", { email, password });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));

        if (response.data.rol === "administrador") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }

        reset();
      }
    } catch (error) {
      setErrorMessage("Credenciales incorrectas.");
    }
  };

  return (
    <div className="login-page">
      {/* Lado izquierdo */}
      <div className="login-left">
        <h1>Tus finanzas en un solo lugar</h1>
        <p>Ingresa informes, crea presupuestos, sincroniza con tus bancos…</p>
        <img src="/mockup.png" alt="mockup" className="login-mockup" />
      </div>

      {/* Lado derecho */}
      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>

          <form autoComplete="off" onSubmit={handleSubmit(loginSubmit)}>

            <label>Email:</label>
            <InputText
              type="text"
              placeholder="correo@example.com"
              className={errors?.email ? "p-invalid" : ""}
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Formato inválido"
                }
              })}
            />
            {errors?.email && <small className="p-error">{errors.email.message}</small>}

            <label>Contraseña:</label>
            <InputText
              type="password"
              placeholder="introduzca su contraseña"
              className={errors?.password ? "p-invalid" : ""}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" }
              })}
            />
            {errors?.password && <small className="p-error">{errors.password.message}</small>}

            <div className="remember-container">
              <span>Recuérdame</span>
              <InputSwitch checked={rememberMe} onChange={(e) => setRememberMe(e.value)} />
            </div>

            <div className="btn-group">
              <Button type="submit" label="Ingresar" className="btn-main" disabled={!isValid || !isDirty} />
              <Button type="button" label="Registrarse" className="btn-sec" onClick={() => navigate("/register")} />
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
