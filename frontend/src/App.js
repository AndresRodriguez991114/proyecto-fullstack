import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { useForm } from "react-hook-form";
import api from "./api"; 
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty, isValid } } = useForm({ mode: "onChange" });
  
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar email guardado
  useEffect(() => {
    const savedCheck = localStorage.getItem("isChecked");
    const savedEmail = localStorage.getItem("email");
    
    if (savedCheck === "true" && savedEmail) {
      setRememberMe(true);
      setValue("email", savedEmail, { shouldDirty: true, shouldValidate: true });
      setValue("isChecked", true);
    }
  }, [setValue]);

  // Enviar formulario
  const loginSubmit = async (formData) => {
    const { email, password } = formData;

    // Guardar o borrar email
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("isChecked", "true");
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("isChecked");
    }

    try {
      // Nuevo endpoint del backend REAL
      const response = await api.post('/usuarios/login', { email, password });

      if (response.status === 200) {
        const userData = response.data; // { userId, nombre, rol }

        // Guardamos usuario en localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirección por rol
        if (userData.rol === "administrador") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }

        reset();
      }

    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage("Credenciales incorrectas o usuario no encontrado.");
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.value);
    setValue("isChecked", e.value);
  };

  return (
    <div className="register-container"> 
      <h2>Iniciar Sesión</h2>

      <form autoComplete="off" onSubmit={handleSubmit(loginSubmit)}>
        
        <div className="form-group">
          <label>Email:</label>
          <InputText
            type="text"
            placeholder="Introduzca su email"
            className={errors?.email ? "p-invalid" : ""}
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Formato de email inválido"
              }
            })}
          />
          {errors?.email && <small className="p-error">{errors.email.message}</small>}
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <InputText
            type="password"
            placeholder="Introduzca su contraseña"
            className={errors?.password ? "p-invalid" : ""}
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" }
            })}
          />
          {errors?.password && <small className="p-error">{errors.password.message}</small>}
        </div>

        <div className="form-group remember-me">
          <label style={{ marginRight: "10px" }}>Recuérdame</label>
          <InputSwitch checked={rememberMe} onChange={handleRememberMeChange} />
        </div>

        <div className="buttons">
          <Button type="submit" label="Ingresar" disabled={!isValid || !isDirty} />
          <Button type="button" label="Registrarse" onClick={() => navigate("/register")} />
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
