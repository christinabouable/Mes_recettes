import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiClient.get(`/recipes/${id}`)
      .then((res) => {
        const r = res.data;
        setTitle(r.title);
        setDescription(r.description || '');
        setSteps(r.steps.length > 0 ? r.steps : ['']);
        setPrepTime(r.prepTime?.toString() || '');
        setCookTime(r.cookTime?.toString() || '');
        setServings(r.servings?.toString() || '');
      })
      .catch(() => setError('Impossible de charger la recette'))
      .finally(() => setLoading(false));
  }, [id]);

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
      await apiClient.put(`/recipes/${id}`, {
        title,
        description,
        steps: filledSteps,
        prepTime: prepTime ? parseInt(prepTime, 10) : null,
        cookTime: cookTime ? parseInt(cookTime, 10) : null,
        servings: servings ? parseInt(servings, 10) : null,
      });

      navigate(`/recipes/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la modification');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center text-gray-500 mt-10">Chargement...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier la recette</h1>

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
                  <button type="button" onClick={() => removeStep(i)} className="text-red-600 px-2">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addStep} className="mt-2 text-sm text-blue-600 hover:underline">
            + Ajouter une étape
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? 'Modification...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}