import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("usuarios");
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // Datos de ejemplo para las métricas
  const metrics = {
    nuevosUsuarios: {
      value: "7,265",
      change: "+11.01%",
      trend: "up"
    },
    eventos: {
      value: "256",
      change: "+15.03%",
      trend: "up"
    }
  };

  // Datos de ejemplo para el gráfico
  const chartData = [
    { month: "Jan", value: 35 },
    { month: "Feb", value: 28 },
    { month: "Mar", value: 42 },
    { month: "Apr", value: 68 },
    { month: "May", value: 55 },
    { month: "Jun", value: 75 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  const handleLogout = () => {
    setShowLogoutMenu(false);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
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
            className="nav-item"
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
          <span className="top-nav-text active">Reportes</span>
        </div>

        {/* Metrics Cards */}
        <div className="metrics-container">
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Nuevos usuarios</h3>
              <button className="metric-icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </button>
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.nuevosUsuarios.value}</div>
              <div className="metric-change positive">{metrics.nuevosUsuarios.change}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Eventos</h3>
              <button className="metric-icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </button>
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.eventos.value}</div>
              <div className="metric-change positive">{metrics.eventos.change}</div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-tabs">
              <button
                className={`chart-tab ${activeView === "usuarios" ? "active" : ""}`}
                onClick={() => setActiveView("usuarios")}
              >
                Usuarios
              </button>
              <button
                className={`chart-tab ${activeView === "eventos" ? "active" : ""}`}
                onClick={() => setActiveView("eventos")}
              >
                Eventos
              </button>
            </div>

            <div className="chart-controls">
              <button className="chart-control-btn">
                Week <span className="dropdown-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>
              <button className="chart-control-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </button>
              <button className="chart-control-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" fill="currentColor"/>
                  <circle cx="19" cy="12" r="1" fill="currentColor"/>
                  <circle cx="5" cy="12" r="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="chart-area">
            <svg className="chart-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="250" x2="800" y2="250" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="187.5" x2="800" y2="187.5" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="125" x2="800" y2="125" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="62.5" x2="800" y2="62.5" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />

              {/* Line path */}
              <path
                d={`M ${chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 800;
                  const y = 250 - (d.value / maxValue) * 200;
                  return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="#9f7aea"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* X-axis labels */}
            <div className="chart-labels">
              {chartData.map((d, i) => (
                <span key={i} className="chart-label">{d.month}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;