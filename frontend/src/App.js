import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import UsuariosPage from "./components/UsuariosPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EquiposPage from "./components/EquiposPage";
import ReportesPage from "./components/ReportesPage";
import RecepcionPage from "./components/RecepcionPage";
import ReparacionPage from "./components/ReparacionPage";
import ClientesPage from "./components/ClientesPage";
import ConfiguracionPage from "./components/ConfiguracionPage";
import InicioPage from "./components/InicioPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route path="/AdminDashboard" element={<div>Usuario normal: dashboard</div>} />

        <Route path="/inicio" element={<InicioPage />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/recepcion" element={<RecepcionPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/reparacion" element={<ReparacionPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <InicioPage/>
            </ProtectedRoute>
          }
        />
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
