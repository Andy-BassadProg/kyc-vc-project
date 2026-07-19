import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Tableau de bord" },
  { to: "/enrolement/nouveau", label: "Nouvel enrôlement" },
  { to: "/emission", label: "Émission credential" },
  { to: "/verification", label: "Vérification (en ligne)" },
  { to: "/verification-offline", label: "Vérification offline" },
  { to: "/revocation", label: "Révocation" },
  { to: "/registre", label: "Registre national" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 p-4">
      <h1 className="text-lg font-semibold mb-6">KYC Offline — Agence</h1>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm ${isActive ? "bg-slate-700" : "hover:bg-slate-800"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
