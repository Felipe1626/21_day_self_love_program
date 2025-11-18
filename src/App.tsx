import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DayButton from './components/DayButton';
import DayModal from './components/DayModal';
import CrisisModal from './components/CrisisModal';
import WelcomeModal from './components/WelcomeModal';
import { useFirebase } from './hooks/useFirebase';
import { useProgress } from './hooks/useProgress';
import { dailyContent } from './constants/dailyContent';
import { 
  countActiveDays, 
  downloadProgress, 
  getUserProfile, 
  saveUserProfile 
} from './services/progressService';
import { type DayProgress } from './types';

const App: React.FC = () => {
  
  const { db, userId, appId, isAuthReady } = useFirebase();
  const { saveProgress, loadProgress, toast, showToast } = useProgress(db, appId, userId, isAuthReady);

  useEffect(() => {
  console.log('Auth ready:', isAuthReady);
  console.log('User ID:', userId);
  console.log('DB initialized:', !!db);
}, [isAuthReady, userId, db]);
  
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [dayProgress, setDayProgress] = useState<DayProgress>({});
  const [activeDaysCount, setActiveDaysCount] = useState(0);
  const [userName, setUserName] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!db || !userId || !appId || !isAuthReady) return;
      
      try {
        const profile = await getUserProfile(db, appId, userId);
        if (profile && profile.name) {
          setUserName(profile.name);
          setShowWelcome(false);
        } else {
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setShowWelcome(true);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [db, userId, appId, isAuthReady]);

  // Load active days count
  useEffect(() => {
    const loadActiveDays = async () => {
      if (!db || !userId || !appId || !isAuthReady) return;
      const count = await countActiveDays(db, appId, userId);
      setActiveDaysCount(count);
    };

    loadActiveDays();
  }, [db, userId, appId, isAuthReady, selectedDayIndex]);

  // Load day progress when modal opens
  useEffect(() => {
    const loadDayData = async () => {
    if (selectedDayIndex === null) return;
    
    console.log('Loading progress for day:', selectedDayIndex + 1);
    const progress = await loadProgress(selectedDayIndex);
    console.log('Loaded progress:', progress);
    setDayProgress(progress);
  };

  loadDayData();
  }, [selectedDayIndex, loadProgress]);

  const handleWelcomeSubmit = async (name: string) => {
    if (!db || !userId || !appId) {
      showToast('Error al guardar tu nombre. Por favor, intenta de nuevo.');
      return;
    }

    const success = await saveUserProfile(db, appId, userId, name);
    if (success) {
      setUserName(name);
      setShowWelcome(false);
      showToast(`¡Bienvenida, ${name}! Tu viaje de transformación comienza ahora.`, 3000);
    } else {
      showToast('Error al guardar tu nombre. Por favor, intenta de nuevo.');
    }
  };

  const handleSaveProgress = async (field: string, value: string, activityIndex: number | null) => {
    if (selectedDayIndex === null) return;
    await saveProgress(selectedDayIndex, field, value, activityIndex);
    
    // Update local state
    if (field === 'dayActivities' && activityIndex !== null) {
      const activities = [...(dayProgress.dayActivities || [])];
      activities[activityIndex] = value;
      setDayProgress({ ...dayProgress, dayActivities: activities });
    } else {
      setDayProgress({ ...dayProgress, [field]: value });
    }
  };

  const handleDownload = async () => {
    if (!db || !userId || !appId) {
      showToast('Error de autenticación, no se puede descargar.');
      return;
    }
    
    const success = await downloadProgress(db, appId, userId, dailyContent, userName || 'Usuario');
    if (success) {
      showToast('Descarga completada.', 1500);
    } else {
      showToast('Error al procesar la descarga de datos.', 3000);
    }
  };

  const handleCloseDayModal = () => {
    setSelectedDayIndex(null);
    setDayProgress({});
  };

  if (!isAuthReady || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-indigo"></div>
          <p className="mt-4 text-primary-indigo font-semibold">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg font-sans min-h-screen">
      {showWelcome && <WelcomeModal onSubmit={handleWelcomeSubmit} />}
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Header onOpenCrisisModal={() => setIsCrisisModalOpen(true)} userName={userName} />

        {/* Day Grid */}
        <main className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-2xl">
          {dailyContent.map((_, index) => (
            <DayButton
              key={index}
              dayNumber={index + 1}
              onClick={() => setSelectedDayIndex(index)}
            />
          ))}
        </main>
      </div>

      {/* Modals */}
      {selectedDayIndex !== null && (
        <DayModal
          dayIndex={selectedDayIndex}
          onClose={handleCloseDayModal}
          initialProgress={dayProgress}
          onSave={handleSaveProgress}
          onDownload={handleDownload}
          activeDaysCount={activeDaysCount}
          showToast={showToast}
        />
      )}

      {isCrisisModalOpen && (
        <CrisisModal onClose={() => setIsCrisisModalOpen(false)} />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl z-50 transition duration-300 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;

