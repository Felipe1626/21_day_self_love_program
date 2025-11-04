import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  type DocumentData
} from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { type DayProgress, type DayContent, type ProgressData } from '../types';

export const getDayDocRef = (
  db: Firestore, 
  appId: string, 
  userId: string, 
  dayIndex: number
) => {
  const dayId = `day-${dayIndex + 1}`;
  return doc(db, 'artifacts', appId, 'users', userId, 'challenge_progress', dayId);
};

export const saveDayProgress = async (
  db: Firestore,
  appId: string,
  userId: string,
  dayIndex: number,
  field: string,
  value: string,
  activityIndex: number | null = null
) => {
  const docRef = getDayDocRef(db, appId, userId, dayIndex);
  
  try {
    const docSnap = await getDoc(docRef);
    const updateData: DocumentData = {};
    
    if (field === 'dayActivities') {
      const activities = docSnap.exists() && docSnap.data().dayActivities 
        ? docSnap.data().dayActivities 
        : [];
      
      if (activityIndex !== null) {
        activities[activityIndex] = value;
      }
      updateData[field] = activities;
    } else {
      updateData[field] = value;
    }
    
    await setDoc(docRef, updateData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
};

export const loadDayProgress = async (
  db: Firestore,
  appId: string,
  userId: string,
  dayIndex: number
): Promise<DayProgress> => {
  const docRef = getDayDocRef(db, appId, userId, dayIndex);
  
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as DayProgress : {};
  } catch (error) {
    console.error("Error loading progress:", error);
    return {};
  }
};

export const countActiveDays = async (
  db: Firestore,
  appId: string,
  userId: string
): Promise<number> => {
  const progressRef = collection(
    db, 
    'artifacts', 
    appId, 
    'users', 
    userId, 
    'challenge_progress'
  );
  
  try {
    const querySnapshot = await getDocs(progressRef);
    let activeDays = 0;

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const hasAffirmation = data.morningAffirmation?.trim() !== '';
      const hasIntention = data.morningIntention?.trim() !== '';
      const hasGratitude = data.nightGratitude?.trim() !== '';
      const hasActivities = data.dayActivities?.some((a: string) => a?.trim() !== '');

      if (hasAffirmation || hasIntention || hasGratitude || hasActivities) {
        activeDays++;
      }
    });
    
    return activeDays;
  } catch (error) {
    console.error("Error counting active days:", error);
    return 0;
  }
};

export const downloadProgress = async (
  db: Firestore,
  appId: string,
  userId: string,
  dailyContent: DayContent[]
) => {
  const progressRef = collection(
    db, 
    'artifacts', 
    appId, 
    'users', 
    userId, 
    'challenge_progress'
  );
  
  try {
    const querySnapshot = await getDocs(progressRef);
    const progressData: ProgressData = {};
    
    querySnapshot.forEach(docSnap => {
      const dayId = docSnap.id;
      progressData[dayId] = docSnap.data();
    });

    const sortedDays = Object.keys(progressData)
      .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

    let fileContent = "DIARIO DE TRANSFORMACIÓN - PROGRAMA 21 DÍAS AMOR PROPIO\n";
    fileContent += `Usuario ID: ${userId}\n`;
    fileContent += `Fecha de Descarga: ${new Date().toLocaleDateString()}\n\n`;
    fileContent += "=================================================\n\n";

    sortedDays.forEach(dayId => {
      const dayNumber = dayId.split('-')[1];
      const data = progressData[dayId];
      const dayTitle = dailyContent[parseInt(dayNumber) - 1]?.title || `Día ${dayNumber}`;
      
      fileContent += `\n--- ${dayTitle} ---\n`;
      fileContent += `  Afirmación Matutina: ${data.morningAffirmation || 'No registrado'}\n`;
      fileContent += `  Intención del Día: ${data.morningIntention || 'No registrado'}\n`;
      fileContent += `  Gratitud Nocturna: ${data.nightGratitude || 'No registrado'}\n`;
      
      if (data.dayActivities && data.dayActivities.length > 0) {
        fileContent += "  Otras Actividades/Diario:\n";
        data.dayActivities.forEach((activity: string, index: number) => {
          if (activity?.trim() !== '') {
            fileContent += `    - [Entrada ${index + 1}]: ${activity}\n`;
          }
        });
      }
    });

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Progreso_21_Dias_Amor_Propio_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error during download:", error);
    return false;
  }
};