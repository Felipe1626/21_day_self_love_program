import React, { useState } from 'react';
import { useProgress } from './hooks/useProgress'; // Assuming type safety is added here 
import DayButton from "./components/DayButton";
 import DayModal from './components/DayModal';
//import CrisisModal from './components/CrisisModal'; 
// Ensure your Tailwind CSS is imported/configured for these classes to work

// Define a type for a single day's progress data (for better type safety)
interface DayProgress {
    morningAffirmation?: string;
    morningIntention?: string;
    nightGratitude?: string;
    dayActivities?: string[];
    // Add other fields as necessary
}

// Define the shape of the main progress object stored in the hook
interface ProgressData {
    [dayId: string]: DayProgress; // e.g., 'day-1': { ... }
}


// IMPORTANT: Define a check for completion based on progress data
const isDayCompleted = (progress: ProgressData, dayNumber: number) => {
    const dayId = `day-${dayNumber}`;
    const data = progress[dayId];
    if (!data) return false;
    
    // Considered complete if at least one key field is filled
    return (
      
        data.morningAffirmation?.trim() !== '' ||
        data.morningIntention?.trim() !== '' ||
        data.nightGratitude?.trim() !== '' ||
        data.dayActivities?.some(a => a && a.trim() !== '')
    );
};

export default function App() {
    // Assuming useProgress is typed to return: { isLoading: boolean, progressData: ProgressData, ... }
    const { 
        isLoading, 
        progressData, 
        saveProgress, // Function to save data
        getDayField,  // Function to retrieve specific field data
        //activeDaysCount 
    } = useProgress(); 
    
    // State to control which day's modal is open (using null for closed)
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null); 
    const [/*isCrisisModalOpen*/, setIsCrisisModalOpen] = useState<boolean>(false);
    
    // Array representing days 1 through 21
    const daysArray: number[] = Array.from({ length: 21 }, (_, i) => i + 1); 

    if (isLoading) {
        return <div className="text-center p-10 text-xl text-primary-indigo">Cargando la conexión y el progreso...</div>;
    }

    return (
        <div className="bg-light-bg font-sans min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* Header Section */}
                <header className="text-center mb-6 mt-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-indigo tracking-tight">
                        Programa de 21 Días Amor Propio
                    </h1>
                    <p className="mt-3 text-xl text-gray-600">Tu camino hacia la transformación.</p>
                    
                    {/* Simplified Header Buttons (Matching the original HTML structure) */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <a href="https://fibroytransformacion.wixsite.com/fibromialgia/blog" target="_blank"
                            className="action-button-style px-4 py-2 bg-info-gray text-white font-extrabold rounded-full transition duration-200 shadow-lg"
                        >
                            Más Información sobre Fibromialgia
                        </a>
                        <button 
                            onClick={() => setIsCrisisModalOpen(true)}
                            className="action-button-style px-4 py-2 bg-rescue-red text-white font-extrabold rounded-full transition duration-200 shadow-lg"
                        >
                            PLAN DE RESCATE (Crisis de Dolor)
                        </button>
                    </div>
                </header>

                {/* Day Grid */}
                <main className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-2xl">
                    {daysArray.map((dayNumber) => (
                        <DayButton
                            key={dayNumber}
                            dayNumber={dayNumber}
                            isCompleted={isDayCompleted(progressData, dayNumber)}
                            onClick={() => setSelectedDayIndex(dayNumber - 1)}
                        />
                    ))}
                </main>
            </div>

            {/* Modals */}
            {selectedDayIndex !== null && (
                <DayModal
                    // Pass the index (0-20)
                    dayIndex={selectedDayIndex}
                    // Pass the functions from the hook
                    getDayField={getDayField}
                    saveProgress={saveProgress}
                    onClose={() => setSelectedDayIndex(null)}
                />
            )}

            {/* {isCrisisModalOpen && (
                <CrisisModal onClose={() => setIsCrisisModalOpen(false)} />
            )} */}
        </div>
    );
}