import { useNavigate, Link, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItem = (to, label) => {
    const active = location.pathname === to
    return (
      <Link to={to} className={`text-sm px-3 py-1 rounded ${active ? 'bg-white text-indigo-600' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
        {label}
      </Link>
    )
  }

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center">

      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">DevInsight AI</h1>
        {navItem('/dashboard', 'Dashboard')}
        {navItem('/history', 'History')}
        {navItem('/dashboard-v2', 'Dashboard V2')}
        {navItem('/history-v2', 'History V2')}
      </div>

      <div>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </div>

    </nav>
  );
}

export default Navbar;