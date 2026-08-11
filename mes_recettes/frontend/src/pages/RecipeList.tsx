import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

interface Recipe {
  id: string;
  title: string;
  imageUrl: string | null;
  category: { id: string; name: string } | null;
  author: { username: string };
}

interface Category {
  id: string;
  name: string;
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/recipes', { params: { search: search || undefined, categoryId: categoryId || undefined } })
      .then((res) => setRecipes(res.data))
      .finally(() => setLoading(false));
  }, [search, categoryId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Les recettes</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher une recette..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Chargement...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">Aucune recette ne correspond à ta recherche.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >
              {recipe.imageUrl ? (
                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                  Pas d'image
                </div>
              )}
              <div className="p-3">
                <p className="font-semibold">{recipe.title}</p>
                <p className="text-xs text-gray-500">par {recipe.author.username}</p>
                {recipe.category && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {recipe.category.name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}