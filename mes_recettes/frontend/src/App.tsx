import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RecipeList from './pages/RecipeList';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </main>
    </div>
  );
}