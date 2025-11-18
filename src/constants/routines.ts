

export const BASE_NIGHT_RELAXATION = `
  <div class="p-4 rounded-xl shadow-md bg-night-card border-l-4 border-indigo-500">
    <h3 class="font-bold text-xl text-indigo-700 mb-3 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 20c-4.41 0-8-3.59-8-8 0-.91.15-1.79.41-2.61C6.2 12.18 8.92 14 12 14c3.08 0 5.8-1.82 7.59-4.61.26.82.41 1.7.41 2.61 0 4.41-3.59 8-8 8z"/>
      </svg>
      Rutina de Noche: Descanso Sagrado
    </h3>
    <p class="text-gray-700 mb-3 text-sm">Prepara tu cuerpo para el sueño reparador con esta meditación de respiración guiada:</p>
    <a href="https://youtu.be/l-Y3yUNlMyI?si=xfooZCkpEvdzL5Zj" target="_blank" 
       class="block w-full py-3 bg-indigo-200 text-indigo-800 font-semibold rounded-lg text-center text-sm hover:bg-indigo-300 transition shadow-inner">
      ▶️ Click aquí: Respiración Guiada Nocturna (YouTube)
    </a>
    <ul class="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm mt-3">
      <li><strong>Apagado Digital:</strong> Deja las pantallas 1 hora antes de dormir.</li>
      <li><strong>Revisión de Gratitud:</strong> Escribe o piensa en 3 cosas buenas que te pasaron.</li>
    </ul>
  </div>
`;
export const STRETCHING_BUTTON_HTML = `
  <div class="mt-6 mb-6">
    <a href="https://youtu.be/xAHqX0ZfLsA?si=6wxjVExoOeG2lORG" target="_blank"
       class="action-button-style block w-full text-center py-4 px-4 bg-emerald-500 text-white font-extrabold rounded-xl hover:bg-emerald-600 transition duration-200 shadow-xl border-b-4 border-emerald-700">
      <span class="text-xl leading-none">Ejercicios de Estiramiento</span>
      <span class="block mt-1 text-xs font-medium opacity-90">(Sugerencia: 3 veces por semana)</span>
    </a>
  </div>
`;
export const getMorningRoutineHtml = (dayIndex: number, morningPrompts: { affirmation: string; intentionSuggestion: string }[]) => {
  const dayPrompt = morningPrompts[dayIndex];
  if (!dayPrompt) return '';

  return `
    <div class="p-4 rounded-xl shadow-md bg-morning-card border-l-4 border-yellow-500">
      <h3 class="font-bold text-xl text-yellow-700 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 21h2v-2h-2v2zm0-4h2v-6h-2v6zm.94-11.45L12 3l.06.55c.34 2.89 2.5 5.3 5.39 5.64L21 9l-3.32 3.32c-.7.7-1.66 1.07-2.68 1.07H7.01c-.01 0-.02 0-.03 0L3 13l3.85-3.85c2.61-2.61 3.51-5.75 3.12-8.15z"/>
        </svg>
        Rutina de la Mañana: Intención y Luz
      </h3>
      
      <div class="mb-5">
        <p class="font-semibold text-gray-700">Meditación Guiada Matutina:</p>
        <a href="https://youtu.be/tmR2zBgaoSM?si=6wxjVExoOeG2lORG" target="_blank"
            class="text-blue-600 hover:text-blue-800 underline block mt-1 font-medium">
          ▶️ Click aquí: Respiración Matutina (YouTube)
        </a>
      </div>

      <div class="mb-5">
        <p class="font-semibold text-gray-700">Afirmación:</p>
        <p class="text-sm italic text-gray-600">Sugerencia para el Día ${dayIndex + 1}: "${dayPrompt.affirmation}"</p>
        <textarea 
          class="w-full mt-2 p-2 border border-yellow-400 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150" 
          rows="2" 
          placeholder="Repite tu afirmación del día o escribe la tuya..." 
          data-field="morningAffirmation"
        ></textarea>
      </div>

      <div class="mb-1">
        <p class="font-semibold text-gray-700">Establece una intención para tu día:</p>
        <p class="text-sm italic text-gray-600">Sugerencia para el Día ${dayIndex + 1}: "${dayPrompt.intentionSuggestion}"</p>
        <textarea 
          class="w-full mt-2 p-2 border border-yellow-400 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150" 
          rows="2" 
          placeholder="Escribe tu intención personal para hoy..." 
          data-field="morningIntention"
        ></textarea>
      </div>
    </div>
  `;
};