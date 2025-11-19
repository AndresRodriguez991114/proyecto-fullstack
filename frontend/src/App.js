import React, { useState } from "react";
import LoginForm from "./components/LoginForm";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div>
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <h1>Bienvenido {user.nombre}</h1>
      )}
    </div>
  );
}

export default App;
