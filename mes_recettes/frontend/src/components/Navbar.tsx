import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-pink-100 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <Link to="/" className="font-heading text-2xl font-semibold text-pink-600 flex items-center gap-2">
        🍲 Mes recettes
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link
              to="/recipes/new"
              className="bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-pink-700 transition shadow-sm"
            >
              + Nouvelle recette
            </Link>
            <span className="text-sm text-pink-700/70 hidden sm:inline">Bonjour {user.username} 👋</span>
            <button onClick={logout} className="text-sm text-pink-700/70 hover:text-pink-600 transition">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-pink-600 hover:text-pink-500 transition">
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-pink-7000 transition shadow-sm"
            >
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}