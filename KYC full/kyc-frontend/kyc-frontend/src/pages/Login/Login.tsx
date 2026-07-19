import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";

// Connexion agent au wallet (POST /wallet-api/auth/login) — equiv. ensure_login()
export default function Login() {
  const [email, setEmail] = useState(import.meta.env.VITE_DEFAULT_AGENT_EMAIL || "");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={(e) => { e.preventDefault(); login(email, password); }}
        className="bg-white rounded-lg shadow p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <div>
          <h1 className="text-lg font-semibold">KYC Offline</h1>
          <p className="text-sm text-gray-500">Connexion agent de guichet</p>
        </div>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <Toast type="error" message={error} />}
        <Button type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</Button>
      </form>
    </div>
  );
}
