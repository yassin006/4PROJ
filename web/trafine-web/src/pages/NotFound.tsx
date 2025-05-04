import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page introuvable</h1>
      <p className="text-gray-700 mb-6">Désolé, cette page n'existe pas.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
