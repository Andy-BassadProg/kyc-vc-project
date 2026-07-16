import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Enrolement from "./pages/Enrolement";
import Verification from "./pages/Verification";
import Revocation from "./pages/Revocation";
import Registre from "./pages/Registre";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="enrolement" element={<Enrolement />} />
        <Route path="verification" element={<Verification />} />
        <Route path="revocation" element={<Revocation />} />
        <Route path="registre" element={<Registre />} />
      </Route>
    </Routes>
  );
}
