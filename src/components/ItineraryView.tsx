
import React, { useState, useRef, useEffect } from 'react';
import { 
    Calendar, MapPin, Ticket, Plane, Camera, Utensils, Car, BedDouble, ShoppingBag, 
    ChevronRight, Edit2, Plus, Trash2, ArrowUp, ArrowDown, Save, Upload, Eye, Navigation, X, Image as ImageIcon,
    Map, Loader2, Star
} from 'lucide-react';
import { Activity, DayData, FlightInfo, DetailedInfo } from '../types';
import { ACTIVITY_TYPES } from '../constants';
import { WeatherWidget } from './WeatherWidget';
import { useImageUpload } from '../hooks';

// --- Helper Functions ---
const getActivityColor = (type: Activity['type']) => {
  switch(type) {
    case 'food': return { border: 'border-l-rose-400', tag: 'text-rose-600 bg-rose-50', bg: 'bg-rose-50' };
    case 'transport': return { border: 'border-l-sky-400', tag: 'text-sky-600 bg-sky-50', bg: 'bg-sky-50' };
    case 'hotel': return { border: 'border-l-indigo-400', tag: 'text-indigo-600 bg-indigo-50', bg: 'bg-indigo-50' };
    case 'flight': return { border: 'border-l-stone-400', tag: 'text-stone-600 bg-stone-100', bg: 'bg-stone-100' };
    case 'shop': return { border: 'border-l-amber-400', tag: 'text-amber-600 bg-amber-50', bg: 'bg-amber-50' };
    default: return { border: 'border-l-emerald-400', tag: 'text-emerald-600 bg-emerald-50', bg: 'bg-emerald-50' };
  }
};

const getActivityIcon = (type: Activity['type']) => {
  switch(type) {
    case 'food': return <Utensils size={16} />;
    case 'transport': return <Car size={16} />;
    case 'flight': return <Plane size={16} />; 
    case 'hotel': return <BedDouble size={16} />;
    case 'shop': return <ShoppingBag size={16} />;
    default: return <Camera size={16} />;
  }
};

// --- Sub Components ---

const FlightTicket = ({ data }: { data: FlightInfo }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-6">
    <div className="bg-stone-50 px-5 py-3 border-b border-stone-100 flex items-center gap-2">
       <Ticket size={16} className="text-stone-400" />
       <span className="font-bold text-stone-600 text-sm tracking-wider">航班與訂位資訊</span>
    </div>
    <div className="p-5">
       <div className="flex justify-between items-start mb-6">
          <div>
             <div className="flex items-center gap-2 text-stone-800 font-bold text-lg mb-1">
                <Plane size={20} className="text-stone-400" />
                <span>{data.dep.city}</span>
                <span className="text-stone-300">→</span>
                <span>{data.arr.city}</span>
             </div>
             <div className="text-xs text-stone-400 font-mono ml-7">{data.airline} {data.flightNo}</div>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-stone-800">{data.date}</div>
             <div className="inline-block mt-1 bg-stone-100 px-2 py-0.5 rounded text-[10px] font-mono text-stone-500">
                Ref: <span className="font-bold text-stone-800">{data.bookingCode}</span>
             </div>
          </div>
       </div>

       <div className="flex items-center justify-between bg-stone-50 rounded-xl p-4">
          <div className="text-center">
             <div className="text-2xl font-black text-stone-800 font-mono">{data.dep.time}</div>
             <div className="text-xs text-stone-400 font-bold mt-1">{data.dep.code} <span className="font-normal opacity-70">{data.dep.terminal}</span></div>
          </div>
          <div className="flex-1 px-4 flex flex-col items-center">
             <span className="text-[10px] text-stone-400 mb-1">{data.duration}</span>
             <div className="w-full h-[1px] bg-stone-300 relative">
                <div className="absolute right-0 -top-[3px] w-0 h-0 border-l-[4px] border-l-stone-300 border-y-[3px] border-y-transparent" />
             </div>
          </div>
          <div className="text-center">
             <div className="text-2xl font-black text-stone-800 font-mono">{data.arr.time}</div>
             <div className="text-xs text-stone-400 font-bold mt-1">{data.arr.code} <span className="font-normal opacity-70">{data.arr.terminal}</span></div>
          </div>
       </div>
    </div>
  </div>
);

