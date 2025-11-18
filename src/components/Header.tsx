import React from 'react';
import WeeklyObjectives from './WeeklyObjectives';

interface HeaderProps {
  onOpenCrisisModal: () => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenCrisisModal, userName }) => {
  return (
    <header className="text-center mb-6 mt-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-indigo tracking-tight">
        Programa de 21 Días Amor Propio
      </h1>
      {userName && (
        <p className="mt-2 text-2xl font-semibold text-purple-600">
          ¡Bienvenida, {userName}! 💜
        </p>
      )}
      <p className="mt-3 text-xl text-gray-600">
        Tu camino hacia la transformación y el bienestar.
      </p>
      
      <WeeklyObjectives />

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <a 
          href="https://fibroytransformacion.wixsite.com/fibromialgia/blog" 
          target="_blank"
          rel="noopener noreferrer"
          className="action-button-style px-4 py-2 bg-violet-300 text-white font-extrabold rounded-full hover:bg-violet-500 transition duration-200 shadow-lg border-b-4 border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50 text-base sm:text-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
          </svg>
          Más Información sobre Fibromialgia
        </a>

        <button 
          onClick={onOpenCrisisModal}
          className="action-button-style px-4 py-2 bg-rescue-red text-white font-extrabold rounded-full hover:bg-red-700 transition duration-200 shadow-lg border-b-4 border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-base sm:text-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.953 2C6.465 2 2 6.48 2 12s4.465 10 9.953 10c5.487 0 9.953-4.48 9.953-10S17.44 2 11.953 2zm-.99 15h1.98v-1.98h-1.98V17zm.058-2.973h.007c.552 0 .992-.44.992-.992v-4.004c0-.552-.44-.992-.992-.992h-.007c-.552 0-.992.44-.992.992v4.004c0 .552.44.992.992.992z"/>
          </svg>
          PLAN DE RESCATE (Crisis de Dolor)
        </button>
      </div>
    </header>
  );
};

export default Header;