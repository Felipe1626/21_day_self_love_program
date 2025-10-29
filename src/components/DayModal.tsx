// src/components/DayModal.tsx
import React, { useState, useEffect, useCallback } from 'react';

// --- TYPE DEFINITIONS ---

// 1. Define the shape of the content passed for each day
interface DayContent {
    title: string;
    morning: string;
    activities: string[];
}

// 2. Define the shape of the PROPS received by the component
interface DayModalProps {
    dayIndex: number;
    // Function to retrieve a specific field's value (must be capable of returning string or string[])
    getDayField: (dayIndex: number, field: string) => string | string[]; 
    // Function to save data (matches the signature in useProgress)
    saveProgress: (dayIndex: number, field: string, value: string, activityIndex?: number | null) => Promise<void>;
    onClose: () => void; // Function to close the modal
}

// Simplified Data Structure (You'd need the full data list here)
const dailyContent: DayContent[] = [
    { title: 'Día 1: Mi Bienvenida', morning: 'Afirma tu presencia...', activities: ['Actividad de Hoy: Escribir una carta.'] },
    // ... all 21 days
];

// Placeholder for Tailwind dynamic classes (ensure these are configured in your Tailwind setup)
const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-indigo focus:border-primary-indigo mt-2 resize-none action-button-style min-h-[100px]";


// --- COMPONENT DEFINITION ---

const DayModal: React.FC<DayModalProps> = ({ dayIndex, getDayField, saveProgress, onClose }) => {
    const dayNumber = dayIndex + 1;
    const content: DayContent = dailyContent[dayIndex] || { 
        title: `Día ${dayNumber}: Contenido no definido`, 
        morning: 'Contenido no disponible.', 
        activities: [] 
    };

    // Local state for controlled inputs
    const [morningAffirmation, setMorningAffirmation] = useState<string>('');
    const [morningIntention, setMorningIntention] = useState<string>('');
    const [nightGratitude, setNightGratitude] = useState<string>('');
    // State must be typed as an array of strings
    const [dayActivities, setDayActivities] = useState<string[]>([]); 

    // Load data when the modal opens or dayIndex changes
    useEffect(() => {
        // We must assert the return type from getDayField because it returns a union type
        setMorningAffirmation(getDayField(dayIndex, 'morningAffirmation') as string);
        setMorningIntention(getDayField(dayIndex, 'morningIntention') as string);
        setNightGratitude(getDayField(dayIndex, 'nightGratitude') as string);
        setDayActivities(getDayField(dayIndex, 'dayActivities') as string[]);
    }, [dayIndex, getDayField]);

    // Handler for activity array input (Memoized for performance/stability)
    const handleActivityChange = useCallback((index: number, value: string) => {
        // 1. Update local state immutably
        setDayActivities(prevActivities => {
            const newActivities = [...prevActivities];
            newActivities[index] = value;
            return newActivities;
        });
        
        // 2. Save immediately to the database
        // Use the index as the fourth argument for array saving
        saveProgress(dayIndex, 'dayActivities', value, index); 
        
    }, [dayIndex, saveProgress]);


    // Handler for affirmation/intention/gratitude onBlur events
    // This is useful because we want to save data only when the user is done typing in a field.
    const handleSaveField = (field: string, value: string) => {
        // This saveProgress call doesn't need the activityIndex argument
        saveProgress(dayIndex, field, value);
    }
    
    // --- JSX RENDER ---
    
    return (
        <div 
            id="dayContentModal" 
            className="fixed inset-0 bg-black bg-opacity-50 flex modal-overlay items-center justify-center p-4 z-50" 
            onClick={onClose}
        >
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                
                <h2 className="text-3xl font-bold text-primary-indigo mb-4">{content.title}</h2>
                <div className="text-gray-700 leading-relaxed space-y-4 mb-8">
                    
                    {/* Morning Affirmation */}
                    <div className="p-3 bg-morning-card rounded-lg shadow-md">
                        <h3 className="font-bold text-lg text-yellow-800">Afirmación Matutina:</h3>
                        <p className="text-sm italic mb-2">{content.morning}</p>
                        <textarea
                            className={inputStyle}
                            placeholder="Escribe tu afirmación de la mañana aquí..."
                            value={morningAffirmation}
                            onChange={(e) => setMorningAffirmation(e.target.value)}
                            onBlur={() => handleSaveField('morningAffirmation', morningAffirmation)}
                        />
                    </div>

                    {/* Day Intention */}
                    <div className="p-3 bg-day-card rounded-lg shadow-md">
                        <h3 className="font-bold text-lg text-primary-indigo">Intención del Día:</h3>
                        <textarea
                            className={inputStyle}
                            placeholder="¿Cuál es tu intención para hoy? ¿Qué quieres sentir?"
                            value={morningIntention}
                            onChange={(e) => setMorningIntention(e.target.value)}
                            onBlur={() => handleSaveField('morningIntention', morningIntention)}
                        />
                    </div>
                    
                    {/* Daily Activities (Dynamic from content) */}
                    {content.activities.map((activityText, index) => (
                        <div key={index} className="p-3 bg-indigo-50 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg text-primary-indigo">Tarea {index + 1}: {activityText}</h3>
                            <textarea
                                className={inputStyle}
                                placeholder="Tus reflexiones o notas sobre esta actividad..."
                                // Use local state value or default to empty string
                                value={dayActivities[index] || ''} 
                                onChange={(e) => handleActivityChange(index, e.target.value)}
                                // We don't need a separate onBlur here, as handleActivityChange saves immediately
                                // on every change for simplicity, or you could change it to save only on blur.
                            />
                        </div>
                    ))}
                    
                    {/* Night Gratitude */}
                    <div className="p-3 bg-night-card rounded-lg shadow-md">
                        <h3 className="font-bold text-lg text-blue-800">Gratitud Nocturna:</h3>
                        <textarea
                            className={inputStyle}
                            placeholder="3 cosas por las que estás agradecida hoy..."
                            value={nightGratitude}
                            onChange={(e) => setNightGratitude(e.target.value)}
                            onBlur={() => handleSaveField('nightGratitude', nightGratitude)}
                        />
                    </div>

                </div>

                <button 
                    onClick={onClose} 
                    className="mt-6 w-full py-3 bg-primary-indigo text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
                >
                    Cerrar y Guardar
                </button>
            </div>
        </div>
    );
};

export default DayModal;