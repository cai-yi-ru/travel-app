
'use client';

import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../lib/firebase';
import { DashboardView } from '../components/DashboardView';
import { TripApp } from '../components/TripApp';
import { useCloudSync } from '../hooks';
import { INITIAL_TRIPS } from '../constants';
import { TripMetadata, ItineraryData } from '../types';

export default function Home() {
    // Determine which view to show: Dashboard or Specific Trip
    // If tripId is null, show Dashboard.
    const [currentTripId, setCurrentTripId] = useState<string | null>(null);
    const [hasCheckedAutoSelect, setHasCheckedAutoSelect] = useState(false);
    
    // Manage list of trips globally
    const [trips, setTrips] = useCloudSync<TripMetadata[]>('trip_list', INITIAL_TRIPS, 'app_metadata');

    // Auto-select the trip if there is only one in the list (Initial Load only)
    useEffect(() => {
        if (!hasCheckedAutoSelect && trips.length > 0) {
            if (trips.length === 1) {
                setCurrentTripId(trips[0].id);
            }
            setHasCheckedAutoSelect(true);
        }
    }, [trips, hasCheckedAutoSelect]);

    const handleSelectTrip = (id: string) => {
        setCurrentTripId(id);
    };

    const handleAddTrip = (newTrip: TripMetadata) => {
        setTrips([...trips, newTrip]);
    };

    const handleUpdateTrip = async (updatedTrip: TripMetadata) => {
        // Find old trip to check if date changed
        const oldTrip = trips.find(t => t.id === updatedTrip.id);

        // 1. Update List (Syncs to trip_list via useCloudSync)
        const newTrips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
        setTrips(newTrips);

        if (isFirebaseEnabled) {
             try {
                 // 2. Update Inner Info Document (Firestore) to ensure consistency when entering the trip
                 const infoRef = doc(db, 'trips', updatedTrip.id, 'data', 'info');
                 await setDoc(infoRef, { 
                     value: { title: updatedTrip.title, subtitle: updatedTrip.subtitle }, 
                     updatedAt: new Date() 
                 }, { merge: true });

                 // 3. Shift Itinerary Dates if start date changed
                 if (oldTrip && oldTrip.startDate !== updatedTrip.startDate) {
                    const oldStart = new Date(oldTrip.startDate);
                    const newStart = new Date(updatedTrip.startDate);
                    const diffTime = newStart.getTime() - oldStart.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays !== 0) {
                        const itineraryRef = doc(db, 'trips', updatedTrip.id, 'data', 'itinerary');
                        const docSnap = await getDoc(itineraryRef);
                        
                        if (docSnap.exists()) {
                            const itinerary = docSnap.data().value as ItineraryData;
                            const newItinerary = itinerary.map(day => {
                                const d = new Date(day.date);
                                d.setDate(d.getDate() + diffDays);
                                const newDateStr = d.toISOString().split('T')[0];
                                return { ...day, date: newDateStr };
                            });
                            
                            await setDoc(itineraryRef, { value: newItinerary, updatedAt: new Date() }, { merge: true });
                            console.log(`Itinerary dates shifted by ${diffDays} days`);
                        }
                    }
                 }
             } catch(e) { console.error("Failed to sync inner info or shift dates", e); }
        }
    };

    const handleDeleteTrip = (id: string) => {
        setTrips(trips.filter(t => t.id !== id));
        if (currentTripId === id) setCurrentTripId(null);
    };

    // Render Dashboard if no trip selected
    if (!currentTripId) {
        return (
            <DashboardView 
                trips={trips}
                onSelectTrip={handleSelectTrip}
                onAddTrip={handleAddTrip}
                onUpdateTrip={handleUpdateTrip}
                onDeleteTrip={handleDeleteTrip}
            />
        );
    }

    // Render Trip Application if trip selected
    return (
        <TripApp 
            tripId={currentTripId} 
            onBack={() => setCurrentTripId(null)}
        />
    );
}
