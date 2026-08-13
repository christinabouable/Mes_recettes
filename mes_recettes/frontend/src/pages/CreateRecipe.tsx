import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
  apiClient.get('/categories').then((res) => setCategories(res.data));
  }, []);
  
  function updateStep(index: number, value: string) {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  }

  function addStep() {
    setSteps([...steps, '']);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const filledSteps = steps.filter((s) => s.trim() !== '');
    if (!title.trim() || filledSteps.length === 0) {
      setError('Le titre et au moins une étape sont requis');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('steps', JSON.stringify(filledSteps));
      if (prepTime) formData.append('prepTime', prepTime);
      if (cookTime) formData.append('cookTime', cookTime);
      if (servings) formData.append('servings', servings);
      if (image) formData.append('image', image);
if (categoryId) formData.append('categoryId', categoryId);

      const { data } = await apiClient.post('/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/recipes/${data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouvelle recette</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm flex flex-col gap-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full"
            rows={3}
          />
        </div>

        <div>
         <label className="block text-sm font-medium mb-1">Catégorie</label>
         <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border rounded p-2 w-full"
         >
          <option value="">Aucune catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
           ))}
         </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Prépa (min)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="border rounded p-2 w-full"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cuisson (min)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="border rounded p-2 w-full"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Portions</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="border rounded p-2 w-full"
              min={1}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Étapes</label>
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-2 text-sm text-gray-500 w-5">{i + 1}.</span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  className="border rounded p-2 flex-1"
                  placeholder={`Étape ${i + 1}`}
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="text-red-600 px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-2 text-sm text-pink-700/70 hidden sm:inline"
          >
            + Ajouter une étape
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-pink-600 text-white rounded p-2 font-semibold hover:bg-pink-700 transition shadow-sm"
        >
          {submitting ? 'Création...' : 'Créer la recette'}
        </button>
      </form>
    </div>
  );
}