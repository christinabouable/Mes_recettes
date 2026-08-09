import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg text-blue-600">🍲 Recipe App</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Bonjour {user.username}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:underline">Connexion</Link>
            <Link to="/register" className="text-sm hover:underline">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}