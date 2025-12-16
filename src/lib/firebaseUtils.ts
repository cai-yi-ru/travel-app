
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebase';
import { 
    INITIAL_ITINERARY_DATA, 
    INITIAL_EXPENSES, 
    INITIAL_USERS, 
    INITIAL_PACKING_LIST, 
    INITIAL_SHOPPING_LIST, 
    INITIAL_COUPONS 
} from '../constants';
import { TripMetadata, ItineraryData } from '../types';

// Helper to shift dates
const getShiftedItinerary = (data: ItineraryData, targetStartDate: string): ItineraryData => {
    if (!data || data.length === 0) return data;
    
    // Assume the first day of initial data is the base
    const baseDateStr = data[0].date;
    const baseDate = new Date(baseDateStr);
    const targetDate = new Date(targetStartDate);
    
    // Calculate difference in days
    const diffTime = targetDate.getTime() - baseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return data;

    return data.map(day => {
        const d = new Date(day.date);
        d.setDate(d.getDate() + diffDays);
        const newDateStr = d.toISOString().split('T')[0];
        return { ...day, date: newDateStr };
    });
};

// 將預設資料寫入指定 Trip ID 的 Firebase Sub-collection
export const seedTripDataToFirebase = async (tripId: string, metadata?: TripMetadata) => {
    if (!tripId) return;
    
    // Prevent execution if Firebase is not properly configured (avoids Invalid segment error)
    if (!isFirebaseEnabled) {
        console.warn("Firebase config missing (Project ID). Skipping cloud seed. Running in local-only mode.");
        return true; // Return true to allow UI to proceed locally
    }

    try {
        const batch = writeBatch(db);

        // 1. 如果有 Metadata，寫入旅程基本資訊 (Root Document)
        if (metadata) {
            const tripRef = doc(db, 'trips', tripId);
            batch.set(tripRef, { ...metadata, updatedAt: new Date() }, { merge: true });
        }

        // 2. 寫入各項詳細資料 (Sub-collection 'data')
        
        // 行程 (Shift dates if metadata is provided)
        const itineraryRef = doc(db, 'trips', tripId, 'data', 'itinerary');
        let itineraryToSave = INITIAL_ITINERARY_DATA;
        
        if (metadata?.startDate) {
             itineraryToSave = getShiftedItinerary(INITIAL_ITINERARY_DATA, metadata.startDate);
        }
        
        batch.set(itineraryRef, { value: itineraryToSave, updatedAt: new Date() });

        // 記帳
        const expensesRef = doc(db, 'trips', tripId, 'data', 'expenses');
        batch.set(expensesRef, { value: INITIAL_EXPENSES, updatedAt: new Date() });

        // 使用者
        const usersRef = doc(db, 'trips', tripId, 'data', 'users');
        batch.set(usersRef, { value: INITIAL_USERS, updatedAt: new Date() });

        // 行李清單
        const packingRef = doc(db, 'trips', tripId, 'data', 'packing');
        batch.set(packingRef, { value: INITIAL_PACKING_LIST, updatedAt: new Date() });

        // 購物清單
        const shoppingRef = doc(db, 'trips', tripId, 'data', 'shopping');
        batch.set(shoppingRef, { value: INITIAL_SHOPPING_LIST, updatedAt: new Date() });

        // 優惠券
        const couponsRef = doc(db, 'trips', tripId, 'data', 'coupons');
        batch.set(couponsRef, { value: INITIAL_COUPONS, updatedAt: new Date() });

        // 旅程標題資訊 (用於 TripApp 內部顯示)
        const infoRef = doc(db, 'trips', tripId, 'data', 'info');
        batch.set(infoRef, { 
            value: { 
                title: metadata?.title || 'My Trip', 
                subtitle: metadata?.subtitle || 'Travel Planner' 
            }, 
            updatedAt: new Date() 
        });

        await batch.commit();
        console.log(`Trip ${tripId} seeded successfully.`);
        return true;
    } catch (error) {
        console.error("Error seeding trip data:", error);
        throw error;
    }
};
