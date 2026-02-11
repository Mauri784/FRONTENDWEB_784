import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Eventos from "./pages/Eventos";
import Usuarios from "./pages/Usuarios";
import Reportes from "./pages/Reportes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
