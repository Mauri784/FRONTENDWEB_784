import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Eventos.css";

import {
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
} from "../services/Eventos";

function Eventos() {
  const navigate = useNavigate();

  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [eventosData, setEventosData] = useState<
    {
      id_event: number;
      name_event: string;
      id_building: number;
      timedate_event: string;
      status_event: number;
      id_profe: number;
      id_user: number;
    }[]
  >([]);

  const [usuarios, setUsuarios] = useState<
    { id_user: number; name_user: string }[]
  >([]);

  const [edificios, setEdificios] = useState<
    { id_building: number; name_building: string }[]
  >([]);

  const [profesores, setProfesores] = useState<
    { id_profe: number; nombre_profe: string }[]
  >([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name_event: "",
    id_building: "",
    timedate_event: "",
    id_profe: "",
    id_user: "",
  });

  const [formError, setFormError] = useState("");

  // ✅ Cargar datos al iniciar
  useEffect(() => {
    fetchEventos();
    fetchUsuarios();
    fetchEdificios();
    fetchProfesores();
  }, []);

  // ===============================
  // ✅ FETCHES
  // ===============================

  const fetchEventos = async () => {
    try {
      const data = await getEventos();
      setEventosData(data);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const fetchEdificios = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/edificios");
      const data = await response.json();
      setEdificios(data);
    } catch (error) {
      console.error("Error cargando edificios:", error);
    }
  };

  const fetchProfesores = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/profesores");
      const data = await response.json();
      setProfesores(data);
    } catch (error) {
      console.error("Error cargando profesores:", error);
    }
  };

  // ===============================
  // ✅ LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setShowLogoutMenu(false);
    navigate("/", { replace: true });
  };

  // ===============================
  // ✅ FILTRO
  // ===============================

  const filteredEventos = eventosData.filter((evento) =>
    evento.name_event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===============================
  // ✅ FORMULARIO
  // ===============================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===============================
  // ✅ GUARDAR EVENTO (CREATE / UPDATE)
  // ===============================

  const handleSaveEvento = async () => {
    setFormError("");

    try {
      const payload = {
        name_event: formData.name_event,
        id_building: parseInt(formData.id_building),
        timedate_event: formData.timedate_event,
        id_profe: parseInt(formData.id_profe),
        id_user: parseInt(formData.id_user),
      };

      if (editingId) {
        await updateEvento(editingId, payload);
      } else {
        await createEvento(payload);
      }

      setShowModal(false);
      setEditingId(null);

      setFormData({
        name_event: "",
        id_building: "",
        timedate_event: "",
        id_profe: "",
        id_user: "",
      });

      fetchEventos();
    } catch (error) {
      console.error("Error guardando evento:", error);
      setFormError("Error al guardar el evento");
    }
  };

  // ===============================
  // ✅ EDITAR
  // ===============================

  const handleEditClick = (evento: typeof eventosData[0]) => {
    setEditingId(evento.id_event);

    const formattedDate = evento.timedate_event
      .replace(" ", "T")
      .substring(0, 16);

    setFormData({
      name_event: evento.name_event,
      id_building: evento.id_building.toString(),
      timedate_event: formattedDate,
      id_profe: evento.id_profe.toString(),
      id_user: evento.id_user.toString(),
    });

    setShowModal(true);
  };

  // ===============================
  // ✅ ELIMINAR
  // ===============================

  const handleDeleteEvento = async (id: number) => {
    if (!window.confirm("¿Eliminar evento?")) return;

    try {
      await deleteEvento(id);
      fetchEventos();
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  // ===============================
  // ✅ CERRAR MODAL
  // ===============================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);

    setFormData({
      name_event: "",
      id_building: "",
      timedate_event: "",
      id_profe: "",
      id_user: "",
    });

    setFormError("");
  };

  // ===============================
  // ✅ HELPERS
  // ===============================

  const getNombreEdificio = (id: number) => {
    const edificio = edificios.find((e) => e.id_building === id);
    return edificio ? edificio.name_building : `Edificio ${id}`;
  };

  const getNombreProfesor = (id: number) => {
    const profesor = profesores.find((p) => p.id_profe === id);
    return profesor ? profesor.nombre_profe : `Profesor ${id}`;
  };

  const getNombreUsuario = (id: number) => {
    const usuario = usuarios.find((u) => u.id_user === id);
    return usuario ? usuario.name_user : `Usuario ${id}`;
  };

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
              <button className="btn-primary" onClick={() => setShowModal(true)}>
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
                  <tr key={evento.id_event}>
                    <td className="cell-name">{evento.name_event}</td>
                    <td>{getNombreEdificio(evento.id_building)}</td>
                    <td>{evento.timedate_event}</td>
                    <td>{getNombreProfesor(evento.id_profe)}</td>
                    <td>{getNombreUsuario(evento.id_user)}</td>
                    <td>
                      <span className={`status-badge ${evento.status_event === 0 ? "status-inactive" : "status-active"}`}>
                        {evento.status_event === 0 ? "Inactivo" : "Activo"}
                      </span>
                    </td>
                    <td className="cell-actions">
                      <button className="action-btn" title="Editar" onClick={() => handleEditClick(evento)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className={`action-btn ${evento.status_event === 0 ? "action-btn-disabled" : ""}`} title="Toggle Status" onClick={() => handleToggleStatus(evento)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
                          <circle cx="16" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className="action-btn action-btn-delete" title="Eliminar" onClick={() => handleDeleteEvento(evento.id_event)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-group">
                <label>Nombre del Evento</label>
                <input
                  type="text"
                  name="name_event"
                  value={formData.name_event}
                  onChange={handleInputChange}
                  placeholder="Ej: Auditorio"
                />
              </div>
              <div className="form-group">
                <label>Edificio</label>
                <select
                  name="id_building"
                  value={formData.id_building}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_building: e.target.value }))}
                >
                  <option value="">Seleccionar edificio</option>
                  {edificios.map(edificio => (
                    <option key={edificio.id_building} value={edificio.id_building}>
                      {edificio.name_building}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha y Hora</label>
                <input
                  type="datetime-local"
                  name="timedate_event"
                  value={formData.timedate_event}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Profesor</label>
                <select
                  name="id_profe"
                  value={formData.id_profe}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_profe: e.target.value }))}
                >
                  <option value="">Seleccionar profesor</option>
                  {profesores.map(profesor => (
                    <option key={profesor.id_profe} value={profesor.id_profe}>
                      {profesor.nombre_profe}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Usuario</label>
                <select
                  name="id_user"
                  value={formData.id_user}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_user: e.target.value }))}
                >
                  <option value="">Seleccionar usuario</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.id_user} value={usuario.id_user}>
                      {usuario.name_user}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-submit" onClick={handleSaveEvento}>{editingId ? 'Actualizar' : 'Crear'} Evento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Eventos;