// --- Modals ---

export const DayInfoEditModal = ({ dayKey, dayData, onClose, onSave }: { dayKey: string, dayData: DayData, onClose: () => void, onSave: (data: DayData) => void }) => {
    const [form, setForm] = useState({ ...dayData });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, isUploading } = useImageUpload();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await uploadImage(file, 'headers');
            if (url) {
                setForm({ ...form, heroImage: url });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">編輯行程資訊 ({dayKey.split(' ')[0]})</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">首圖 (Hero Image)</label>
                        <div className="flex gap-2 mb-2">
                            <input 
                                type="text" 
                                className="flex-1 p-2 border rounded text-sm"
                                placeholder="輸入圖片連結"
                                value={form.heroImage?.startsWith('data:') ? '' : form.heroImage}
                                onChange={e => setForm({...form, heroImage: e.target.value})}
                            />
                            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-stone-100 p-2 rounded border border-stone-200 disabled:opacity-50">
                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                        {form.heroImage && (
                            <div className="h-32 w-full rounded overflow-hidden">
                                <img src={form.heroImage} className="w-full h-full object-cover" alt="Preview" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">標題</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded font-bold"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">副標題</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded text-sm"
                            value={form.subtitle}
                            onChange={e => setForm({...form, subtitle: e.target.value})}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-stone-500">取消</button>
                    <button onClick={() => onSave(form)} disabled={isUploading} className="px-6 py-2 bg-stone-900 text-white rounded-lg font-bold shadow-lg disabled:opacity-50">儲存</button>
                </div>
            </div>
        </div>
    );
};

export const DetailModal = ({ activity, onClose, onSave, onDelete, onMoveUp, onMoveDown }: { activity: Activity | null, onClose: () => void, onSave: (data: Activity) => void, onDelete: (id: string) => void, onMoveUp: (id: string) => void, onMoveDown: (id: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Activity>(activity || {} as Activity);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [fullScreenContent, setFullScreenContent] = useState<{ jp: string, tw: string } | string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, isUploading } = useImageUpload();
  
    useEffect(() => {
        if (activity) {
            // Migration logic: ensure images array exists if image string is present
            const existingImages = activity.images || [];
            const combinedImages = existingImages.length > 0 ? existingImages : (activity.image ? [activity.image] : []);
            
            setEditForm({ 
                ...activity, 
                images: combinedImages,
                // ensure legacy image field matches first item
                image: combinedImages[0] || ''
            });
            setIsEditing(false); // Reset editing state when activity changes
        }
    }, [activity]);
  
    if (!activity) return null;
  
    const handleCopy = (text: string) => { alert(`已複製: ${text}`); };
    const openFullScreen = (jp: string, tw?: string) => {
        if(tw) {
             setFullScreenContent({ jp, tw });
        } else {
             setFullScreenContent(jp);
        }
        setShowFullScreen(true);
    };

    const handleOpenMap = () => {
        // Query Logic: Use Address -> Japanese Name -> Title
        const query = activity.address || activity.japaneseName || activity.title;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
    };
  
    const handleSave = () => {
        onSave(editForm);
        setIsEditing(false);
    };

    const handleClose = () => {
        if(isEditing) {
            setIsEditing(false);
            setEditForm({ ...activity });
        } else {
            onClose();
        }
    };
    
    const handleDelete = () => {
        if(window.confirm("確定要刪除此景點嗎？")) {
            onDelete(activity.id);
            onClose();
        }
    }
  
    const updateDetailedInfo = (index: number, field: keyof DetailedInfo, value: string) => {
        const newDetails = [...(editForm.detailedInfo || [])];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setEditForm({ ...editForm, detailedInfo: newDetails });
    };

    const addDetailedInfo = () => {
        setEditForm({
            ...editForm,
            detailedInfo: [...(editForm.detailedInfo || []), { title: '', content: '' }]
        });
    };

    const removeDetailedInfo = (index: number) => {
        const newDetails = [...(editForm.detailedInfo || [])];
        newDetails.splice(index, 1);
        setEditForm({ ...editForm, detailedInfo: newDetails });
    };
  
    const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newImages = [...(editForm.images || [])];
        // Upload sequentially
        for (let i = 0; i < files.length; i++) {
            const url = await uploadImage(files[i], 'activities');
            if (url) newImages.push(url);
        }
        setEditForm({ 
            ...editForm, 
            images: newImages, 
            image: newImages[0] || '' 
        });
      }
    };

    const removeImage = (index: number) => {
        const newImages = [...(editForm.images || [])];
        newImages.splice(index, 1);
        setEditForm({ 
            ...editForm, 
            images: newImages, 
            image: newImages[0] || '' // Update cover
        });
    };

    const setCoverImage = (index: number) => {
        const newImages = [...(editForm.images || [])];
        const item = newImages.splice(index, 1)[0];
        newImages.unshift(item);
        setEditForm({ 
            ...editForm, 
            images: newImages, 
            image: newImages[0] || '' 
        });
    };

    // Calculate images for view mode
    const viewImages = editForm.images && editForm.images.length > 0 ? editForm.images : (editForm.image ? [editForm.image] : []);

    return (
        <>
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={handleClose} />
        <div className="bg-white w-full max-w-md h-[85vh] sm:h-[80vh] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col transform transition-transform duration-300 ease-out animate-slide-up">
            
            <div className="flex justify-between px-4 pt-4 pb-2 bg-white z-10 border-b border-stone-50">
                 {isEditing ? (
                     <button onClick={handleClose} disabled={isUploading} className="text-stone-400 hover:text-stone-600 font-bold px-2">取消</button>
                 ) : (
                     <div className="w-8" /> 
                 )}
                 
                 <div className="flex gap-2">
                     {!isEditing ? (
                         <>
                             <button onClick={() => onMoveUp(activity.id)} className="bg-stone-50 p-2 rounded-full shadow-sm active:scale-95">
                                <ArrowUp size={18} className="text-stone-400" />
                             </button>
                             <button onClick={() => onMoveDown(activity.id)} className="bg-stone-50 p-2 rounded-full shadow-sm active:scale-95">
                                <ArrowDown size={18} className="text-stone-400" />
                             </button>
                             <div className="w-2" />
                             <button onClick={() => setIsEditing(true)} className="bg-stone-100 p-2 rounded-full shadow-sm active:scale-95 transition-transform">
                                 <Edit2 size={18} className="text-stone-800" />
                             </button>
                         </>
                     ) : (
                         <button onClick={handleSave} disabled={isUploading} className="bg-stone-900 p-2 rounded-full shadow-sm active:scale-95 transition-transform disabled:opacity-50">
                             {isUploading ? <Loader2 size={18} className="animate-spin text-white" /> : <Save size={18} className="text-white" />}
                         </button>
                     )}
                     {isEditing && (
                         <button onClick={handleDelete} className="bg-red-50 p-2 rounded-full shadow-sm active:scale-95 transition-transform">
                             <Trash2 size={18} className="text-red-500" />
                         </button>
                     )}
                     <button onClick={handleClose} className="bg-stone-100 p-2 rounded-full shadow-sm active:scale-95 transition-transform">
                         <X size={20} className="text-stone-800" />
                     </button>
                 </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white hide-scrollbar">
            
            {isEditing ? (
                /* --- Edit Mode --- */
                <div className="space-y-4 py-4 pb-10">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-stone-400">照片 ({editForm.images?.length || 0})</label>
                            {editForm.images && editForm.images.length > 0 && <span className="text-[10px] text-stone-300">首張為封面</span>}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {editForm.images?.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-stone-200 bg-stone-50">
                                    <img src={img} className="w-full h-full object-cover" alt={`Photo ${idx + 1}`} />
                                    <button 
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                                    >
                                        <X size={12} />
                                    </button>
                                    
                                    {idx === 0 ? (
                                        <div className="absolute bottom-0 left-0 right-0 bg-stone-900/70 text-white text-[9px] py-0.5 text-center font-bold">
                                            封面
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setCoverImage(idx)}
                                            className="absolute bottom-1 left-1 right-1 bg-white/90 text-stone-800 text-[9px] py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 font-bold transition-opacity"
                                        >
                                            設為封面
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="aspect-square rounded-lg border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 hover:bg-stone-50 hover:border-stone-300 transition-colors disabled:opacity-50 gap-1"
                            >
                                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={24} />}
                                <span className="text-[10px] font-bold">{isUploading ? '上傳' : '新增'}</span>
                            </button>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            multiple
                            onChange={handleMultiImageUpload}
                        />
                        
                        <div className="mt-2">
                             <input 
                                type="text" 
                                className="w-full p-2 border border-stone-200 rounded-lg text-xs"
                                placeholder="或輸入圖片網址 (逗號分隔)"
                                onBlur={(e) => {
                                    if(e.target.value) {
                                        const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        if(urls.length > 0) {
                                            const newImages = [...(editForm.images || []), ...urls];
                                            setEditForm({ ...editForm, images: newImages, image: newImages[0] });
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                     <div className="grid grid-cols-3 gap-3">
                         <div className="col-span-1">
                            <label className="text-xs font-bold text-stone-400">時間</label>
                            <input type="text" className="w-full p-2 border border-stone-200 rounded-lg text-sm font-mono" value={editForm.time || ''} onChange={e => setEditForm({...editForm, time: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-stone-400">類型</label>
                            <select className="w-full p-2 border border-stone-200 rounded-lg text-sm bg-white" value={editForm.type || 'sightseeing'} onChange={e => setEditForm({...editForm, type: e.target.value as Activity['type']})}>
                                {ACTIVITY_TYPES.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                            </select>
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-stone-400">標題</label>
                        <input type="text" className="w-full p-2 border border-stone-200 rounded-lg text-lg font-bold" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                    </div>
                    
                    <div>
                         <label className="text-xs font-bold text-stone-400">副標題 / 地址</label>
                         <input type="text" className="w-full p-2 border border-stone-200 rounded-lg text-sm" value={editForm.address || editForm.subtitle || ''} onChange={e => setEditForm({...editForm, address: e.target.value, subtitle: e.target.value})} />
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-stone-400">日文名稱</label>
                            <input type="text" className="w-full p-2 border border-stone-200 rounded-lg text-sm" value={editForm.japaneseName || ''} onChange={e => setEditForm({...editForm, japaneseName: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-400">中文名稱</label>
                            <input type="text" className="w-full p-2 border border-stone-200 rounded-lg text-sm" value={editForm.TaiwanName || ''} onChange={e => setEditForm({...editForm, TaiwanName: e.target.value})} />
                        </div>
                     </div>

                     <div className="border-t border-stone-100 pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-stone-400 block">詳細資訊列表</label>
                            <button onClick={addDetailedInfo} className="text-xs bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded flex items-center gap-1">
                                <Plus size={12} /> 新增
                            </button>
                        </div>
                        
                        {editForm.detailedInfo?.map((info, idx) => (
                            <div key={idx} className="mb-3 p-3 bg-stone-50 rounded-lg relative group">
                                <button onClick={() => removeDetailedInfo(idx)} className="absolute top-2 right-2 text-stone-300 hover:text-red-400"><Trash2 size={14} /></button>
                                <input type="text" className="w-full p-1 bg-transparent border-b border-stone-200 text-sm font-bold mb-1 pr-6" placeholder="標題" value={info.title} onChange={e => updateDetailedInfo(idx, 'title', e.target.value)} />
                                <textarea className="w-full p-1 bg-transparent text-sm" placeholder="內容" rows={2} value={info.content} onChange={e => updateDetailedInfo(idx, 'content', e.target.value)} />
                            </div>
                        ))}
                     </div>
                </div>
            ) : (
                /* --- View Mode --- */
                <div className="py-4">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold tracking-wider text-stone-400 uppercase border border-stone-200 px-2 py-0.5 rounded-full">{activity.type}</span>
                            <span className="text-xs font-mono text-stone-400">{activity.time}</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight mb-2">{activity.title}</h2>
                        
                        {/* Address & Map Button */}
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-stone-500 flex items-center gap-1 text-sm flex-1">
                                <MapPin size={14} className="flex-shrink-0" />
                                <span className="truncate">{activity.address || activity.subtitle || 'Hokkaido'}</span>
                            </p>
                            <button 
                                onClick={handleOpenMap}
                                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-xs font-bold transition-colors active:scale-95"
                            >
                                <Map size={12} />
                                Google Maps
                            </button>
                        </div>
                    </div>
                    
                    {activity.type === 'flight' && activity.flightInfo && (
                        <FlightTicket data={activity.flightInfo} />
                    )}

                    {activity.type !== 'flight' && (
                        <div className="mb-8 p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center space-y-2 cursor-pointer hover:bg-stone-100 transition-colors active:scale-[0.98] group" 
                            onClick={() => openFullScreen(activity.japaneseName || activity.title, activity.TaiwanName || activity.title)}>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">手指日語 (Point & Speak)</p>
                            <h3 className="text-4xl font-black text-stone-900 leading-tight font-serif py-2 group-hover:scale-105 transition-transform">{activity.japaneseName || activity.title}</h3>
                            <p className="text-stone-400 text-sm font-medium mb-4">( {activity.TaiwanName || activity.title} )</p>
                            <p className="text-stone-300 text-[10px] pt-2">點擊放大</p>
                        </div>
                    )}

                    {activity.recommendations && (
                        <div className="mb-8 space-y-3">
                            <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider mb-2">店家招牌指指通</h4>
                            {activity.recommendations.map((rec, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div>
                                        <p className="text-xs text-amber-800 font-bold mb-1">{rec.name}</p>
                                        <p className="text-stone-900 font-serif font-bold">{rec.note}</p>
                                    </div>
                                    <button onClick={() => openFullScreen(rec.dish, rec.note)} className="p-2 bg-white rounded-full shadow-sm text-amber-500 hover:bg-amber-100 transition-colors"><Eye size={18} /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    {(activity.parking || activity.gpsPhone) && (
                        <div className="mb-8 border border-stone-100 rounded-xl p-4 bg-white shadow-sm">
                            {activity.parking && (
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-stone-50">
                                    <span className="text-sm font-bold text-stone-800">{activity.parking}</span>
                                    <span className="text-xs text-stone-400">停車場</span>
                                </div>
                            )}
                            {activity.gpsPhone && (
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleCopy(activity.gpsPhone!)} className="w-10 h-10 flex items-center justify-center bg-stone-50 rounded-full text-stone-600">
                                        <Navigation size={18} />
                                    </button>
                                    <div>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">車用導航 (CAR GPS)</p>
                                        <p className="text-xl font-mono font-bold text-stone-800 tracking-wide">{activity.gpsPhone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activity.detailedInfo ? (
                        <div className="space-y-6 relative pl-4 border-l-2 border-stone-100">
                            {activity.detailedInfo.map((info, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-stone-200 ring-4 ring-white" />
                                    <h4 className="font-bold text-stone-900 mb-1 text-sm">【{info.title}】</h4>
                                    <p className="text-stone-600 leading-relaxed text-sm text-justify">{info.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-stone-600 leading-relaxed text-sm text-justify">{activity.description}</p>
                    )}

                    {/* Image Gallery */}
                    {viewImages.length > 0 && (
                        <div className="mt-8 space-y-4">
                            {/* Main Cover */}
                            <div className="rounded-2xl overflow-hidden shadow-md">
                                <img src={viewImages[0]} alt={activity.title} className="w-full h-48 object-cover cursor-pointer" onClick={() => openFullScreen(viewImages[0]!)} />
                            </div>
                            
                            {/* Other Images (if any) */}
                            {viewImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x">
                                    {viewImages.slice(1).map((img, i) => (
                                        <div key={i} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-stone-100 snap-start cursor-pointer" onClick={() => openFullScreen(img)}>
                                            <img src={img} className="w-full h-full object-cover hover:opacity-90 transition-opacity" alt={`Gallery ${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            </div>
        </div>
        </div>
        
        {/* Full Screen Overlay */}
        {showFullScreen && fullScreenContent && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-fade-in" onClick={() => setShowFullScreen(false)}>
                <div className="absolute top-6 right-6 p-4 bg-stone-100 rounded-full z-50 cursor-pointer hover:bg-stone-200">
                    <X size={32} className="text-stone-500" />
                </div>
                <p className="text-stone-400 mb-8 font-bold tracking-widest uppercase z-50 pointer-events-none">點擊任意處關閉</p>
                <div className="w-full text-center space-y-4 flex flex-col items-center justify-center h-full">
                    {typeof fullScreenContent === 'string' && (fullScreenContent.startsWith('http') || fullScreenContent.startsWith('data:')) ? (
                         <img src={fullScreenContent} alt="Fullscreen" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
                    ) : (
                        <>
                           {typeof fullScreenContent === 'object' ? (
                              <>
                                <h1 className="text-[10vw] font-black text-stone-900 leading-tight font-serif break-words px-4">{fullScreenContent.jp}</h1>
                                {fullScreenContent.tw && <p className="text-2xl text-stone-500 font-medium">( {fullScreenContent.tw} )</p>}
                              </>
                           ) : (
                             <h1 className="text-[10vw] font-black text-stone-900 leading-tight font-serif break-words px-4">{fullScreenContent}</h1>
                           )}
                        </>
                    )}
                </div>
            </div>
        )}
    </>
  );
};

// --- Main Itinerary View ---

interface ItineraryViewProps {
    dayData?: DayData;
    selectedDay: string;
    onDayDataChange: (data: DayData) => void;
    onSelectActivity: (activity: Activity) => void;
    onAddActivity: () => void;
    onViewImage: (img: string) => void;
    setEditDayModal: (data: DayData) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ 
    dayData, selectedDay, onDayDataChange, onSelectActivity, onAddActivity, onViewImage, setEditDayModal 
}) => {
    const mapInputRef = useRef<HTMLInputElement>(null);
    const draggingItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const { uploadImage, isUploading } = useImageUpload();

    const handleMapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && dayData) {
            const url = await uploadImage(file, 'maps');
            if (url) {
                onDayDataChange({ ...dayData, handDrawnMap: url });
            }
        }
    };

    const handleDragStart = (index: number) => { draggingItem.current = index; };
    const handleDragEnter = (index: number) => { dragOverItem.current = index; };
    const handleDragEnd = () => {
        if (!dayData) return;
        const draggingIdx = draggingItem.current;
        const dragOverIdx = dragOverItem.current;
        if (draggingIdx !== null && dragOverIdx !== null && draggingIdx !== dragOverIdx) {
          const newActivities = [...dayData.activities];
          const draggedItemContent = newActivities[draggingIdx];
          newActivities.splice(draggingIdx, 1);
          newActivities.splice(dragOverIdx, 0, draggedItemContent);
          onDayDataChange({ ...dayData, activities: newActivities });
        }
        draggingItem.current = null;
        dragOverItem.current = null;
    };

    if (!dayData) {
        return (
            <div className="flex flex-col items-center justify-center h-96 px-6 text-center">
                <div className="bg-stone-100 p-4 rounded-full mb-4"><Calendar size={48} className="text-stone-300" /></div>
                <h3 className="text-xl font-serif font-bold text-stone-700 mb-2">暫無行程</h3>
                <p className="text-stone-400 text-sm">該日期尚未規劃行程資料。</p>
            </div>
        );
    }

    return (
        <>
            <div className="relative h-48 mx-4 mt-4 rounded-3xl overflow-hidden shadow-md group">
                <img src={dayData.heroImage} alt="Hero" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <button 
                       className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full hover:bg-white/40 transition-colors"
                       onClick={() => setEditDayModal(dayData)}
                    >
                       <Edit2 size={14} className="text-white" />
                    </button>
  
                    <div className="inline-flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[14px] font-bold text-white border border-white/30">{dayData.dayLabel}</span>
                      <span className="text-white/80 text-xs flex items-center gap-1"><MapPin size={10} /> {(dayData.title || '').split(' ')[1]}</span>
                    </div>
                    <h2 className="text-white font-serif font-bold text-2xl tracking-wide">{dayData.subtitle}</h2>
                </div>
            </div>
            
            <WeatherWidget data={dayData} dateLabel={selectedDay} />
            
            <div className="mt-8 px-4 space-y-0">
                {dayData.activities.map((item, index) => {
                  const style = getActivityColor(item.type);
                  return (
                    <div 
                        key={item.id} 
                        className="flex gap-4 relative group" 
                        onClick={() => onSelectActivity(item)}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="w-16 flex-shrink-0 flex flex-col items-end pt-1 relative">
                          <span className="font-serif text-lg font-medium text-stone-800">{item.time}</span>
                          <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">詳細</span>
                          {index !== dayData.activities.length - 1 && (<div className="absolute top-10 right-[-17px] bottom-[-20px] w-[1px] bg-stone-200" />)}
                        </div>
                        <div className="relative">
                          <div className={`w-2.5 h-2.5 rounded-full mt-3 ring-4 ring-stone-50 ${style.bg.replace('bg-', 'bg-').replace('50', '400')}`} />
                        </div>
                        <div className={`flex-1 mb-8 bg-white p-4 rounded-2xl shadow-sm border-l-[3px] ${style.border} active:scale-[0.98] transition-all hover:shadow-md cursor-pointer`}>
                          <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${style.tag}`}>{item.type}</span>
                              {item.endTime && <span className="text-[10px] text-stone-400">直到 {item.endTime}</span>}
                          </div>
                          <h3 className="font-bold text-stone-800 text-lg leading-tight mb-1">{item.title}</h3>
                          <p className="text-sm text-stone-500 font-medium mb-3">{item.subtitle}</p>
                          <div className="flex items-center gap-1 text-xs text-stone-400 mt-auto pt-2 border-t border-stone-50">
                              {getActivityIcon(item.type)}
                              <span className="truncate max-w-[150px]">{(item.description || (item.detailedInfo && item.detailedInfo[0].content) || '').substring(0, 20)}...</span>
                              <ChevronRight size={14} className="ml-auto" />
                          </div>
                        </div>
                    </div>
                  );
                })}
                 <div className="flex justify-center mb-8">
                    <button onClick={onAddActivity} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-full text-sm font-bold hover:bg-stone-200 transition-colors">
                        <Plus size={16} /> 新增景點
                    </button>
                </div>
            </div>
  
            <div className="px-6 mt-4 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-lg text-stone-800">手繪旅程圖</h3>
                    <div className="flex gap-2">
                        {dayData.handDrawnMap && (
                           <button onClick={() => onDayDataChange({ ...dayData, handDrawnMap: null })} className="text-stone-400 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        )}
                        <button onClick={() => mapInputRef.current?.click()} disabled={isUploading} className="text-stone-400 hover:text-stone-900 transition-colors">
                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Edit2 size={16} />}
                        </button>
                    </div>
                    <input type="file" ref={mapInputRef} className="hidden" accept="image/*" onChange={handleMapUpload} />
                </div>
                
                {dayData.handDrawnMap ? (
                    <div className="w-full rounded-2xl overflow-hidden shadow-md border border-stone-100 bg-white cursor-pointer" onClick={() => onViewImage(dayData.handDrawnMap!)}>
                        <img src={dayData.handDrawnMap} alt="Journey Map" className="w-full h-auto object-cover" />
                    </div>
                ) : (
                    <button onClick={() => mapInputRef.current?.click()} disabled={isUploading} className="w-full h-48 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 text-stone-400 hover:bg-stone-50 hover:border-stone-300 transition-all disabled:opacity-50">
                        <ImageIcon size={32} className="opacity-50" />
                        <span className="text-sm font-medium">{isUploading ? '上傳中...' : '上傳手繪圖或筆記'}</span>
                    </button>
                )}
            </div>
            <div className="h-10" />
        </>
    );
};
