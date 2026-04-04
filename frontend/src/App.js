import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import UsuariosPage from "./components/UsuariosPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EquiposPage from "./components/EquiposPage";
import ReportesPage from "./components/ReportesPage";
import DiademasPage from "./components/DiademasPage";
import ReparacionPage from "./components/ReparacionPage";
import EnviosPage from "./components/EnviosPage";
import ConfiguracionPage from "./components/ConfiguracionPage";
import InicioPage from "./components/InicioPage";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route path="/AdminDashboard" element={<div>Usuario normal: dashboard</div>} />
        
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="/diademas" element={<DiademasPage />} />
        <Route path="/reparacion" element={<ReparacionPage />} />
        <Route path="/Envios" element={<EnviosPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />

        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <InicioPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <UsuariosPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <ReportesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
