import { useState, useCallback } from 'react';
import { Firestore } from 'firebase/firestore';
import { 
  saveDayProgress, 
  loadDayProgress 
} from '../services/progressService';
import { type DayProgress } from '../types';

export const useProgress = (
  db: Firestore | null,
  appId: string,
  userId: string | null,
  isAuthReady: boolean
) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string, duration = 3000) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  }, []);

  const saveProgress = useCallback(async (
    dayIndex: number,
    field: string,
    value: string,
    activityIndex: number | null = null
  ) => {
    if (!isAuthReady || !db || !userId) {
      console.warn("Database not ready. Cannot save.");
      return;
    }

    showToast("Guardando progreso...");
    
    const success = await saveDayProgress(
      db, 
      appId, 
      userId, 
      dayIndex, 
      field, 
      value, 
      activityIndex
    );
    
    if (success) {
      showToast("Progreso guardado con éxito.", 1500);
    } else {
      showToast("Error al guardar el progreso.", 3000);
    }
  }, [isAuthReady, db, userId, appId, showToast]);

  const loadProgress = useCallback(async (
    dayIndex: number
  ): Promise<DayProgress> => {
    if (!isAuthReady || !db || !userId) {
      return {};
    }

    showToast("Cargando progreso...");
    const data = await loadDayProgress(db, appId, userId, dayIndex);
    showToast("Progreso cargado con éxito.", 1000);
    
    return data;
  }, [isAuthReady, db, userId, appId, showToast]);

  return { saveProgress, loadProgress, toast, showToast };
};