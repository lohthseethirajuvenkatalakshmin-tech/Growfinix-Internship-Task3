import { createContext, useContext, useEffect, useState } from "react";

const SESSION_MS = 30 * 60 * 1000; // session lasts 30 minutes

const DEMO_ACCOUNT = {
  name: "s.v.l.n.lohith",
  email: "lohith@gmail.com",
  password: "Student@123", // demo only: never store plain passwords in real apps
  phone: "",
  bio: "4th year Computer Science Engineering student.",
  prefs: { theme: "light", emailNotif: true, pushNotif: false },
};

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};
const loadSession = () => {
  const s = read("session");
  return s && s.expires > Date.now() ? s : null;
};

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(() => read("account") || DEMO_ACCOUNT);
  const [session, setSession] = useState(loadSession);

  // Save account changes
  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(account));
  }, [account]);

  // Apply theme app-wide
  useEffect(() => {
    document.documentElement.classList.toggle("dark", account.prefs.theme === "dark");
  }, [account.prefs.theme]);

  // Auto sign-out when the session expires
  useEffect(() => {
    const timer = setInterval(() => setSession(loadSession()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Keep multiple browser tabs in sync (login/logout in one tab affects all)
  useEffect(() => {
    const sync = () => {
      setSession(loadSession());
      setAccount(read("account") || DEMO_ACCOUNT);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = (email, password) => {
    if (email.trim().toLowerCase() !== account.email.toLowerCase() || password !== account.password) {
      return "Invalid email or password.";
    }
    const s = { email: account.email, expires: Date.now() + SESSION_MS };
    localStorage.setItem("session", JSON.stringify(s));
    setSession(s);
    return null;
  };

  const logout = () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  const updateAccount = (patch) => setAccount((a) => ({ ...a, ...patch }));
  const updatePrefs = (patch) =>
    setAccount((a) => ({ ...a, prefs: { ...a.prefs, ...patch } }));

  return (
    <AuthContext.Provider
      value={{ user: session ? account : null, session, login, logout, updateAccount, updatePrefs }}
    >
      {children}
    </AuthContext.Provider>
  );
}