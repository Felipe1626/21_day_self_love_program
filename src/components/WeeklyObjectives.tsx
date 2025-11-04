import React from 'react';

const WeeklyObjectives: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-lg border-t-4 border-week-focus">
      <h2 className="text-xl font-extrabold text-week-focus mb-3">Objetivos por Semana</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
          <span className="text-xs font-semibold text-gray-600 block">Semana 1 (Días 1-7)</span>
          <span className="font-bold text-sm text-primary-indigo">Bienvenida y Gratitud</span>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
          <span className="text-xs font-semibold text-gray-600 block">Semana 2 (Días 8-14)</span>
          <span className="font-bold text-sm text-primary-indigo">Energía y Movimiento</span>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
          <span className="text-xs font-semibold text-gray-600 block">Semana 3 (Días 15-21)</span>
          <span className="font-bold text-sm text-primary-indigo">Transformación y Sostenibilidad</span>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hidden md:block opacity-0">
          <span className="text-xs font-semibold text-gray-600 block">Semana 4</span>
          <span className="font-bold text-sm text-primary-indigo">Cierre</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm font-bold text-week-focus">¡Nota!</span> 
        <span className="text-sm text-gray-700"> El Día 21 es la celebración del proceso.</span>
      </div>
    </div>
  );
};

export default WeeklyObjectives;