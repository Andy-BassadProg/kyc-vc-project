import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Enrolement from "@/pages/Enrolement/Enrolement";
import Emission from "@/pages/Emission/Emission";
import Verification from "@/pages/Verification/Verification";
import VerificationOffline from "@/pages/VerificationOffline/VerificationOffline";
import Revocation from "@/pages/Revocation/Revocation";
import Registre from "@/pages/Registre/Registre";
import CredentialDetail from "@/pages/CredentialDetail/CredentialDetail";

// Correspondance avec les commandes CLI du backend :
//  /login                 -> ensure_login()
//  /                       -> registre_national.json (vue globale)
//  /enrolement/nouveau     -> agent_terminal.py
//  /emission               -> kyc_pipeline.py issue
//  /verification           -> kyc_pipeline.py verify
//  /verification-offline   -> verifier_offline_final.py
//  /revocation             -> revoke_agent.py
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enrolement/nouveau" element={<Enrolement />} />
          <Route path="/emission" element={<Emission />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/verification-offline" element={<VerificationOffline />} />
          <Route path="/revocation" element={<Revocation />} />
          <Route path="/registre" element={<Registre />} />
          <Route path="/registre/:niu" element={<CredentialDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
