import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { user, session } = useAuth();
  const cards = [
    ["profile", "Profile", "Update your name, email and bio."],
    ["security", "Security", "Change your password."],
    ["preferences", "Preferences", "Theme and notifications."],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name} 👋</h1>
        <p className="text-sm text-slate-500">
          Session expires at {new Date(session.expires).toLocaleTimeString()}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(([path, title, text]) => (
          <Link
            key={path}
            to={`/settings/${path}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
