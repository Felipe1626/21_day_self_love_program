import React, { useState } from 'react';

interface WelcomeModalProps {
  onSubmit: (name: string) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary-indigo" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-primary-indigo mb-2">
            ¡Bienvenida!
          </h2>
          <p className="text-gray-600 mb-6">
            Antes de comenzar tu viaje de transformación de 21 días, cuéntanos tu nombre para hacer esta experiencia más personal.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Tu nombre:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre aquí..."
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-primary-indigo focus:ring-2 focus:ring-primary-indigo focus:outline-none transition duration-200"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-primary-indigo text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comenzar mi Transformación
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Tu nombre se guardará de forma segura y solo se usará para personalizar tu experiencia.
        </p>
      </div>
    </div>
  );
};

export default WelcomeModal;