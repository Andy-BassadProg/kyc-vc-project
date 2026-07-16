import { NavLink, Outlet } from "react-router-dom";
import { useFlash } from "../context/FlashContext";

export default function Layout() {
  const { messages, dismissFlash } = useFlash();

  return (
    <>
      <header className="topbar">
        <NavLink className="brand" to="/">
          <svg className="seal" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
            <path
              d="M32 16 L44 22 V32 C44 41 38 47 32 49 C26 47 20 41 20 32 V22 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M26 32 L30 37 L39 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="brand-text">
            <strong>KYC OFFLINE</strong>
            <small>Guichet d'identité vérifiable</small>
          </span>
        </NavLink>
        <nav className="mainnav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Tableau de bord
          </NavLink>
          <NavLink to="/enrolement" className={({ isActive }) => (isActive ? "active" : "")}>
            Enrôlement
          </NavLink>
          <NavLink to="/verification" className={({ isActive }) => (isActive ? "active" : "")}>
            Vérification
          </NavLink>
          <NavLink to="/revocation" className={({ isActive }) => (isActive ? "active" : "")}>
            Révocation
          </NavLink>
          <NavLink to="/registre" className={({ isActive }) => (isActive ? "active" : "")}>
            Registre
          </NavLink>
        </nav>
      </header>

      <main className="page">
        {messages.length > 0 && (
          <div className="flash-stack">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flash flash-${m.category}`}
                onClick={() => dismissFlash(m.id)}
                role="alert"
                style={{ cursor: "pointer" }}
                title="Cliquer pour masquer"
              >
                {m.message}
              </div>
            ))}
          </div>
        )}

        <Outlet />
      </main>

      <footer className="footer">
        <span>Système KYC hors-ligne — les identités restent vérifiables sans connexion internet.</span>
      </footer>
    </>
  );
}
