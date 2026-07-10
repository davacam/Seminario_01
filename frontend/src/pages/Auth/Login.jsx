import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import useAuthStore from "../../store/authStore";
import authService from "../../services/authService";
import publicService from "../../services/publicService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAuthError = useAuthStore((state) => state.setError);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        const data = await publicService.getLoginSummary();
        if (isMounted) setSummary(data);
      } catch (err) {
        console.error("Error loading login summary:", err);
      }
    };

    loadSummary();
    const intervalId = window.setInterval(loadSummary, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);

      setTokens(result.accessToken, result.refreshToken);
      setUser(result.user);
      setAuthError(null);

      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to login. Please try again.";
      setError(errorMsg);
      setAuthError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center gap-6 sm:min-h-[calc(100vh-4rem)] sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="page-enter hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
            <ShieldCheck size={16} />
            Demo conectado a API propia
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-tight text-white">
            Control operativo para equipos tecnicos en campo
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-400">
            Gestiona clientes, tareas, usuarios y estados desde una consola limpia,
            lista para evolucionar hacia reportes y flujos más avanzados.
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
            {[
              ["Usuarios", summary?.users ?? "...", "bg-sky-400"],
              ["Tareas", summary?.tasks ?? "...", "bg-amber-400"],
              ["Clientes", summary?.clients ?? "...", "bg-emerald-400"],
            ].map(([label, value, color], index) => (
              <div
                key={label}
                className="float-in surface interactive-lift rounded-lg p-4"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className={`mb-4 h-2 w-10 rounded-full ${color}`} />
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-1 text-3xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="float-in">
          <div className="surface relative overflow-hidden rounded-lg p-5 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300" />
            <div className="mb-8">
              <div className="mb-4 inline-flex rounded-lg bg-sky-400/10 p-3 text-sky-200">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">TechDesk</h2>
              <p className="mt-2 text-slate-400">Inicia sesión para acceder a la plataforma.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-200">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="********"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn size={20} />
                {isLoading ? "Ingresando..." : "Entrar al demo"}
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
              <p className="mb-3 flex items-center gap-2 font-semibold text-white">
                <CheckCircle2 size={16} className="text-emerald-300" />
                Acceso seguro
              </p>
              <p className="break-words">
                Usa las credenciales asignadas por el administrador.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
