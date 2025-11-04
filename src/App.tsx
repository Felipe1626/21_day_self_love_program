import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DayButton from './components/DayButton';
import DayModal from './components/DayModal';
import CrisisModal from './components/CrisisModal';
import { useFirebase } from './hooks/useFirebase';
import { useProgress } from './hooks/useProgress';
import { dailyContent } from './constants/dailyContent';
import { countActiveDays, downloadProgress } from './services/progressService';
import { type DayProgress } from './types';

const App: React.FC = () => {
  const { db, userId, appId, isAuthReady } = useFirebase();
  const { saveProgress, loadProgress, toast, showToast } = useProgress(db, appId, userId, isAuthReady);
  
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [dayProgress, setDayProgress] = useState<DayProgress>({});
  const [activeDaysCount, setActiveDaysCount] = useState(0);

  // Load active days count
  useEffect(() => {
    const loadActiveDays = async () => {
      if (!db || !userId || !appId || !isAuthReady) return;
      const count = await countActiveDays(db, appId, userId);
      setActiveDaysCount(count);
    };

    loadActiveDays();
  }, [db, userId, appId, isAuthReady, selectedDayIndex]);

  // Load day progress when modal opens
  useEffect(() => {
    const loadDayData = async () => {
      if (selectedDayIndex === null) return;
      const progress = await loadProgress(selectedDayIndex);
      setDayProgress(progress);
    };

    loadDayData();
  }, [selectedDayIndex, loadProgress]);

  const handleSaveProgress = async (field: string, value: string, activityIndex: number | null) => {
    if (selectedDayIndex === null) return;
    await saveProgress(selectedDayIndex, field, value, activityIndex);
    
    // Update local state
    if (field === 'dayActivities' && activityIndex !== null) {
      const activities = [...(dayProgress.dayActivities || [])];
      activities[activityIndex] = value;
      setDayProgress({ ...dayProgress, dayActivities: activities });
    } else {
      setDayProgress({ ...dayProgress, [field]: value });
    }
  };

  const handleDownload = async () => {
    if (!db || !userId || !appId) {
      showToast('Error de autenticación, no se puede descargar.');
      return;
    }
    
    const success = await downloadProgress(db, appId, userId, dailyContent);
    if (success) {
      showToast('Descarga completada.', 1500);
    } else {
      showToast('Error al procesar la descarga de datos.', 3000);
    }
  };

  const handleCloseDayModal = () => {
    setSelectedDayIndex(null);
    setDayProgress({});
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-indigo"></div>
          <p className="mt-4 text-primary-indigo font-semibold">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg font-sans min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Header onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />

        {/* Day Grid */}
        <main className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-2xl">
          {dailyContent.map((_, index) => (
            <DayButton
              key={index}
              dayNumber={index + 1}
              onClick={() => setSelectedDayIndex(index)}
            />
          ))}
        </main>
      </div>

      {/* Modals */}
      {selectedDayIndex !== null && (
        <DayModal
          dayIndex={selectedDayIndex}
          onClose={handleCloseDayModal}
          initialProgress={dayProgress}
          onSave={handleSaveProgress}
          onDownload={handleDownload}
          activeDaysCount={activeDaysCount}
          showToast={showToast}
        />
      )}

      {isCrisisModalOpen && (
        <CrisisModal onClose={() => setIsCrisisModalOpen(false)} />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl z-50 transition duration-300 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;

// import { useState } from 'react';
// import { useProgress } from './hooks/useProgress'; // Assuming type safety is added here 
// import DayButton from "./components/DayButton";
//  import DayModal from './components/DayModal';
// import CrisisModal from './components/CrisisModal'; 
// // Ensure your Tailwind CSS is imported/configured for these classes to work

// // Define a type for a single day's progress data (for better type safety)
// interface DayProgress {
//     morningAffirmation?: string;
//     morningIntention?: string;
//     nightGratitude?: string;
//     dayActivities?: string[];
//     // Add other fields as necessary
// }

// // Define the shape of the main progress object stored in the hook
// interface ProgressData {
//     [dayId: string]: DayProgress; // e.g., 'day-1': { ... }
// }


// // IMPORTANT: Define a check for completion based on progress data
// const isDayCompleted = (progress: ProgressData, dayNumber: number) => {
//     const dayId = `day-${dayNumber}`;
//     const data = progress[dayId];
//     if (!data) return false;
    
//     // Considered complete if at least one key field is filled
//     return (
      
//         data.morningAffirmation?.trim() !== '' ||
//         data.morningIntention?.trim() !== '' ||
//         data.nightGratitude?.trim() !== '' ||
//         data.dayActivities?.some(a => a && a.trim() !== '')
//     );
// };

// export default function App() {
//     // Assuming useProgress is typed to return: { isLoading: boolean, progressData: ProgressData, ... }
//     const { 
//         isLoading, 
//         progressData, 
//         saveProgress, // Function to save data
//         getDayField,  // Function to retrieve specific field data
//         //activeDaysCount 
//     } = useProgress(); 
    
//     // State to control which day's modal is open (using null for closed)
//     const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null); 
//     const [isCrisisModalOpen, setIsCrisisModalOpen] = useState<boolean>(false);
    
//     // Array representing days 1 through 21
//     const daysArray: number[] = Array.from({ length: 21 }, (_, i) => i + 1); 

//     if (isLoading) {
//         return <div className="text-center p-10 text-xl text-primary-indigo">Cargando la conexión y el progreso...</div>;
//     }

//     return (
//         <div className="bg-light-bg font-sans min-h-screen">
//             <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
//                 {/* Título principal */}
//                 <header className="text-center mb-6 mt-4">
//                     <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-indigo tracking-tight">
//                     Programa de 21 Días Amor Propio
//                     </h1>
//                     <p className="mt-3 text-xl text-gray-600">
//                     Tu camino hacia la transformación y el bienestar.
//                     </p>
                    
//                     {/* NUEVO: OBJETIVOS SEMANALES (Añadido aquí) */}
//                     <div className="mt-6 p-4 bg-white rounded-xl shadow-lg border-t-4 border-week-focus">
//                     <h2 className="text-xl font-extrabold text-week-focus mb-3">Objetivos por Semana</h2>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
//                         <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
//                         <span className="text-xs font-semibold text-gray-600 block">Semana 1 (Días 1-7)</span>
//                         <span className="font-bold text-sm text-primary-indigo">Bienvenida y Gratitud</span>
//                         </div>
//                         <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
//                         <span className="text-xs font-semibold text-gray-600 block">Semana 2 (Días 8-14)</span>
//                         <span className="font-bold text-sm text-primary-indigo">Energía y Movimiento</span>
//                         </div>
//                         <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
//                         <span className="text-xs font-semibold text-gray-600 block">Semana 3 (Días 15-21)</span>
//                         <span className="font-bold text-sm text-primary-indigo">Transformación y Sostenibilidad</span>
//                         </div>
//                         {/* Adaptado a 3 semanas (21 días) */}
//                         <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hidden md:block opacity-0">
//                         <span className="text-xs font-semibold text-gray-600 block">Semana 4</span>
//                         <span className="font-bold text-sm text-primary-indigo">Cierre</span>
//                         </div>
//                     </div>
//                     <div className="mt-4 text-center">
//                         <span className="text-sm font-bold text-week-focus">¡Nota!</span> 
//                         <span className="text-sm text-gray-700">El Día 21 es la celebración del proceso.</span>
//                     </div>
//                     </div>

//                     {/* CONTENEDOR DE BOTONES DE ENCABEZADO */}
//                     <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    
//                     {/* BOTÓN AÑADIDO: Información sobre Fibromialgia */}
//                     <a 
//                         href="https://fibroytransformacion.wixsite.com/fibromialgia/blog" 
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="action-button-style px-4 py-2 bg-info-gray text-white font-extrabold rounded-full hover:bg-gray-500 transition duration-200 shadow-lg border-b-4 border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 text-base sm:text-lg flex items-center justify-center"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
//                         </svg>
//                         Más Información sobre Fibromialgia
//                     </a>

//                     {/* BOTÓN: Plan de Rescate (Mantiene el tamaño reducido del paso anterior) */}
//                     <button 
//                         onClick={() => setIsCrisisModalOpen(true)}
//                         className="action-button-style px-4 py-2 bg-rescue-red text-white font-extrabold rounded-full hover:bg-red-700 transition duration-200 shadow-lg border-b-4 border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-base sm:text-lg flex items-center justify-center"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M11.953 2C6.465 2 2 6.48 2 12s4.465 10 9.953 10c5.487 0 9.953-4.48 9.953-10S17.44 2 11.953 2zm-.99 15h1.98v-1.98h-1.98V17zm.058-2.973h.007c.552 0 .992-.44.992-.992v-4.004c0-.552-.44-.992-.992-.992h-.007c-.552 0-.992.44-.992.992v4.004c0 .552.44.992.992.992z"/>
//                         </svg>
//                         PLAN DE RESCATE (Crisis de Dolor)
//                     </button>
                    
//                     </div>
                    
//                 </header>

//                 {/* Day Grid */}
//                 <main className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-2xl">
//                     {daysArray.map((dayNumber) => (
//                         <DayButton
//                             key={dayNumber}
//                             dayNumber={dayNumber}
//                             isCompleted={isDayCompleted(progressData, dayNumber)}
//                             onClick={() => setSelectedDayIndex(dayNumber - 1)}
//                         />
//                     ))}
//                 </main>
//             </div>

//             {/* Modals */}
//             {selectedDayIndex !== null && (
//                 <DayModal
//                     // Pass the index (0-20)
//                     dayIndex={selectedDayIndex}
//                     // Pass the functions from the hook
//                     getDayField={getDayField}
//                     saveProgress={saveProgress}
//                     onClose={() => setSelectedDayIndex(null)}
//                 />
//             )}

//              {isCrisisModalOpen && (
//                 <CrisisModal onClose={() => setIsCrisisModalOpen(false)} />
//             )} 
//         </div>
//     );
// }