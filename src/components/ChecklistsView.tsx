
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
    CheckSquare, ShoppingCart, Ticket, Plus, Trash2, X, Upload, 
    Calendar, Image as ImageIcon, Check, ChevronDown, ChevronUp, Edit2, Loader2, User, MinusCircle, LayoutGrid
} from 'lucide-react';
import { ChecklistItem, Coupon, UserData } from '../types';
import { useImageUpload, useDraggableScroll } from '../hooks';

// --- Confirm Delete Modal ---
const ConfirmDeleteModal = ({ title, text, onConfirm, onCancel }: { title: string, text: string, onConfirm: () => void, onCancel: () => void }) => {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4 animate-fade-in" onClick={onCancel}>
             <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl p-6 text-center" onClick={e => e.stopPropagation()}>
                 <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                     <Trash2 size={24} />
                 </div>
                 <h4 className="font-bold text-stone-800 text-lg mb-2">{title}</h4>
                 <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                     {text}
                 </p>
                 <div className="flex gap-3 w-full">
                     <button onClick={onCancel} className="flex-1 py-3 bg-stone-100 rounded-xl text-stone-600 font-bold text-sm hover:bg-stone-200 transition-colors">取消</button>
                     <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-red-600 transition-colors">確認刪除</button>
                 </div>
             </div>
        </div>
    );
}

