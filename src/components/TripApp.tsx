
import React, { useState, useEffect } from 'react';
import { Wallet, Calendar, CheckSquare, Navigation, Cloud, X, ArrowLeft, LayoutGrid } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { 
  INITIAL_ITINERARY_DATA, INITIAL_EXPENSES, INITIAL_USERS, 
  INITIAL_PACKING_LIST, INITIAL_SHOPPING_LIST, INITIAL_COUPONS, BLANK_ITINERARY, INITIAL_TRIPS
} from '../constants';
import { useDraggableScroll, useCloudSync } from '../hooks';
import { Activity, DayData, Expense, UserData, TripMetadata } from '../types';
import { ItineraryView, DetailModal, DayInfoEditModal } from './ItineraryView';
import { ExpensesView } from './ExpensesView';
import { ToolsView } from './ToolsView';
import { ChecklistsView } from './ChecklistsView';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { seedTripDataToFirebase } from '../lib/firebaseUtils';

// --- Local Components Definitions (Reused) ---

const TripInfoEditModal = ({ tripTitle, tripSubtitle, onClose, onSave }: { tripTitle: string, tripSubtitle: string, onClose: () => void, onSave: (title: string, subtitle: string) => void }) => {
    const [title, setTitle] = useState(tripTitle);
    const [subtitle, setSubtitle] = useState(tripSubtitle);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">編輯旅程標題</h3>
                <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">主標題 (例如: Family Trip)</label>
                        <input type="text" className="w-full p-2 border rounded font-bold text-sm" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">副標題 (例如: 北海道旅行 2026)</label>
                        <input type="text" className="w-full p-2 border rounded font-bold text-lg" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-stone-500">取消</button>
                    <button onClick={() => onSave(title, subtitle)} className="px-6 py-2 bg-stone-900 text-white rounded-lg font-bold shadow-lg">儲存</button>
                </div>
            </div>
        </div>
    )
}

const AddUserModal = ({ onClose, onSave }: { onClose: () => void, onSave: (name: string) => void }) => {
    const [name, setName] = useState('');
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">新增旅伴</h3>
                <input 
                    type="text" 
                    className="w-full p-3 border rounded-xl mb-4 bg-stone-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-stone-200" 
                    placeholder="名字 (例如: Alex)" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-stone-500 hover:bg-stone-50 rounded-lg">取消</button>
                    <button onClick={() => { if(name) onSave(name); }} className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold disabled:opacity-50" disabled={!name}>新增</button>
                </div>
            </div>
        </div>
    );
};

