import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900";
const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800";
const btn = "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 active:scale-95";

/* ---------- Layout with tabs ---------- */
export function Settings() {
  const tab = ({ isActive }) =>
    `-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
      isActive ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
    }`;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <nav className="mb-6 flex border-b border-slate-200 dark:border-slate-800">
        <NavLink to="profile" className={tab}>Profile</NavLink>
        <NavLink to="security" className={tab}>Security</NavLink>
        <NavLink to="preferences" className={tab}>Preferences</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

/* ---------- Profile tab ---------- */
export function Profile() {
  const { user, updateAccount } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, bio: user.bio });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setMsg({ ok: false, text: "Name must be at least 2 characters." });
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setMsg({ ok: false, text: "Enter a valid email." });
    updateAccount(form);
    setMsg({ ok: true, text: "Profile updated." });
  };

  return (
    <form onSubmit={save} className={`${card} space-y-4`}>
      {msg && (
        <p className={`rounded-lg p-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Full name<input className={input} value={form.name} onChange={set("name")} /></label>
        <label className="text-sm">Email<input className={input} value={form.email} onChange={set("email")} /></label>
      </div>
      <label className="block text-sm">Phone<input className={input} value={form.phone} onChange={set("phone")} /></label>
      <label className="block text-sm">Bio<textarea rows={3} className={input} value={form.bio} onChange={set("bio")} /></label>
      <button className={btn}>Save changes</button>
    </form>
  );
}

/* ---------- Security tab ---------- */
export function Security() {
  const { user, updateAccount } = useAuth();
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setPw({ ...pw, [k]: e.target.value });

  const change = (e) => {
    e.preventDefault();
    if (pw.current !== user.password) return setMsg({ ok: false, text: "Current password is incorrect." });
    if (pw.next.length < 8 || !/[A-Z]/.test(pw.next) || !/\d/.test(pw.next))
      return setMsg({ ok: false, text: "Use 8+ characters with an uppercase letter and a number." });
    if (pw.next !== pw.confirm) return setMsg({ ok: false, text: "Passwords don't match." });
    updateAccount({ password: pw.next });
    setPw({ current: "", next: "", confirm: "" });
    setMsg({ ok: true, text: "Password changed." });
  };

  return (
    <form onSubmit={change} className={`${card} max-w-md space-y-4`}>
      <h2 className="text-lg font-semibold">Change password</h2>
      {msg && (
        <p className={`rounded-lg p-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}
      <label className="block text-sm">Current password<input type="password" className={input} value={pw.current} onChange={set("current")} /></label>
      <label className="block text-sm">New password<input type="password" className={input} value={pw.next} onChange={set("next")} /></label>
      <label className="block text-sm">Confirm new password<input type="password" className={input} value={pw.confirm} onChange={set("confirm")} /></label>
      <button className={btn}>Update password</button>
    </form>
  );
}

/* ---------- Preferences tab ---------- */
function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

export function Preferences() {
  const { user, updatePrefs } = useAuth();
  const { prefs } = user;

  return (
    <div className={`${card} max-w-md`}>
      <h2 className="text-lg font-semibold">Preferences</h2>
      <div className="mt-2 divide-y divide-slate-200 dark:divide-slate-800">
        <Toggle label="Dark mode" checked={prefs.theme === "dark"} onChange={(v) => updatePrefs({ theme: v ? "dark" : "light" })} />
        <Toggle label="Email notifications" checked={prefs.emailNotif} onChange={(v) => updatePrefs({ emailNotif: v })} />
        <Toggle label="Push notifications" checked={prefs.pushNotif} onChange={(v) => updatePrefs({ pushNotif: v })} />
      </div>
    </div>
  );
}