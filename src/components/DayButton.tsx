import React from 'react';

// 1. Define the TypeScript interface for props
interface DayButtonProps {
    dayNumber: number; // Must be a number
    isCompleted: boolean | undefined; // Must be a boolean
    onClick: (dayIndex: number) => void; // Must be a function
}

// 2. Use React.FC and the interface for the component definition
//isCompleted
const DayButton: React.FC<DayButtonProps> = ({ dayNumber, onClick }) => {
    
    // ... rest of your styling logic ...
    const dayIndex = dayNumber - 1; 
    
    // ...
    
    return (
        <button
            onClick={() => onClick(dayIndex)} 
            // ... className ...
        >
            <span className="text-xl sm:text-2xl lg:text-3xl">Día {dayNumber}</span>
        </button>
    );
};

export default DayButton;