
import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Removed Firebase Storage imports
import { db, isFirebaseEnabled } from './lib/firebase';

// Hook for persistent state via localStorage (Base)
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          alert('Local storage is full! Image might be too large.');
      }
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for Cloud Sync (Firebase + LocalStorage)
export function useCloudSync<T>(baseKey: string, initialValue: T, tripId: string = 'hokkaido_trip_2026') {
    const storageKey = `${tripId}_${baseKey}`;
    const [localValue, setLocalValue] = useLocalStorage<T>(storageKey, initialValue);
    const [isSyncing, setIsSyncing] = useState(false);
    
    // Ref to track the current local value to avoid stale closures in listeners
    const localValueRef = useRef(localValue);
    // Ref to track if we are currently writing to Firebase to avoid immediate echo conflicts
    const isWritingRef = useRef(false);

    // Update ref whenever localValue changes via other means (e.g. initial load)
    useEffect(() => {
        localValueRef.current = localValue;
    }, [localValue]);
    
    useEffect(() => {
        if (!isFirebaseEnabled || !tripId) return;

        const docRef = doc(db, 'trips', tripId, 'data', baseKey);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            // If we are currently writing, ignore the snapshot if it's just an echo (optional safety)
            // But Firestore snapshots are smart. The main issue is the race between local state update and snapshot firing.
            // By updating localValueRef immediately in setValue, we mitigate this.
            
            if (docSnap.exists()) {
                const data = docSnap.data().value as T;
                // Compare with current ref value to prevent loops and overwriting recent local changes
                if (JSON.stringify(data) !== JSON.stringify(localValueRef.current)) {
                    // Only update if data is truly different
                    if (!isWritingRef.current) {
                        if (typeof window !== 'undefined') {
                            window.localStorage.setItem(storageKey, JSON.stringify(data));
                        }
                        setLocalValue(data);
                        // Update ref immediately to reflect this external change
                        localValueRef.current = data;
                    }
                }
            }
        }, (error) => {
            console.error("Sync error:", error);
        });

        return () => unsubscribe();
    }, [storageKey, tripId, baseKey]);

    const setValue = async (value: T | ((val: T) => T)) => {
        const valueToStore = value instanceof Function ? value(localValue) : value;
        
        // 1. Update Local State
        setLocalValue(valueToStore);
        
        // 2. CRITICAL: Update Ref IMMEDIATELY. 
        // This closes the gap between setting state and the useEffect updating the ref.
        // If onSnapshot fires immediately after setDoc (optimistic update), it will compare against this NEW value.
        localValueRef.current = valueToStore;

        if (isFirebaseEnabled && tripId) {
            setIsSyncing(true);
            isWritingRef.current = true;
            try {
                const docRef = doc(db, 'trips', tripId, 'data', baseKey);
                await setDoc(docRef, { value: valueToStore, updatedAt: new Date() }, { merge: true });
            } catch (e) {
                console.error("Firebase sync failed", e);
            } finally {
                setIsSyncing(false);
                isWritingRef.current = false;
            }
        }
    };

    return [localValue, setValue, isSyncing] as const;
}

// Hook for Image Upload to Cloudflare R2 (via Next.js API)
export const useImageUpload = () => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File, folder: string = 'uploads') => {
        // Note: 'folder' is currently unused in the simple R2 implementation 
        // unless passed to the API to be part of the key.
        
        setIsUploading(true);
        try {
            // 1. Request Presigned URL from our API
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    filename: file.name, 
                    contentType: file.type 
                }),
            });

            if (!response.ok) throw new Error('Failed to get upload URL');
            
            const { uploadUrl, publicUrl } = await response.json();

            // 2. Upload directly to R2 using the presigned URL
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) throw new Error('Failed to upload image to R2');

            // 3. Return the public URL
            return publicUrl;

        } catch (error) {
            console.error("Upload failed", error);
            alert("圖片上傳失敗，請檢查網路或稍後再試。");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading };
};

// Hook for horizontal drag scrolling
export const useDraggableScroll = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add('active');
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'grab';
    };

    const onMouseUp = () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style.cursor = 'grab';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; 
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);
    slider.style.cursor = 'grab';

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return ref;
};

// Hook for Real-time Exchange Rate (JPY -> TWD)
export const useExchangeRate = () => {
    const DEFAULT_RATE = 0.22; 
    const [rate, setRate] = useLocalStorage<number>('global_exchange_rate', DEFAULT_RATE);
    const [lastUpdated, setLastUpdated] = useLocalStorage<string>('global_exchange_rate_date', '');
    const [loading, setLoading] = useState(false);

    const fetchRate = async () => {
        setLoading(true);
        try {
            let data;
            try {
                const internalRes = await fetch('/api/exchange-rate');
                if (!internalRes.ok) throw new Error('Internal API failed');
                const contentType = internalRes.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                     throw new Error("Internal API returned non-JSON");
                }
                data = await internalRes.json();
            } catch (internalError) {
                const externalRes = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
                data = await externalRes.json();
            }

            if (data && data.rates && data.rates.TWD) {
                setRate(data.rates.TWD);
                const now = new Date().toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                setLastUpdated(now);
            }
        } catch (error) {
            console.error("All exchange rate fetch methods failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!lastUpdated) {
            fetchRate();
        }
    }, []);

    return { rate, lastUpdated, loading, fetchRate };
};
