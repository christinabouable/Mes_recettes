import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

interface RecipeDetailData {
  id: string;
  title: string;
  description: string | null;
  steps: string[];
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  imageUrl: string | null;
  author: { id: string; username: string };
  category: { name: string } | null;
}

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<RecipeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    apiClient.get(`/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(() => setError('Recette introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Supprimer cette recette ? Cette action est irréversible.')) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/recipes/${id}`);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression');
      setDeleting(false);
    }
  }

  if (loading) return <p className="text-center text-gray-400 mt-10">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!recipe) return null;

  const isAuthor = user?.id === recipe.author.id;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Link to="/" className="text-secondary-dark text-sm font-medium hover:underline">← Retour aux recettes</Link>

        {isAuthor && (
          <div className="flex gap-2">
            <Link
              to={`/recipes/${recipe.id}/edit`}
              className="text-sm font-semibold bg-secondary-light text-secondary-dark px-3 py-1.5 rounded-full hover:bg-secondary/20 transition"
            >
              ✏️ Modifier
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm font-semibold bg-red-50 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-100 transition disabled:opacity-50"
            >
              {deleting ? 'Suppression...' : '🗑️ Supprimer'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-72 object-cover" />
        ) : (
          <div className="w-full h-72 bg-secondary-light flex items-center justify-center text-6xl">
            🍽️
          </div>
        )}

        <div className="p-8">
          <h1 className="font-heading text-3xl font-semibold text-gray-800">{recipe.title}</h1>
          <p className="text-sm text-gray-400 mt-2">
            Par <span className="font-medium text-gray-600">{recipe.author.username}</span>
            {recipe.category && (
              <span className="ml-2 text-xs font-semibold bg-accent/20 text-accent-dark px-2.5 py-1 rounded-full">
                {recipe.category.name}
              </span>
            )}
          </p>

          {recipe.description && <p className="mt-4 text-gray-600 leading-relaxed">{recipe.description}</p>}

          <div className="flex gap-4 mt-5">
            {recipe.prepTime != null && (
              <div className="bg-cream rounded-xl px-4 py-2 text-sm text-gray-600">⏱️ Prépa : <span className="font-semibold">{recipe.prepTime} min</span></div>
            )}
            {recipe.cookTime != null && (
              <div className="bg-cream rounded-xl px-4 py-2 text-sm text-gray-600">🔥 Cuisson : <span className="font-semibold">{recipe.cookTime} min</span></div>
            )}
            {recipe.servings != null && (
              <div className="bg-cream rounded-xl px-4 py-2 text-sm text-gray-600">🍽️ <span className="font-semibold">{recipe.servings} portions</span></div>
            )}
          </div>

          <h2 className="font-heading text-xl font-medium mt-8 mb-3 text-gray-800">Étapes</h2>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}