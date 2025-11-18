import { useEffect, useState } from "react";

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("https://proyecto-fullstack-nfai.onrender.com/api/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.log("Error:", err));
  }, []);

  return (
    <div style={{padding: 20}}>
      <h1>Usuarios desde mi backend</h1>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>
            {u.nombre} - {u.correo} - {u.edad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
