import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Eventos.css";

function Eventos() {
  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo para los eventos
  const eventosData = [
    {
      id: 1,
      nombre: "Auditorio",
      edificio: "Edificio A",
      fecha: "2024-03-15 10:00",
      status: "Activo",
      profesor: "Dr. García",
      usuario: "Administrador"
    },
    {
      id: 2,
      nombre: "Edificio K",
      edificio: "Edificio K",
      fecha: "2024-03-16 14:00",
      status: "Activo",
      profesor: "Dr. Martínez",
      usuario: "Admin"
    },
    {
      id: 3,
      nombre: "Edificio C",
      edificio: "Edificio C",
      fecha: "2024-03-17 09:00",
      status: "Activo",
      profesor: "Dra. López",
      usuario: "Admin"
    },
    {
      id: 4,
      nombre: "Edificio J",
      edificio: "Edificio J",
      fecha: "2024-03-18 11:00",
      status: "Activo",
      profesor: "Dr. Rodríguez",
      usuario: "Admin"
    },
    {
      id: 5,
      nombre: "Edificio I",
      edificio: "Edificio I",
      fecha: "2024-03-19 15:00",
      status: "Activo",
      profesor: "Dr. Sánchez",
      usuario: "Admin"
    }
  ];

  const handleLogout = () => {
    setShowLogoutMenu(false);
    navigate("/");
  };

  const filteredEventos = eventosData.filter(evento =>
    evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.edificio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="eventos-container">
      {/* Sidebar */}
      <aside className="sidebar">
      

        <nav className="sidebar-nav">
              <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </span>
            <span className="nav-text">Dashboard</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/usuarios")}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <span className="nav-text">Usuarios</span>
          </button>

          <button
            className="nav-item active"
            onClick={() => navigate("/eventos")}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <span className="nav-text">Eventos</span>
          </button>

        
        </nav>

        <div className="sidebar-footer">
          <div 
            className="user-profile"
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
          >
            <div className="user-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="user-name">Admin</span>
          </div>
          
          {showLogoutMenu && (
            <div className="logout-menu">
              <button className="logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navigation - Static Text */}
        <div className="top-nav">
          <span className="top-nav-text inactive">Dashboards</span>
          <span className="top-nav-separator">/</span>
          <span className="top-nav-text active">Eventos</span>
        </div>

        {/* Content Card */}
        <div className="content-card">
          {/* Header */}
          <div className="content-header">
            <div className="header-left">
              <h2 className="content-title">Eventos</h2>
              <button className="btn-primary">
                Agregar
              </button>
            </div>
            <div className="header-right">
              <button className="btn-filter">
                Add filter
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search for a student by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edificio</th>
                  <th>Fecha y Hora</th>
                  <th>Profesor</th>
                  <th>Usuario</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredEventos.map((evento) => (
                  <tr key={evento.id}>
                    <td className="cell-name">{evento.nombre}</td>
                    <td>{evento.edificio}</td>
                    <td>{evento.fecha}</td>
                    <td>{evento.profesor}</td>
                    <td>{evento.usuario}</td>
                    <td>
                      <span className="status-badge">{evento.status}</span>
                    </td>
                    <td className="cell-actions">
                      <button className="action-btn" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="action-btn" title="Toggle Status">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
                          <circle cx="16" cy="12" r="3"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="content-footer">
            <p className="footer-text">© 2024</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Eventos;