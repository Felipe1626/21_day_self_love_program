import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs 
} from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { type DayProgress, type UserProfile } from '../types';

export const getDayDocRef = (
  db: Firestore, 
  appId: string, 
  userId: string, 
  dayIndex: number
) => {
  const dayId = `day-${dayIndex + 1}`;
  return doc(db, 'artifacts', appId, 'users', userId, 'challenge_progress', dayId);
};

export const getUserProfileRef = (
  db: Firestore,
  appId: string,
  userId: string
) => {
  return doc(db, 'artifacts', appId, 'users', userId, 'profile', 'user_data');
};

export const saveUserProfile = async (
  db: Firestore,
  appId: string,
  userId: string,
  name: string
): Promise<boolean> => {
  console.log('Attempting to save profile:', { appId, userId, name });
  
  const profileRef = getUserProfileRef(db, appId, userId);
  
  try {
    const profile: UserProfile = {
      name,
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    console.log('Profile reference path:', profileRef.path);
    console.log('Profile data:', profile);
    
    await setDoc(profileRef, profile, { merge: true });
    console.log('Profile saved successfully');
    return true;
  } catch (error) {
    const err = error as Error;
    console.error("Error saving user profile:", err);
    console.error("Error message:", err.message);
    
    return false;
  }
};

export const getUserProfile = async (
  db: Firestore,
  appId: string,
  userId: string
): Promise<UserProfile | null> => {
  console.log('Attempting to load profile:', { appId, userId });
  
  const profileRef = getUserProfileRef(db, appId, userId);
  
  try {
    console.log('Profile reference path:', profileRef.path);
    const docSnap = await getDoc(profileRef);
    
    if (docSnap.exists()) {
      console.log('Profile loaded successfully');
      return docSnap.data() as UserProfile;
    } else {
      console.log('No profile found - new user');
      return null;
    }
  } catch (error) {
    const err = error as Error;
    console.error('Error loading user profile:', err);
    console.error('Error message:', err.message);
    
    return null;
  }
};

export const updateLastActive = async (
  db: Firestore,
  appId: string,
  userId: string
): Promise<void> => {
  const profileRef = getUserProfileRef(db, appId, userId);
  
  try {
    await setDoc(profileRef, { lastActive: new Date() }, { merge: true });
  } catch (error) {
    console.error("Error updating last active:", error);
  }
};

export const saveDayProgress = async (
  db: Firestore,
  appId: string,
  userId: string,
  dayIndex: number,
  field: string,
  value: string,
  activityIndex: number | null = null
): Promise<boolean> => {
  const docRef = getDayDocRef(db, appId, userId, dayIndex);
  
  try {
    const docSnap = await getDoc(docRef);
    const updateData: Partial<DayProgress> & { lastUpdated?: Date } = {};
    
    if (field === 'dayActivities') {
      const activities = docSnap.exists() && docSnap.data().dayActivities 
        ? [...docSnap.data().dayActivities] 
        : [];
      
      if (activityIndex !== null) {
        // Ensure array is large enough
        while (activities.length <= activityIndex) {
          activities.push('');
        }
        activities[activityIndex] = value;
      }
      updateData.dayActivities = activities;
    } else if (field === 'morningAffirmation') {
      updateData.morningAffirmation = value;
    } else if (field === 'morningIntention') {
      updateData.morningIntention = value;
    } else if (field === 'nightGratitude') {
      updateData.nightGratitude = value;
    }
    
    // Also update last active timestamp
    updateData.lastUpdated = new Date();
    
    await setDoc(docRef, updateData, { merge: true });
    
    // Update user's last active time
    await updateLastActive(db, appId, userId);
    
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
  dailyContent: Array<{ title: string; content: string }>,
  userName: string
): Promise<boolean> => {
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
    const progressData: Record<string, DayProgress> = {};
    
    querySnapshot.forEach(docSnap => {
      const dayId = docSnap.id;
      progressData[dayId] = docSnap.data() as DayProgress;
    });

    const sortedDays = Object.keys(progressData)
      .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

    let fileContent = "DIARIO DE TRANSFORMACIÓN - PROGRAMA 21 DÍAS AMOR PROPIO\n";
    fileContent += `Participante: ${userName}\n`;
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
    a.download = `Progreso_21_Dias_${userName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.txt`;
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