const TabBar = ({ activeTab, setActiveTab, onBack }: { activeTab: string, setActiveTab: (tab: string) => void, onBack: () => void }) => {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-between gap-1 p-1 bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full z-50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] w-[95vw] max-w-md overflow-x-auto hide-scrollbar px-3">
        {/* <button onClick={onBack} className={`flex-1 relative py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 group text-stone-400 hover:text-stone-600 hover:bg-stone-50`}>
          <LayoutGrid size={20} strokeWidth={2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">旅程</span>
        </button> */}
        <button onClick={() => setActiveTab('expenses')} className={`flex-1 relative py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 group ${activeTab === 'expenses' ? 'bg-stone-100 text-stone-900 shadow-inner' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}>
          <Wallet size={20} strokeWidth={activeTab === 'expenses' ? 2.5 : 2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">記帳</span>
        </button>
        <button onClick={() => setActiveTab('itinerary')} className={`flex-1 relative py-3 rounded-full flex flex-col items-center justify-center transition-all duration-500 ease-out group ${activeTab === 'itinerary' ? 'bg-stone-800 text-white shadow-lg scale-105' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}>
          <Calendar size={22} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">行程</span>
        </button>
        <button onClick={() => setActiveTab('checklists')} className={`flex-1 relative py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 group ${activeTab === 'checklists' ? 'bg-stone-100 text-stone-900 shadow-inner' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}>
          <CheckSquare size={20} strokeWidth={activeTab === 'checklists' ? 2.5 : 2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">清單</span>
        </button>
        <button onClick={() => setActiveTab('tools')} className={`flex-1 relative py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 group ${activeTab === 'tools' ? 'bg-stone-100 text-stone-900 shadow-inner' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}>
          <Navigation size={20} strokeWidth={activeTab === 'tools' ? 2.5 : 2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">工具</span>
        </button>
      </div>
    );
};

interface TripAppProps {
    tripId: string;
    onBack: () => void;
}

export const TripApp: React.FC<TripAppProps> = ({ tripId, onBack }) => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDay, setSelectedDay] = useState(''); 
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // Auto-seed example data to Firebase if it's the demo trip and data is missing
  useEffect(() => {
      const initializeFirebaseData = async () => {
          if (isFirebaseEnabled && tripId === 'hokkaido_trip') {
              try {
                  const docRef = doc(db, 'trips', tripId, 'data', 'info');
                  const docSnap = await getDoc(docRef);
                  if (!docSnap.exists()) {
                      console.log("Seeding initial data to Firebase for:", tripId);
                      const metadata = INITIAL_TRIPS.find(t => t.id === tripId);
                      await seedTripDataToFirebase(tripId, metadata);
                  }
              } catch (e) {
                  console.error("Auto-seeding failed", e);
              }
          }
      };
      initializeFirebaseData();
  }, [tripId]);
  
  // Decide initial data based on tripId. If it's the specific Hokkaido trip, use full data. Else blank.
  const DEFAULT_ITINERARY = tripId === 'hokkaido_trip' ? INITIAL_ITINERARY_DATA : BLANK_ITINERARY;

  // Sync Hooks with tripId scope
  const [itineraryData, setItineraryData, isSyncingItinerary] = useCloudSync('itinerary', DEFAULT_ITINERARY, tripId);
  const [expenses, setExpenses, isSyncingExpenses] = useCloudSync('expenses', INITIAL_EXPENSES, tripId);
  const [users, setUsers] = useCloudSync('users', INITIAL_USERS, tripId);
  const [tripInfo, setTripInfo] = useCloudSync('info', { title: 'New Trip', subtitle: 'My Adventure' }, tripId);

  const [packingList, setPackingList] = useCloudSync('packing', INITIAL_PACKING_LIST, tripId);
  const [shoppingList, setShoppingList] = useCloudSync('shopping', INITIAL_SHOPPING_LIST, tripId);
  const [coupons, setCoupons] = useCloudSync('coupons', INITIAL_COUPONS, tripId);
  
  // Access global trip list to sync title changes
  const [allTrips, setAllTrips] = useCloudSync<TripMetadata[]>('trip_list', INITIAL_TRIPS, 'app_metadata');

  const isSyncing = isSyncingItinerary || isSyncingExpenses;

  // UI State
  const [editDayModal, setEditDayModal] = useState<DayData | null>(null);
  const [editTripInfoModal, setEditTripInfoModal] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [addUserModal, setAddUserModal] = useState(false);

  const dateScrollRef = useDraggableScroll();
  
  // Sort Dates (Active Days) - Itinerary is now an array
  // Ensure itineraryData is always an array to prevent "is not iterable" error
  const safeItineraryData = Array.isArray(itineraryData) ? itineraryData : DEFAULT_ITINERARY;
  const sortedItinerary = [...safeItineraryData].sort((a, b) => a.date.localeCompare(b.date));
  
  // Ensure selectedDay is valid
  const currentDayData = sortedItinerary.find(d => d.date === selectedDay) || sortedItinerary[0];
  const currentDayKey = currentDayData?.date || '';
  
  if (!selectedDay && currentDayKey) setSelectedDay(currentDayKey);

  // Helper to format ISO date to Display Date (e.g. 2025-12-20 -> DEC 20 SAT)
  const getDisplayDate = (isoDate: string) => {
      const date = new Date(isoDate);
      // Fallback for invalid dates
      if (isNaN(date.getTime())) return { month: 'DAY', day: '1', weekday: '' };
      
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const day = date.getDate().toString();
      const month = monthNames[date.getMonth()];
      
      return { month, day };
  };

  // --- Handlers ---
  const updateDayData = (updatedDay: DayData) => {
      const currentData = Array.isArray(itineraryData) ? itineraryData : DEFAULT_ITINERARY;
      const newItinerary = currentData.map(d => d.date === updatedDay.date ? updatedDay : d);
      setItineraryData(newItinerary);
  }

  const handleSaveActivity = (updatedActivity: Activity) => {
      if (!currentDayData) return;
      const newDayActivities = currentDayData.activities.map(act => 
          act.id === updatedActivity.id ? updatedActivity : act
      );
      updateDayData({ ...currentDayData, activities: newDayActivities });
      setSelectedActivity(updatedActivity); 
  };
  
  const handleDeleteActivity = (id: string) => {
      if (!currentDayData) return;
      const newDayActivities = currentDayData.activities.filter(act => act.id !== id);
      updateDayData({ ...currentDayData, activities: newDayActivities });
      setSelectedActivity(null); 
  };

  const handleMoveActivity = (id: string, direction: 'up' | 'down') => {
      if (!currentDayData) return;
      const idx = currentDayData.activities.findIndex(a => a.id === id);
      if (idx === -1) return;
      if (direction === 'up' && idx === 0) return;
      if (direction === 'down' && idx === currentDayData.activities.length - 1) return;

      const newActivities = [...currentDayData.activities];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newActivities[idx], newActivities[targetIdx]] = [newActivities[targetIdx], newActivities[idx]];

      updateDayData({ ...currentDayData, activities: newActivities });
  };

  const handleAddActivity = () => {
      if (!currentDayData) return;
      const newActivity: Activity = {
          id: Date.now().toString(),
          time: '00:00',
          type: 'sightseeing',
          title: '新增景點',
          description: '請輸入詳細資訊...',
          subtitle: '新地點'
      };
      const newDayData = { ...currentDayData, activities: [...currentDayData.activities, newActivity] };
      updateDayData(newDayData);
      setSelectedActivity(newActivity);
  };
  
  const handleSaveDayInfo = (updatedDayInfo: DayData) => {
      updateDayData(updatedDayInfo);
      setEditDayModal(null);
  };
  
  const handleSaveTripInfo = (newTitle: string, newSubtitle: string) => {
      // 1. Update trip info inside the trip
      setTripInfo({ title: newTitle, subtitle: newSubtitle });
      
      // 2. Update the trip in the global list to ensure consistency on dashboard
      const updatedTrips = allTrips.map(t => 
          t.id === tripId 
          ? { ...t, title: newTitle, subtitle: newSubtitle } 
          : t
      );
      setAllTrips(updatedTrips);
      
      setEditTripInfoModal(false);
  };

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>, id?: number) => {
    if (id) {
        setExpenses(expenses.map(e => e.id === id ? { ...expenseData, id } : e));
    } else {
        const newExpense = { ...expenseData, id: Date.now() };
        setExpenses([newExpense, ...expenses]);
    }
  };

  const handleDeleteExpense = (id: number) => {
      setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleAddUser = (name: string) => {
      // FIX: Ensure ID is unique to avoid collision and deletion issues
      const id = `${name.charAt(0).toUpperCase()}_${Date.now().toString().slice(-4)}`;
      const colors = ['bg-red-100 text-red-700', 'bg-indigo-100 text-indigo-700', 'bg-pink-100 text-pink-700', 'bg-teal-100 text-teal-700'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setUsers([...users, { id, name, color: randomColor }]);
      setAddUserModal(false);
  };
  
  const handleUpdateUser = (id: string, newName: string) => {
      setUsers(users.map(u => u.id === id ? { ...u, name: newName } : u));
  };

  const handleDeleteUser = (id: string) => {
      setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-32 max-w-md mx-auto relative overflow-hidden shadow-2xl animate-fade-in">
      {/* Sync Indicator */}
      {isSyncing && (
          <div className="absolute top-0 right-0 p-2 z-50 animate-pulse">
              <Cloud size={16} className="text-blue-500" />
          </div>
      )}

      {/* Header with Back Button */}
      <div className="bg-white sticky top-0 z-40 border-b border-stone-100 shadow-sm relative flex items-center justify-center h-14">
            <button onClick={onBack} className="absolute left-4 p-2 rounded-full hover:bg-stone-50 text-stone-500">
                <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-stone-700">{tripInfo.title}</span>
      </div>

      {activeTab === 'itinerary' && (
        <>
          <div className="bg-white sticky top-14 z-30 border-b border-stone-100 shadow-sm relative">
            <div className="pt-4 pb-2 px-6 cursor-pointer hover:bg-stone-50 transition-colors" onClick={() => setEditTripInfoModal(true)}>
              <h1 className="text-xl font-serif font-bold text-center text-stone-800">{tripInfo.subtitle}</h1>
            </div>
            
            <div ref={dateScrollRef} className="flex overflow-x-auto px-4 pb-2 hide-scrollbar space-x-6 snap-x select-none">
              {sortedItinerary.map((dayData) => {
                const { month, day } = getDisplayDate(dayData.date);

                return (
                  <button
                    key={dayData.date}
                    onClick={() => setSelectedDay(dayData.date)}
                    className={`flex flex-col items-center justify-center min-w-[3rem] py-2 transition-all duration-300 snap-center group ${
                      currentDayKey === dayData.date 
                        ? 'text-stone-900 scale-110' 
                        : 'text-stone-300 hover:text-stone-500'
                    }`}
                  >
                    <span className="text-[12px] font-bold uppercase tracking-widest opacity-60 mb-0">
                      {month}
                    </span>
                    <span className={`text-4xl font-serif ${currentDayKey === dayData.date ? 'font-bold' : 'font-medium'}`}>
                      {day}
                    </span>
                  </button>
                );
              })}
              <div className="w-2 shrink-0"></div>
            </div>
          </div>
          
          <ItineraryView 
             dayData={currentDayData}
             selectedDay={currentDayKey}
             onDayDataChange={updateDayData}
             onSelectActivity={setSelectedActivity}
             onAddActivity={handleAddActivity}
             onViewImage={setFullScreenImage}
             setEditDayModal={setEditDayModal}
          />
        </>
      )}
      
      {activeTab === 'expenses' && (
         <ExpensesView 
            expenses={expenses}
            users={users}
            onSaveExpense={handleSaveExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddUser={() => setAddUserModal(true)}
            onViewImage={setFullScreenImage}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
         />
      )}

      {activeTab === 'checklists' && (
          <ChecklistsView 
              packingList={packingList}
              setPackingList={setPackingList}
              shoppingList={shoppingList}
              setShoppingList={setShoppingList}
              coupons={coupons}
              setCoupons={setCoupons}
              onViewImage={setFullScreenImage}
              users={users}
              onAddUser={() => setAddUserModal(true)}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
          />
      )}

      {activeTab === 'tools' && (
        <ToolsView tripId={tripId} onReset={() => {/* Legacy Reset - consider removing or hiding */}} />
      )}
      
      {/* --- Modals --- */}
      {editDayModal && <DayInfoEditModal dayKey={currentDayKey} dayData={editDayModal} onClose={() => setEditDayModal(null)} onSave={handleSaveDayInfo} />}
      {editTripInfoModal && <TripInfoEditModal tripTitle={tripInfo.title} tripSubtitle={tripInfo.subtitle} onClose={() => setEditTripInfoModal(false)} onSave={handleSaveTripInfo} />}
      {addUserModal && <AddUserModal onClose={() => setAddUserModal(false)} onSave={handleAddUser} />}
      {fullScreenImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setFullScreenImage(null)}>
           <div className="absolute top-6 right-6 p-4 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-colors"><X size={32} className="text-white" /></div>
           <img src={fullScreenImage} alt="Full Screen" className="max-w-full max-h-full object-contain" />
        </div>
      )}
      <DetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} onSave={handleSaveActivity} onDelete={handleDeleteActivity} onMoveUp={(id) => handleMoveActivity(id, 'up')} onMoveDown={(id) => handleMoveActivity(id, 'down')} />
      
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} onBack={onBack} />
    </div>
  );
};
