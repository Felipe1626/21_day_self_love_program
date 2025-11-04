import React from 'react';

interface DayButtonProps {
  dayNumber: number;
  onClick: () => void;
}

const DayButton: React.FC<DayButtonProps> = ({ dayNumber, onClick }) => {
  let weekGoal = 'Días 1-7';
  let weekColor = 'bg-day-card';
  
  if (dayNumber >= 8 && dayNumber <= 14) {
    weekGoal = 'Días 8-14';
    weekColor = 'bg-purple-200';
  } else if (dayNumber >= 15 && dayNumber <= 21) {
    weekGoal = 'Días 15-21';
    weekColor = 'bg-purple-300';
  }

  return (
    <div
      onClick={onClick}
      className={`day-button ${weekColor} text-primary-indigo rounded-lg text-2xl hover:bg-indigo-300 transition duration-150 cursor-pointer relative`}
    >
      <span className="text-3xl">{dayNumber}</span>
      <span className="absolute top-1 left-2 text-xs font-light text-gray-500">{weekGoal}</span>
    </div>
  );
};

export default DayButton;