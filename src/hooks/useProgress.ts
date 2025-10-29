import { useState, useEffect, useCallback } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth'; // User imported as a type
// Importing DocumentData using 'import type' to satisfy TypeScript configuration
import type { DocumentData } from 'firebase/firestore'; 
import { 
    doc, getDoc, setDoc, collection, getDocs
} from 'firebase/firestore';
import { db, auth, CUSTOM_APP_ID } from '../services/firebaseConfig';

// --- 1. TYPE DEFINITIONS ---

// Define the expected structure of data stored for a single day in Firestore
interface DayProgress extends DocumentData {
    morningAffirmation?: string;
    morningIntention?: string;
    nightGratitude?: string;
    dayActivities?: string[]; 
}

// Define the shape of the main progress object (map of day IDs to data)
interface ProgressData {
    [dayId: string]: DayProgress; // e.g., 'day-1': { ... }
}

// Define the return type of the hook
interface UseProgressReturn {
    isLoading: boolean;
    userId: string | null;
    progressData: ProgressData;
    activeDaysCount: number;
    // saveProgress function type: handles saving strings or array updates
    saveProgress: (
        dayIndex: number, 
        field: keyof DayProgress, // Ensures field name is valid
        value: string | string[], 
        activityIndex?: number | null
    ) => Promise<void>;
    // getDayField returns a string, string array, or undefined if not found
    getDayField: (dayIndex: number, field: string) => string | string[];
}

// Helper to get the correct Firestore document reference
function getDayDocRef(userId: string | null, dayIndex: number) {
    if (!userId || !CUSTOM_APP_ID) return null;
    const dayId = `day-${dayIndex + 1}`;
    // Path: /artifacts/{appId}/users/{userId}/challenge_progress/{day-X}
    return doc(db, 'artifacts', CUSTOM_APP_ID, 'users', userId, 'challenge_progress', dayId);
}

// --- 2. HOOK IMPLEMENTATION ---

export function useProgress(): UseProgressReturn {
    // State is strictly typed
    const [userId, setUserId] = useState<string | null>(null);
    const [progressData, setProgressData] = useState<ProgressData>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeDaysCount, setActiveDaysCount] = useState<number>(0);

    // Loads all progress data and updates the active day count
    const loadAllProgress = useCallback(async (currentUserId: string) => {
        if (!currentUserId) return;
        setIsLoading(true);

        const progressRef = collection(db, 'artifacts', CUSTOM_APP_ID, 'users', currentUserId, 'challenge_progress');
        const newProgressData: ProgressData = {};
        let count = 0;

        try {
            const querySnapshot = await getDocs(progressRef);

            querySnapshot.forEach(docSnap => {
                // Ensure data is treated as DayProgress type
                const data = docSnap.data() as DayProgress;
                newProgressData[docSnap.id] = data;

                // Logic for counting active days, safely checking for existence
                const hasAffirmation = (data.morningAffirmation || '').trim() !== '';
                const hasIntention = (data.morningIntention || '').trim() !== '';
                const hasGratitude = (data.nightGratitude || '').trim() !== '';
                // Check if dayActivities is an array and has at least one non-empty string
                const hasActivities = data.dayActivities?.some(a => a && a.trim() !== ''); 

                if (hasAffirmation || hasIntention || hasGratitude || hasActivities) {
                    count++;
                }
            });

            setProgressData(newProgressData);
            setActiveDaysCount(count);
        } catch (error) {
            console.error("Error loading all progress:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- AUTHENTICATION AND INITIAL LOAD ---
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                setUserId(user.uid);
                await loadAllProgress(user.uid); 
            } else {
                try {
                    // Fallback: Sign in anonymously
                    const result = await signInAnonymously(auth);
                    setUserId(result.user.uid);
                    await loadAllProgress(result.user.uid);
                } catch (error) {
                    console.error("Error during anonymous sign-in or data load:", error);
                    // Fallback to a random ID for local testing if Firebase fails
                    setUserId(crypto.randomUUID()); 
                    setIsLoading(false);
                }
            }
        });

        return () => unsubscribeAuth();
    }, [loadAllProgress]);


    // --- SAVING DATA UTILITIES ---

    const saveProgress: UseProgressReturn['saveProgress'] = useCallback(async (dayIndex, field, value, activityIndex = null) => {
        if (!userId) return;

        const docRef = getDayDocRef(userId, dayIndex);
        if (!docRef) return;

        try {
            const updateData: Partial<DayProgress> = {};
            
            // Get current data to safely update arrays
            const docSnap = await getDoc(docRef);
            // Assert current data type for safe array handling
            const currentData = docSnap.exists() ? docSnap.data() as DayProgress : {};

            if (field === 'dayActivities' && activityIndex !== null && typeof value === 'string') {
                // Safely update the array based on the index
                const activities = Array.isArray(currentData.dayActivities) ? [...currentData.dayActivities] : [];
                activities[activityIndex] = value;
                updateData[field] = activities as string[];
            } else if (typeof value === 'string') {
                 // Update single string fields
                 updateData[field] = value;
            }


            if (Object.keys(updateData).length > 0) {
                 await setDoc(docRef, updateData, { merge: true });
                 
                 // Optimistically update local state
                 const dayId = `day-${dayIndex + 1}`;
                 setProgressData(prev => ({
                     ...prev,
                     [dayId]: {
                         ...(prev[dayId] || {}), // Ensure existing data is merged
                         ...updateData as DayProgress
                     }
                 }));
                 
                 // Recalculate active days count after save
                 await loadAllProgress(userId); 
            }

        } catch (error) {
            console.error("Error saving progress:", error);
        }
    }, [userId, loadAllProgress]);


    // Helper to extract data for a specific day and field
    const getDayField: UseProgressReturn['getDayField'] = (dayIndex, field) => {
        const dayId = `day-${dayIndex + 1}`;
        // Return the field value, defaulting to an empty array for activities or an empty string for others
        const fieldValue = progressData[dayId]?.[field as keyof DayProgress];

        if (field === 'dayActivities') {
            return (Array.isArray(fieldValue) ? fieldValue : []) as string[];
        }
        
        return (fieldValue || '') as string;
    };

    return {
        isLoading,
        userId,
        progressData,
        activeDaysCount,
        saveProgress,
        getDayField
    };
}
