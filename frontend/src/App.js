import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Paginas/LoginForm";
import UsuariosPage from "./Paginas/UsuariosPage";
import ProtectedRoute from "./Paginas/ProtectedRoute";
import EquiposPage from "./Paginas/EquiposPage";
import ReportesPage from "./Paginas/ReportesPage";
import DiademasPage from "./Paginas/DiademasPage";
import ReparacionPage from "./Paginas/ReparacionPage";
import EnviosPage from "./Paginas/EnviosPage";
import ConfiguracionPage from "./Paginas/ConfiguracionPage";
import InicioPage from "./Paginas/InicioPage";
import Dashboard from "./Paginas/Dashboard";


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
