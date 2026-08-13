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
      <div className="text-center mb-8">
        <h1 className="font-heading text-4xl font-semibold text-gray-800">Qu'est-ce qu'on cuisine ? 🍳</h1>
        <p className="text-gray-500 mt-2">Découvre et partage tes meilleures recettes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="🔍 Rechercher une recette..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-transparent bg-white rounded-full px-5 py-2.5 flex-1 shadow-sm focus:border-primary focus:outline-none transition"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border-2 border-transparent bg-white rounded-full px-5 py-2.5 shadow-sm focus:border-primary focus:outline-none transition"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 mt-10">Chargement des recettes...</p>
      ) : recipes.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-5xl mb-4">🥘</p>
          <p className="text-gray-500">Aucune recette ne correspond à ta recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-40 bg-secondary-light flex items-center justify-center text-4xl">
                  🍽️
                </div>
              )}
              <div className="p-4">
                <p className="font-heading font-medium text-gray-800">{recipe.title}</p>
                <p className="text-xs text-gray-400 mt-1">par {recipe.author.username}</p>
                {recipe.category && (
                  <span className="inline-block mt-2 text-xs font-semibold bg-accent/20 text-accent-dark px-2.5 py-1 rounded-full">
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