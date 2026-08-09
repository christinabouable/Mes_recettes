import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';

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
  const [recipe, setRecipe] = useState<RecipeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get(`/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(() => setError('Recette introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Chargement...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!recipe) return null;

  return (
    <div>
      <Link to="/" className="text-blue-600 text-sm hover:underline">← Retour aux recettes</Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            Pas d'image
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Par {recipe.author.username}
            {recipe.category && ` · ${recipe.category.name}`}
          </p>

          {recipe.description && <p className="mt-4 text-gray-700">{recipe.description}</p>}

          <div className="flex gap-6 mt-4 text-sm text-gray-600">
            {recipe.prepTime != null && <span>⏱️ Préparation : {recipe.prepTime} min</span>}
            {recipe.cookTime != null && <span>🔥 Cuisson : {recipe.cookTime} min</span>}
            {recipe.servings != null && <span>🍽️ {recipe.servings} portions</span>}
          </div>

          <h2 className="font-semibold text-lg mt-6 mb-2">Étapes</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}