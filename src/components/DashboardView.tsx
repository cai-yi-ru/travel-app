
import React, { useState, useRef } from 'react';
import { Plus, Trash2, Calendar, MapPin, Upload, X, Loader2, Edit2 } from 'lucide-react';
import { TripMetadata } from '../types';
import { useImageUpload } from '../hooks';
import { seedTripDataToFirebase } from '../lib/firebaseUtils';

interface DashboardViewProps {
    trips: TripMetadata[];
    onSelectTrip: (id: string) => void;
    onAddTrip: (trip: TripMetadata) => void;
    onUpdateTrip: (trip: TripMetadata) => void;
    onDeleteTrip: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ trips, onSelectTrip, onAddTrip, onUpdateTrip, onDeleteTrip }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [formData, setFormData] = useState<Partial<TripMetadata>>({
        title: '',
        subtitle: '',
        startDate: new Date().toISOString().split('T')[0],
        image: ''
    });
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, isUploading } = useImageUpload();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await uploadImage(file, 'covers');
            if (url) {
                setFormData({ ...formData, image: url });
            }
        }
    };

    const handleOpenCreate = () => {
        setFormData({
            title: '',
            subtitle: '',
            startDate: new Date().toISOString().split('T')[0],
            image: ''
        });
        setModalMode('create');
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (trip: TripMetadata) => {
        setFormData({
            title: trip.title,
            subtitle: trip.subtitle,
            startDate: trip.startDate,
            image: trip.image
        });
        setModalMode('edit');
        setEditingId(trip.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.subtitle) return alert('請填寫標題與副標題');
        
        setIsProcessing(true);
        try {
            if (modalMode === 'create') {
                const id = `trip_${Date.now()}`;
                const tripData: TripMetadata = {
                    id,
                    title: formData.title!,
                    subtitle: formData.subtitle!,
                    startDate: formData.startDate!,
                    image: formData.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800'
                };

                // 1. Initialize Firebase Data
                await seedTripDataToFirebase(id, tripData);
                
                // 2. Update Local State
                onAddTrip(tripData);
            } else {
                if (editingId) {
                    const updatedTrip: TripMetadata = {
                        id: editingId,
                        title: formData.title!,
                        subtitle: formData.subtitle!,
                        startDate: formData.startDate!,
                        image: formData.image || ''
                    };
                    onUpdateTrip(updatedTrip);
                }
            }
            
            setIsModalOpen(false);
        } catch (error) {
            alert(modalMode === 'create' ? "建立旅程失敗" : "更新旅程失敗");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans pb-24 max-w-md mx-auto relative overflow-hidden shadow-2xl animate-fade-in p-6">
            <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">My Trips</h1>
            <p className="text-stone-400 text-sm mb-8 tracking-wide">您的旅程管理儀表板</p>

            <div className="space-y-6">
                {trips.map(trip => (
                    <div 
                        key={trip.id} 
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                        onClick={() => onSelectTrip(trip.id)}
                    >
                        <div className="h-40 overflow-hidden relative">
                            <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            
                            <div className="absolute top-3 right-3 flex gap-2 z-10">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(trip); }}
                                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-stone-900/50 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); if(window.confirm(`確定要刪除 ${trip.title} 嗎？此操作無法復原。`)) onDeleteTrip(trip.id); }}
                                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-1">{trip.subtitle}</p>
                                    <h2 className="text-xl font-bold text-stone-800 font-serif">{trip.title}</h2>
                                </div>
                                <div className="bg-stone-100 px-2 py-1 rounded text-[10px] text-stone-500 font-mono flex items-center gap-1">
                                    <Calendar size={10} />
                                    {trip.startDate}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button 
                    onClick={handleOpenCreate}
                    className="w-full py-6 border-2 border-dashed border-stone-300 rounded-2xl text-stone-400 font-bold flex flex-col items-center justify-center gap-2 hover:bg-stone-100 hover:border-stone-400 transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
                        <Plus size={24} />
                    </div>
                    <span className="text-sm">建立新旅程</span>
                </button>
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={handleOpenCreate}
                className="fixed bottom-8 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-black active:scale-95 transition-transform z-40" 
                style={{ position: 'absolute' }} 
                aria-label="Add Trip"
            >
                <Plus size={28} />
            </button>

            {/* Create/Edit Trip Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => !isProcessing && setIsModalOpen(false)}>
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-stone-800">{modalMode === 'create' ? '建立新旅程' : '編輯旅程'}</h3>
                            <button onClick={() => setIsModalOpen(false)} disabled={isProcessing}><X size={24} className="text-stone-400" /></button>
                        </div>
                        
                        <div className="space-y-4">
                             <div>
                                <label className="text-xs font-bold text-stone-400 mb-1 block">封面圖片</label>
                                <div className="h-32 bg-stone-100 rounded-xl overflow-hidden relative cursor-pointer group" onClick={() => !isUploading && !isProcessing && fileInputRef.current?.click()}>
                                    {formData.image ? (
                                        <img src={formData.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-stone-400">
                                            {isUploading ? <Loader2 size={24} className="animate-spin mb-2" /> : <Upload size={24} className="mb-2" />}
                                            <span className="text-xs">{isUploading ? '上傳中...' : '點擊上傳封面'}</span>
                                        </div>
                                    )}
                                    {!isUploading && formData.image && <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white text-xs font-bold">更換圖片</div>}
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-stone-400 mb-1 block">旅程標題 (如: 東京購物行)</label>
                                <input type="text" className="w-full p-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-stone-200" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} disabled={isProcessing} />
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-stone-400 mb-1 block">副標題 / 描述</label>
                                <input type="text" className="w-full p-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-stone-200" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} disabled={isProcessing} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-stone-400 mb-1 block">出發日期</label>
                                <input type="date" className="w-full p-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-stone-200" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} disabled={isProcessing} />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button onClick={handleSubmit} disabled={isUploading || isProcessing} className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
                                {isProcessing && <Loader2 size={18} className="animate-spin" />}
                                {isProcessing ? '處理中...' : (isUploading ? '上傳中...' : (modalMode === 'create' ? '建立旅程' : '儲存變更'))}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
