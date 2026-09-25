import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabase/supabase.js';
import Auth from './components/Auth';
import Layout from './components/Layout';
import TablaMesas from './components/TablaMesas';
import Electores from './components/Electores';
import { Toaster } from 'sonner';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-medium">Cargando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      {!session ? (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout session={session} />}>
            {/* Rutas Hijas del Layout */}
            <Route index element={<TablaMesas clvId={session.user.id} />} />
            <Route path="electores" element={<Electores authUserId={session.user.id} />} />
            {/* Cualquier otra ruta redirige al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
