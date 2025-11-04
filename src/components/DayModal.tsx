import React, { useState, useEffect, useRef } from 'react';
import { type DayProgress } from '../types';
import { dailyContent } from '../constants/dailyContent';
import { morningPrompts } from '../constants/morningPrompts';
import { getMorningRoutineHtml, STRETCHING_BUTTON_HTML } from '../constants/routines';

interface DayModalProps {
  dayIndex: number;
  onClose: () => void;
  initialProgress: DayProgress;
  onSave: (field: string, value: string, activityIndex: number | null) => void;
  onDownload: () => void;
  activeDaysCount: number;
  showToast: (message: string) => void;
}

const DayModal: React.FC<DayModalProps> = ({ 
  dayIndex, 
  onClose, 
  initialProgress,
  onSave,
  onDownload,
  activeDaysCount,
  showToast
}) => {
  const [progress, setProgress] = useState<DayProgress>(initialProgress);
  const contentRef = useRef<HTMLDivElement>(null);
  const routinesRef = useRef<HTMLDivElement>(null);

  const dayData = dailyContent[dayIndex];
  const dayNumber = dayIndex + 1;

  // Inject textareas into content
  const injectTextAreas = (content: string): string => {
    const indicators = [
      '🌟 Afirmación:', '✅ Ejercicio:', '✅ Tarea:', '✅ Práctica:', '✅ Enfoque Diario:', '✅ Revisión:',
      '✅ Reconocimiento:', '✅ Ritual:', '✅ Meditación Guiada:', '✅ Conciencia Corporal:',
      '✍️ Diario:', '🎯 Meta:', '✅ Actividad:', '✅ Técnica:', '✅ Acción del Día:'
    ];

    let modifiedContent = content;
    let activityIndex = 0;

    indicators.forEach(indicator => {
      const escapedIndicator = indicator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(<h[34][^>]*>${escapedIndicator}[^<]*<\\/h[34]>\\s*(?:<p[^>]*>[^<]*<\\/p>)?|(<h3[^>]*>✅ Acción del Día:<\\/h3>\\s*<p>[^<]*<\\/p>))`, 'gs');

      modifiedContent = modifiedContent.replace(regex, (match) => {
        const textareaHTML = `
          <textarea 
            class="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-primary-indigo focus:border-primary-indigo transition duration-150" 
            rows="3" 
            placeholder="Escribe tu reflexión o respuesta aquí..." 
            data-field="dayActivities" 
            data-activity-index="${activityIndex++}"
          ></textarea>
        `;
        return match + textareaHTML;
      });
    });

    return modifiedContent;
  };

  // Comment button for day 21
  const getCommentButtonHtml = (): string => {
    const requiredDays = 15;
    const isEnabled = activeDaysCount >= requiredDays;
    
    const enabledClasses = 'bg-success-green hover:bg-emerald-600 border-emerald-700';
    const disabledClasses = 'disabled-button bg-gray-400 border-gray-600 cursor-not-allowed';
    const classes = isEnabled ? enabledClasses : disabledClasses;

    return `
      <div class="mt-8 pt-4 border-t border-gray-200">
        <h3 class="font-bold text-lg text-primary-indigo mb-3 text-center">¡Celebra tu Transformación!</h3>
        <button 
          id="comment-button"
          class="action-button-style block w-full text-center py-4 px-4 text-white font-extrabold rounded-xl transition duration-200 shadow-xl border-b-4 ${classes}"
          ${!isEnabled ? 'disabled' : ''}
        >
          <span class="text-xl leading-none">Comentar tu Experiencia</span>
          <span class="block mt-1 text-xs font-medium opacity-90">${isEnabled ? '(Botón Desbloqueado)' : `(Actividad: ${activeDaysCount}/${requiredDays} días)`}</span>
        </button>
      </div>
    `;
  };

  // Set up content and event listeners
  useEffect(() => {
    if (!contentRef.current || !routinesRef.current) return;

    // Inject content
    let contentWithInputs = injectTextAreas(dayData.content);
    if (dayIndex === 20) {
      contentWithInputs += getCommentButtonHtml();
    }
    contentRef.current.innerHTML = contentWithInputs;

    // Inject routines
    const morningRoutine = getMorningRoutineHtml(dayIndex, morningPrompts);
    const nightRoutine = `
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
        <textarea 
          class="w-full mt-2 p-2 border border-indigo-400 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
          rows="3" 
          placeholder="Escribe aquí tus 3 momentos de gratitud del día..." 
          data-field="nightGratitude"
        ></textarea>
      </div>
    `;

    const downloadButton = dayIndex === 20 ? `
      <div class="mt-6 mb-4">
        <button 
          id="download-button"
          class="action-button-style block w-full text-center py-3 px-4 bg-primary-indigo text-white font-extrabold rounded-xl hover:bg-indigo-700 transition duration-200 shadow-xl border-b-4 border-indigo-900"
        >
          <span class="text-xl leading-none">💾 Descargar mi Archivo de Progreso</span>
          <span class="block mt-1 text-xs font-medium opacity-90">(Incluye todas tus entradas de diario y rutinas)</span>
        </button>
      </div>
    ` : '';

    routinesRef.current.innerHTML = morningRoutine + STRETCHING_BUTTON_HTML + nightRoutine + downloadButton;

    // Attach event listeners to all textareas
    const attachListeners = () => {
      // Content textareas
      const contentTextareas = contentRef.current?.querySelectorAll('textarea[data-field]');
      contentTextareas?.forEach((textarea) => {
        const element = textarea as HTMLTextAreaElement;
        const field = element.dataset.field;
        const activityIndex = element.dataset.activityIndex;

        // Set initial value
        if (field === 'dayActivities' && activityIndex !== undefined) {
          const index = parseInt(activityIndex, 10);
          element.value = progress.dayActivities?.[index] || '';
        }

        // Add blur event
        element.addEventListener('blur', () => {
          const value = element.value.trim();
          const actIdx = activityIndex !== undefined ? parseInt(activityIndex, 10) : null;
          onSave(field!, value, actIdx);
        });
      });

      // Routine textareas
      const routineTextareas = routinesRef.current?.querySelectorAll('textarea[data-field]');
      routineTextareas?.forEach((textarea) => {
        const element = textarea as HTMLTextAreaElement;
        const field = element.dataset.field;

        // Set initial value
        if (field === 'morningAffirmation') {
          element.value = progress.morningAffirmation || '';
        } else if (field === 'morningIntention') {
          element.value = progress.morningIntention || '';
        } else if (field === 'nightGratitude') {
          element.value = progress.nightGratitude || '';
        }

        // Add blur event
        element.addEventListener('blur', () => {
          const value = element.value.trim();
          onSave(field!, value, null);
        });
      });

      // Download button
      const downloadBtn = document.getElementById('download-button');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', onDownload);
      }

      // Comment button
      const commentBtn = document.getElementById('comment-button');
      if (commentBtn && activeDaysCount >= 15) {
        commentBtn.addEventListener('click', () => {
          showToast('¡Felicitaciones! Enlace de reseña simulado. Abrir una nueva pestaña para el formulario.', 5000);
        });
      } else if (commentBtn) {
        commentBtn.addEventListener('click', () => {
          showToast(`Necesitas registrar tu actividad en al menos 15 días para desbloquear el comentario. Llevas ${activeDaysCount} días.`, 5000);
        });
      }
    };

    attachListeners();
  }, [dayIndex, progress, activeDaysCount]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex modal-overlay items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-primary-indigo">{dayData.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition duration-150"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div ref={contentRef} className="text-gray-700 leading-relaxed space-y-4 mb-8"></div>

        <div ref={routinesRef} className="space-y-6 border-t pt-4"></div>

        <button 
          onClick={onClose} 
          className="mt-6 w-full py-3 bg-primary-indigo text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DayModal;