// --- User Edit Modal ---
const UserEditModal = ({ user, onClose, onSave, onDelete }: { user: UserData, onClose: () => void, onSave: (name: string) => void, onDelete: () => void }) => {
    const [name, setName] = useState(user.name);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl p-6 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {showConfirm ? (
                    <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-6 animate-fade-in text-center">
                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
                            <Trash2 size={20} />
                        </div>
                        <h4 className="font-bold text-stone-800 text-base mb-2">刪除此旅伴？</h4>
                        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                            此操作將從清單中移除篩選選項，<br/>但不會刪除該使用者名下的項目。
                        </p>
                        <div className="flex gap-2 w-full">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 bg-stone-100 rounded-lg text-stone-600 font-bold text-xs hover:bg-stone-200 transition-colors">取消</button>
                            <button onClick={() => { onDelete(); onClose(); }} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold text-xs shadow-md hover:bg-red-600 transition-colors">確認刪除</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-bold mb-4 text-center">編輯旅伴</h3>
                        
                        <div className="flex justify-center mb-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${user.color}`}>
                                {name.charAt(0)}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-stone-400 mb-1 block">名字</label>
                            <input 
                                type="text" 
                                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-center font-bold text-stone-800 focus:outline-none focus:border-stone-400"
                                value={name} 
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setShowConfirm(true)} className="flex-1 py-2 text-red-400 font-bold hover:bg-red-50 rounded-lg flex items-center justify-center gap-1 transition-colors">
                                <Trash2 size={16} /> 刪除
                            </button>
                            <button onClick={() => { onSave(name); onClose(); }} className="flex-1 py-2 bg-stone-900 text-white rounded-lg font-bold shadow-md hover:bg-black transition-colors">
                                儲存
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- Modal for Editing Checklist Item ---
const ChecklistItemEditModal = ({ 
    item, 
    users, 
    existingCategories, 
    onClose, 
    onSave 
}: { 
    item: ChecklistItem, 
    users: UserData[], 
    existingCategories: string[], 
    onClose: () => void, 
    onSave: (id: string, updates: Partial<ChecklistItem>) => void 
}) => {
    const [text, setText] = useState(item.text);
    const [category, setCategory] = useState(item.category);
    const [owner, setOwner] = useState(item.owner || 'ALL');

    const handleSave = () => {
        if (!text.trim()) return;
        onSave(item.id, { text, category, owner });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl overflow-hidden p-5" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-stone-800 mb-4 text-center">編輯項目</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">項目名稱</label>
                        <input 
                            type="text" 
                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                            value={text} 
                            onChange={e => setText(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">分類</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                list="categories"
                                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            />
                            <datalist id="categories">
                                {existingCategories.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">負責人</label>
                        <div className="flex gap-2 flex-wrap">
                            <button 
                                onClick={() => setOwner('ALL')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${owner === 'ALL' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-400 border-stone-200'}`}
                            >
                                共用 (All)
                            </button>
                            {users.map(u => (
                                <button 
                                    key={u.id}
                                    onClick={() => setOwner(u.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${owner === u.id ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-400 border-stone-200'}`}
                                >
                                    {u.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button onClick={onClose} className="flex-1 py-2 text-stone-400 text-sm font-bold hover:bg-stone-50 rounded-lg">取消</button>
                    <button onClick={handleSave} className="flex-1 py-2 bg-stone-900 text-white rounded-lg text-sm font-bold shadow-md">儲存</button>
                </div>
            </div>
        </div>
    );
};

// --- Collapsible Category Component ---

interface CategorySectionProps {
    title: string;
    items: ChecklistItem[];
    users: UserData[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<ChecklistItem>) => void;
    onAdd: (text: string) => void;
    onViewImage: (img: string) => void;
    onEdit: (item: ChecklistItem) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
    title, 
    items, 
    users,
    onToggle, 
    onDelete, 
    onUpdate,
    onAdd,
    onViewImage,
    onEdit
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [newItemText, setNewItemText] = useState('');
    const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeItemRef = useRef<string | null>(null);
    
    // Long press logic
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleStart = (item: ChecklistItem) => {
        longPressTimer.current = setTimeout(() => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
            onEdit(item);
        }, 500); 
    };

    const handleEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };
    
    const { uploadImage, isUploading } = useImageUpload();

    const completedCount = items.filter(i => i.isChecked).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    const handleAdd = () => {
        if(newItemText.trim()) {
            onAdd(newItemText.trim());
            setNewItemText('');
        }
    };

    const handleUploadClick = (itemId: string) => {
        activeItemRef.current = itemId;
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const itemId = activeItemRef.current;
        
        if (file && itemId) {
            setUploadingItemId(itemId);
            const url = await uploadImage(file, 'checklists');
            if (url) {
                onUpdate(itemId, { image: url });
            }
            setUploadingItemId(null);
            activeItemRef.current = null;
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (itemId: string) => {
        if (window.confirm('確定要移除這張圖片嗎？')) {
            onUpdate(itemId, { image: undefined });
        }
    };

    return (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-3">
            <div 
                className="p-4 bg-stone-50 flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-stone-700">{title}</h3>
                    <div className="px-2 py-0.5 bg-white rounded-full text-[10px] font-bold text-stone-400 border border-stone-100">
                        {completedCount}/{items.length}
                    </div>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-stone-100 w-full">
                <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {isOpen && (
                <div className="p-2">
                    {items.map(item => {
                        const user = users.find(u => u.id === item.owner);
                        const userColor = user ? user.color.replace('text-', 'text-opacity-80 text-').replace('bg-', 'bg-') : 'bg-stone-200 text-stone-500';
                        const ownerLabel = user ? user.name.charAt(0) : (item.owner === 'ALL' ? 'Shared' : '');
                        const isItemUploading = uploadingItemId === item.id;

                        return (
                            <div 
                                key={item.id} 
                                className={`flex items-center justify-between p-3 rounded-lg mb-1 transition-colors select-none ${item.isChecked ? 'bg-stone-50' : 'hover:bg-stone-50 active:bg-stone-100'}`}
                                onTouchStart={() => handleStart(item)}
                                onTouchEnd={handleEnd}
                                onMouseDown={() => handleStart(item)}
                                onMouseUp={handleEnd}
                                onMouseLeave={handleEnd}
                            >
                                <div 
                                    className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                                    onClick={() => onToggle(item.id)}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${item.isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300'}`}>
                                        {item.isChecked && <Check size={12} className="text-white" />}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className={`text-sm font-medium transition-all break-words whitespace-pre-wrap pr-2 ${item.isChecked ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                                            {item.text}
                                        </span>
                                        {ownerLabel && (
                                            <div className="flex items-center mt-0.5">
                                                 <span className={`text-[9px] px-1.5 py-px rounded-full font-bold uppercase tracking-wider ${userColor} ${item.owner === 'ALL' ? 'bg-stone-100 text-stone-400' : ''}`}>
                                                     {item.owner === 'ALL' ? 'All' : ownerLabel}
                                                 </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
                                    {/* Image Logic */}
                                    {item.image ? (
                                        <div className="relative group">
                                            <img 
                                                src={item.image} 
                                                alt="item" 
                                                className="w-10 h-10 rounded-md object-cover border border-stone-200 cursor-pointer hover:opacity-90"
                                                onClick={() => onViewImage(item.image!)}
                                            />
                                            <button 
                                                onClick={() => handleRemoveImage(item.id)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-80 hover:opacity-100"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleUploadClick(item.id)}
                                            disabled={isItemUploading || isUploading}
                                            className="w-10 h-10 flex items-center justify-center rounded-md border border-dashed border-stone-300 text-stone-300 hover:text-stone-500 hover:border-stone-400 hover:bg-stone-100 transition-all disabled:opacity-50"
                                        >
                                            {isItemUploading ? <Loader2 size={16} className="animate-spin text-stone-400" /> : <ImageIcon size={18} />}
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => onDelete(item.id)}
                                        className="text-stone-300 hover:text-red-400 p-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="flex gap-2 mt-2 px-2 pb-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-stone-50 border-b border-stone-200 p-2 text-sm focus:outline-none focus:border-stone-400"
                            placeholder={`新增項目至 ${title}...`}
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <button 
                            onClick={handleAdd}
                            disabled={!newItemText.trim()}
                            className="text-stone-400 hover:text-stone-900 disabled:opacity-30"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Hidden File Input shared for this category section */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    );
};

// --- Checklist Tab with Grouping ---

const ChecklistTab = ({ 
    items, 
    users,
    onToggle, 
    onDelete, 
    onUpdate,
    onAdd,
    onViewImage,
    onEdit
}: { 
    items: ChecklistItem[], 
    users: UserData[],
    onToggle: (id: string) => void, 
    onDelete: (id: string) => void, 
    onUpdate: (id: string, updates: Partial<ChecklistItem>) => void,
    onAdd: (text: string, category: string) => void,
    onViewImage: (img: string) => void,
    onEdit: (item: ChecklistItem) => void
}) => {
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, ChecklistItem[]> = {};
        // Initialize default groups order if needed, but here we just map existing
        items.forEach(item => {
            const cat = item.category || '未分類';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [items]);

    const categories = Object.keys(groupedItems).sort((a, b) => {
        const order = [
            '重要證件與票卷',
            '隨身手提行李 (Must Carry On)',
            '托運行李 (Must Check In)',
            '3C 電子產品',
            '衣物與配件',
            '盥洗與日常用品',
            '藥物',
            '其他小物',
            '回台禁帶物品 (提醒)'
        ];
        // Handle variations (e.g. legacy categories)
        const normalize = (s: string) => {
             if (s.startsWith('隨身')) return '隨身手提行李 (Must Carry On)';
             if (s.startsWith('托運')) return '托運行李 (Must Check In)';
             return s;
        }

        const idxA = order.indexOf(a);
        const idxB = order.indexOf(b);
        
        // If both are in the known order list, sort by index
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        // If only A is known, A comes first
        if (idxA !== -1) return -1;
        // If only B is known, B comes first
        if (idxB !== -1) return 1;
        // Otherwise sort alphabetically
        return a.localeCompare(b);
    });

    return (
        <div className="space-y-4">
            {categories.map(cat => (
                <CategorySection 
                    key={cat}
                    title={cat}
                    items={groupedItems[cat]}
                    users={users}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onAdd={(text) => onAdd(text, cat)}
                    onViewImage={onViewImage}
                    onEdit={onEdit}
                />
            ))}

            {isAddingCategory ? (
                <div className="bg-white p-4 rounded-xl border border-dashed border-stone-300 flex gap-2">
                    <input 
                        type="text" 
                        className="flex-1 p-2 bg-stone-50 rounded border border-stone-200"
                        placeholder="新分類名稱 (例如: 電器)"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        autoFocus
                    />
                    <button onClick={() => {
                        if(newCategory.trim()) {
                            onAdd('新項目', newCategory.trim());
                            setNewCategory('');
                            setIsAddingCategory(false);
                        }
                    }} className="px-4 py-2 bg-stone-900 text-white rounded font-bold text-sm">確認</button>
                    <button onClick={() => setIsAddingCategory(false)} className="px-3 py-2 text-stone-400">取消</button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAddingCategory(true)}
                    className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 font-bold flex items-center justify-center gap-2 hover:bg-stone-50 hover:border-stone-300 transition-colors"
                >
                    <Plus size={20} /> 新增分類
                </button>
            )}
            
            <div className="h-10" />
        </div>
    );
};

// --- Coupon Components ---
const CouponModal = ({ coupon, onClose, onSave, onDelete }: { coupon?: Coupon, onClose: () => void, onSave: (c: Omit<Coupon, 'id'>) => void, onDelete?: () => void }) => {
    const [form, setForm] = useState({
        title: coupon?.title || '',
        description: coupon?.description || '',
        expiryDate: coupon?.expiryDate || '',
        image: coupon?.image || ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, isUploading } = useImageUpload();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await uploadImage(file, 'coupons');
            if (url) {
                setForm({ ...form, image: url });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">{coupon ? '編輯優惠券' : '新增優惠券'}</h3>
                    <button onClick={onClose}><X size={24} className="text-stone-400" /></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">店家 / 標題</label>
                        <input type="text" className="w-full p-2 border rounded-lg" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="例如: 唐吉訶德" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">優惠內容 / 說明</label>
                        <input type="text" className="w-full p-2 border rounded-lg" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="例如: 免稅 10% + 5%" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">有效期限</label>
                        <input type="date" className="w-full p-2 border rounded-lg" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">條碼 / QR Code 截圖</label>
                        <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center cursor-pointer hover:bg-stone-50" onClick={() => !isUploading && fileInputRef.current?.click()}>
                            {form.image ? (
                                <img src={form.image} className="max-h-32 mx-auto rounded" alt="coupon" />
                            ) : (
                                <div className="text-stone-400 flex flex-col items-center">
                                    {isUploading ? <Loader2 size={24} className="animate-spin mb-1" /> : <ImageIcon size={24} className="mb-1" />}
                                    <span className="text-xs">{isUploading ? '上傳中...' : '點擊上傳圖片'}</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    {coupon && onDelete && (
                        <button onClick={onDelete} disabled={isUploading} className="px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-lg mr-auto">刪除</button>
                    )}
                    <button onClick={onClose} disabled={isUploading} className="px-4 py-2 text-stone-500 font-bold">取消</button>
                    <button 
                        onClick={() => {
                            if(!form.title) return alert('請輸入標題');
                            onSave(form);
                            onClose();
                        }} 
                        disabled={isUploading}
                        className="px-6 py-2 bg-stone-900 text-white rounded-lg font-bold disabled:opacity-50"
                    >
                        {isUploading ? '處理中...' : '儲存'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CouponsTab = ({ coupons, onAdd, onUpdate, onDelete, onViewImage }: { 
    coupons: Coupon[], 
    onAdd: (c: Omit<Coupon, 'id'>) => void, 
    onUpdate: (id: string, c: Omit<Coupon, 'id'>) => void, 
    onDelete: (id: string) => void,
    onViewImage: (img: string) => void
}) => {
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                {coupons.map(coupon => (
                    <div key={coupon.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
                        <div className="p-4 flex gap-4 items-start">
                             <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                 <Ticket size={24} />
                             </div>
                             <div className="flex-1">
                                 <h3 className="font-bold text-lg text-stone-800">{coupon.title}</h3>
                                 <p className="text-sm text-stone-500 mb-2">{coupon.description}</p>
                                 {coupon.expiryDate && (
                                     <div className="inline-flex items-center gap-1 text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">
                                         <Calendar size={10} />
                                         <span>有效期至: {coupon.expiryDate}</span>
                                     </div>
                                 )}
                             </div>
                             <button onClick={() => setEditingCoupon(coupon)} className="text-stone-300 hover:text-stone-600 p-1">
                                 <Edit2 size={16} />
                             </button>
                        </div>
                        {coupon.image && (
                            <div className="bg-stone-50 p-4 border-t border-dashed border-stone-200 flex justify-center cursor-pointer hover:bg-stone-100 transition-colors" onClick={() => onViewImage(coupon.image!)}>
                                <img src={coupon.image} alt="Barcode" className="max-h-24 object-contain mix-blend-multiply" />
                            </div>
                        )}
                        {!coupon.image && (
                            <div className="bg-stone-50 p-2 border-t border-dashed border-stone-200 text-center text-xs text-stone-400">
                                無條碼圖片
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button 
                onClick={() => setIsAddOpen(true)}
                className="w-full mt-6 py-3 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 font-bold flex items-center justify-center gap-2 hover:bg-stone-50 hover:border-stone-300 transition-colors"
            >
                <Plus size={20} /> 新增優惠券
            </button>

            {isAddOpen && (
                <CouponModal 
                    onClose={() => setIsAddOpen(false)} 
                    onSave={onAdd} 
                />
            )}

            {editingCoupon && (
                <CouponModal 
                    coupon={editingCoupon}
                    onClose={() => setEditingCoupon(null)}
                    onSave={(data) => onUpdate(editingCoupon.id, data)}
                    onDelete={() => {
                        // Trigger deletion in parent to show confirm modal
                        onDelete(editingCoupon.id);
                        setEditingCoupon(null);
                    }}
                />
            )}
        </div>
    );
};

export const ChecklistsView = ({ 
    packingList, setPackingList, 
    shoppingList, setShoppingList, 
    coupons, setCoupons,
    onViewImage,
    users,
    onAddUser,
    onUpdateUser,
    onDeleteUser
}: {
    packingList: ChecklistItem[], setPackingList: (l: ChecklistItem[]) => void,
    shoppingList: ChecklistItem[], setShoppingList: (l: ChecklistItem[]) => void,
    coupons: Coupon[], setCoupons: (c: Coupon[]) => void,
    onViewImage: (img: string) => void,
    users: UserData[],
    onAddUser: () => void,
    onUpdateUser: (id: string, name: string) => void,
    onDeleteUser: (id: string) => void
}) => {
    const [activeTab, setActiveTab] = useState<'packing' | 'shopping' | 'coupons'>('packing');
    const [filterUser, setFilterUser] = useState('ALL');
    const [editingItem, setEditingItem] = useState<{ item: ChecklistItem, type: 'packing' | 'shopping' } | null>(null);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, type: 'packing' | 'shopping' | 'coupon', text: string } | null>(null);
    const filterScrollRef = useDraggableScroll();
    
    // Long Press Logic for Users
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPress = useRef(false);

    // Reset filter if user is deleted
    useEffect(() => {
        if (filterUser !== 'ALL' && !users.find(u => u.id === filterUser)) {
            setFilterUser('ALL');
        }
    }, [users, filterUser]);

    const handleTouchStart = (user: UserData) => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            setEditingUser(user);
            if (navigator.vibrate) navigator.vibrate(50);
        }, 600);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };

    const handleClickUser = (id: string) => {
        if (!isLongPress.current) {
            setFilterUser(id);
        }
    };

    // --- Filter Logic ---
    // If filter is ALL, show everything.
    // If filter is specific user, show items owned by that user OR items owned by ALL (Shared).
    const filterList = (list: ChecklistItem[]) => {
        if (filterUser === 'ALL') return list;
        return list.filter(item => item.owner === filterUser || item.owner === 'ALL' || !item.owner);
    };

    const filteredPackingList = useMemo(() => filterList(packingList), [packingList, filterUser]);
    const filteredShoppingList = useMemo(() => filterList(shoppingList), [shoppingList, filterUser]);

    // --- Handlers ---
    const toggleItem = (list: ChecklistItem[], setList: (l: ChecklistItem[]) => void, id: string) => {
        setList(list.map(item => item.id === id ? { ...item, isChecked: !item.isChecked } : item));
    };

    const updateItem = (list: ChecklistItem[], setList: (l: ChecklistItem[]) => void, id: string, updates: Partial<ChecklistItem>) => {
        setList(list.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const deleteItem = (list: ChecklistItem[], setList: (l: ChecklistItem[]) => void, id: string) => {
        setList(list.filter(item => item.id !== id));
    };

    const addItem = (list: ChecklistItem[], setList: (l: ChecklistItem[]) => void, text: string, category: string) => {
        // If filtering by a specific user, assign to them. If ALL, assign to ALL.
        const owner = filterUser === 'ALL' ? 'ALL' : filterUser;
        setList([...list, { id: Date.now().toString(), text, category, isChecked: false, owner }]);
    };

    const handleEditSave = (id: string, updates: Partial<ChecklistItem>) => {
        if (editingItem?.type === 'packing') {
            updateItem(packingList, setPackingList, id, updates);
        } else {
            updateItem(shoppingList, setShoppingList, id, updates);
        }
    };

    // --- Handlers for Coupons ---
    const addCoupon = (data: Omit<Coupon, 'id'>) => {
        setCoupons([...coupons, { ...data, id: Date.now().toString() }]);
    };

    const updateCoupon = (id: string, data: Omit<Coupon, 'id'>) => {
        setCoupons(coupons.map(c => c.id === id ? { ...data, id } : c));
    };

    const deleteCoupon = (id: string) => {
        setCoupons(coupons.filter(c => c.id !== id));
    };
    
    // --- Confirmation Handler ---
    const handleDeleteConfirm = () => {
        if (!deleteConfirmation) return;
        const { id, type } = deleteConfirmation;
        
        if (type === 'packing') deleteItem(packingList, setPackingList, id);
        if (type === 'shopping') deleteItem(shoppingList, setShoppingList, id);
        if (type === 'coupon') deleteCoupon(id);
        
        setDeleteConfirmation(null);
    };

    // Get unique categories for suggestion in modal
    const getCategories = (list: ChecklistItem[]) => Array.from(new Set(list.map(i => i.category || '未分類')));

    return (
        <div className="pt-12 px-6 min-h-screen bg-stone-50/50 pb-32">
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-6">準備清單</h1>

            {/* Sub-Navigation */}
            <div className="flex p-1 bg-stone-200 rounded-xl mb-6">
                <button 
                    onClick={() => setActiveTab('packing')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'packing' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    行李
                </button>
                <button 
                    onClick={() => setActiveTab('shopping')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'shopping' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    購物
                </button>
                <button 
                    onClick={() => setActiveTab('coupons')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'coupons' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    優惠券
                </button>
            </div>
            
            {/* User Filter (Only for Packing & Shopping) */}
            {activeTab !== 'coupons' && (
                <div ref={filterScrollRef} className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar select-none items-center">
                    <button onClick={() => setFilterUser('ALL')} className={`flex-shrink-0 px-4 h-8 rounded-full flex items-center justify-center text-[10px] font-bold tracking-wider transition-all border ${filterUser === 'ALL' ? 'bg-[#444] text-white border-[#444]' : 'bg-transparent text-[#999] border-[#e5e5e5]'}`}>ALL</button>
                    {users.map(user => (
                    <button 
                        key={user.id} 
                        onContextMenu={(e) => e.preventDefault()}
                        onMouseDown={() => handleTouchStart(user)}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                        onTouchStart={() => handleTouchStart(user)}
                        onTouchEnd={handleTouchEnd}
                        onClick={() => handleClickUser(user.id)} 
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border ${filterUser === user.id ? `bg-white border-[#666] text-[#444] shadow-sm` : 'bg-[#f5f5f4] text-[#ccc] border-transparent'} `}
                    >
                        {user.name.charAt(0)}
                    </button>
                    ))}
                     <div className="w-px h-6 bg-[#e5e5e5] mx-1"></div>
                     <button onClick={onAddUser} className="flex-shrink-0 w-8 h-8 rounded-full border border-dashed border-[#ccc] flex items-center justify-center text-[#ccc] hover:text-[#666] hover:border-[#666] transition-colors">
                         <Plus size={14} />
                     </button>
                </div>
            )}

            <div className="animate-fade-in">
                {activeTab === 'packing' && (
                    <ChecklistTab 
                        items={filteredPackingList}
                        users={users}
                        onToggle={(id) => toggleItem(packingList, setPackingList, id)}
                        onDelete={(id) => {
                            const item = packingList.find(i => i.id === id);
                            setDeleteConfirmation({ id, type: 'packing', text: item?.text || '此項目' });
                        }}
                        onUpdate={(id, updates) => updateItem(packingList, setPackingList, id, updates)}
                        onAdd={(text, cat) => addItem(packingList, setPackingList, text, cat)}
                        onViewImage={onViewImage}
                        onEdit={(item) => setEditingItem({ item, type: 'packing' })}
                    />
                )}

                {activeTab === 'shopping' && (
                    <ChecklistTab 
                        items={filteredShoppingList}
                        users={users}
                        onToggle={(id) => toggleItem(shoppingList, setShoppingList, id)}
                        onDelete={(id) => {
                            const item = shoppingList.find(i => i.id === id);
                            setDeleteConfirmation({ id, type: 'shopping', text: item?.text || '此項目' });
                        }}
                        onUpdate={(id, updates) => updateItem(shoppingList, setShoppingList, id, updates)}
                        onAdd={(text, cat) => addItem(shoppingList, setShoppingList, text, cat)}
                        onViewImage={onViewImage}
                        onEdit={(item) => setEditingItem({ item, type: 'shopping' })}
                    />
                )}

                {activeTab === 'coupons' && (
                    <CouponsTab 
                        coupons={coupons}
                        onAdd={addCoupon}
                        onUpdate={updateCoupon}
                        onDelete={(id) => {
                            const item = coupons.find(c => c.id === id);
                            setDeleteConfirmation({ id, type: 'coupon', text: item?.title || '此優惠券' });
                        }}
                        onViewImage={onViewImage}
                    />
                )}
            </div>

            {/* Checklist Item Edit Modal */}
            {editingItem && (
                <ChecklistItemEditModal 
                    item={editingItem.item}
                    users={users}
                    existingCategories={getCategories(editingItem.type === 'packing' ? packingList : shoppingList)}
                    onClose={() => setEditingItem(null)}
                    onSave={handleEditSave}
                />
            )}

            {/* User Edit Modal */}
            {editingUser && (
               <UserEditModal 
                   user={editingUser} 
                   onClose={() => setEditingUser(null)} 
                   onSave={(name) => onUpdateUser(editingUser.id, name)}
                   onDelete={() => onDeleteUser(editingUser.id)}
               />
            )}

            {/* Confirmation Modal */}
            {deleteConfirmation && (
                <ConfirmDeleteModal 
                    title="確定要刪除嗎？"
                    text={`將刪除「${deleteConfirmation.text}」，此操作無法復原。`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteConfirmation(null)}
                />
            )}
        </div>
    );
};
