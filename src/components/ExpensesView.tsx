
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Wallet, RefreshCcw, User, Receipt, Plus, Edit2, Trash2, Camera, ShoppingBag, TrendingUp, PieChart, Calendar, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Expense, UserData } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { useDraggableScroll, useExchangeRate, useImageUpload } from '../hooks';

// --- Muji Style Constants ---
const MUJI_COLORS: Record<string, string> = {
    food: 'text-[#8c5e2e] bg-[#fdf6ec] border-[#eaddcf]', 
    transport: 'text-[#4a6c6f] bg-[#eff5f5] border-[#d6e3e3]', 
    shopping: 'text-[#8e443d] bg-[#f9ebeb] border-[#e8d0cf]', 
    ticket: 'text-[#5f6b3e] bg-[#f1f4e8] border-[#dce3ca]', 
    stay: 'text-[#4b5563] bg-[#f3f4f6] border-[#e5e7eb]', 
    other: 'text-[#78716c] bg-[#f5f5f4] border-[#e7e5e4]', 
};

const MUJI_BAR_COLORS: Record<string, string> = {
    food: '#cfa678', 
    transport: '#8ebdb6', 
    shopping: '#d48a82', 
    ticket: '#aab88d', 
    stay: '#9ca3af', 
    other: '#d6d3d1', 
};

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
                            相關的記帳紀錄將會保留，<br/>但無法再篩選此人的項目。
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

// --- Expense Item Component ---
const ExpenseItem = React.memo(({ expense, onViewImage, onEdit, userColor, rate, users }: { expense: Expense, onViewImage: (img: string) => void, onEdit: () => void, userColor: string, rate: number, users: UserData[] }) => {
    const categoryConfig = EXPENSE_CATEGORIES.find(c => c.value === expense.category) || EXPENSE_CATEGORIES[5]; 
    const CategoryIcon = categoryConfig.icon;
    
    const mujiStyle = MUJI_COLORS[expense.category] || MUJI_COLORS['other'];

    const approxTWD = expense.currency === 'JPY' ? Math.round(expense.amount * rate) : expense.amount;
    const isJPY = expense.currency === 'JPY';
    
    // 根據 payer id 找到對應的 user name
    const payerUser = users.find(u => u.id === expense.payer);
    const payerName = payerUser?.name || expense.payer;

    return (
      <div 
        className="flex items-center justify-between py-4 border-b border-[#e5e5e5] last:border-0 active:bg-[#f5f5f4] transition-colors px-2 rounded-lg select-none group cursor-pointer"
        onClick={onEdit}
      >
        <div className="flex items-center gap-4 overflow-hidden flex-1">
           <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center border ${mujiStyle} transition-transform group-hover:scale-105`}>
             <CategoryIcon size={18} strokeWidth={1.5} />
           </div>
           
           <div className="min-w-0 flex-1">
             <p className="font-medium text-[#2d2d2d] text-[15px] mb-1 flex items-center gap-2 leading-none tracking-wide">
                 <span className="truncate">{expense.title}</span>
                 {expense.image && (
                     <button onClick={(e) => { e.stopPropagation(); onViewImage(expense.image!); }} className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors flex-shrink-0">
                         <Receipt size={12} />
                     </button>
                 )}
             </p>
             <div className="flex items-center gap-2">
                 <span className={`text-[10px] px-1.5 py-px rounded border border-stone-200 text-stone-500 font-mono flex items-center gap-1 bg-white`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${userColor.replace('bg-', 'bg-').replace('100', '400')}`}></span>
                    {payerName}
                 </span>
                 <span className="text-[10px] text-[#888] font-mono tracking-wider">{expense.date}</span>
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3 pl-2 flex-shrink-0">
            <div className="text-right">
               <div className="font-serif font-medium text-[#2d2d2d] flex items-baseline justify-end gap-1 text-lg tracking-tight">
                 <span className="text-[10px] text-[#999] font-sans font-normal tracking-widest">{expense.currency}</span>
                 {expense.amount.toLocaleString()}
               </div>
               {isJPY && (
                 <p className="text-[10px] text-[#999] font-serif mt-0.5">≈ NT$ {approxTWD.toLocaleString()}</p>
               )}
            </div>
            <div className="w-6 flex justify-center text-stone-300">
                 <ChevronRight size={16} /> 
            </div>
        </div>
      </div>
    );
});

// --- Category Stats Component ---
const CategoryStats = ({ expenses, totalTWD, rate }: { expenses: Expense[], totalTWD: number, rate: number }) => {
    const stats = useMemo(() => {
        const breakdown: Record<string, number> = {};
        expenses.forEach(e => {
            const amount = e.currency === 'JPY' ? e.amount * rate : e.amount;
            breakdown[e.category] = (breakdown[e.category] || 0) + amount;
        });
        return breakdown;
    }, [expenses, rate]);

    if (totalTWD === 0) return null;

    return (
        <div className="mb-8 mt-2">
            <div className="flex items-center gap-2 mb-3 text-[#555] font-bold text-xs tracking-widest uppercase">
                <PieChart size={12} />
                <span>支出構成</span>
            </div>
            <div className="h-2 w-full flex overflow-hidden bg-[#eee] rounded-sm">
                {EXPENSE_CATEGORIES.map(cat => {
                    const amount = stats[cat.value] || 0;
                    const percent = (amount / totalTWD) * 100;
                    if (percent === 0) return null;
                    return (
                        <div key={cat.value} style={{ width: `${percent}%`, backgroundColor: MUJI_BAR_COLORS[cat.value] }} className="border-r border-white last:border-0" />
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                {EXPENSE_CATEGORIES.map(cat => {
                    const amount = stats[cat.value] || 0;
                    if (amount === 0) return null;
                    return (
                        <div key={cat.value} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MUJI_BAR_COLORS[cat.value] }} />
                            <span className="text-[10px] text-[#666]">{cat.label}</span>
                            <span className="text-[10px] font-mono text-[#999]">{Math.round((amount/totalTWD)*100)}%</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

// --- Add/Edit Expense Modal ---
const AddExpenseModal = ({ onClose, onSave, onDelete, users, initialData }: { onClose: () => void, onSave: (expense: Omit<Expense, 'id'>) => void, onDelete?: (id: number) => void, users: UserData[], initialData?: Expense }) => {
    const { uploadImage, isUploading } = useImageUpload();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const getLocalDate = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };
    const parseDateForInput = (dateStr?: string) => {
        if (!dateStr || dateStr === 'Pre-trip') return getLocalDate();
        const currentYear = new Date().getFullYear();
        const parsed = Date.parse(`${dateStr} ${currentYear}`);
        if (!isNaN(parsed)) {
            const d = new Date(parsed);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            return d.toISOString().split('T')[0];
        }
        return getLocalDate();
    };

    const [form, setForm] = useState({
        title: initialData?.title || '',
        amount: initialData?.amount.toString() || '',
        payer: initialData?.payer || users[0]?.id || 'K',
        currency: initialData?.currency || 'JPY' as 'JPY' | 'TWD',
        image: initialData?.image || '' as string,
        category: initialData?.category || 'food' as Expense['category'],
        date: parseDateForInput(initialData?.date)
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await uploadImage(file, 'expenses');
            if (url) {
                setForm({ ...form, image: url });
            }
        }
    };

    const handleSubmit = () => {
        if (!form.title || !form.amount) return alert('請填寫完整資訊');
        const dateObj = new Date(form.date);
        const formattedDate = dateObj.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
        onSave({
            title: form.title,
            amount: Number(form.amount),
            payer: form.payer,
            currency: form.currency,
            date: formattedDate,
            image: form.image,
            category: form.category
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[#faf9f6] w-full max-w-md rounded-xl shadow-xl p-6 overflow-hidden flex flex-col max-h-[90vh] border border-[#e5e5e5] relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-base font-bold mb-6 flex-shrink-0 text-center text-[#444] tracking-widest uppercase">{initialData ? '編輯' : '新增'}</h3>

                {/* Confirmation Overlay */}
                {showDeleteConfirm && (
                     <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                         <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                             <Trash2 size={24} />
                         </div>
                         <h4 className="font-bold text-stone-800 text-lg mb-2">確定要刪除嗎？</h4>
                         <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                             刪除「{initialData?.title}」後將無法復原。<br/>
                             金額 {initialData?.currency} {initialData?.amount} 將從總帳中移除。
                         </p>
                         <div className="flex gap-3 w-full">
                             <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-stone-100 rounded-xl text-stone-600 font-bold text-sm hover:bg-stone-200 transition-colors">取消</button>
                             <button onClick={() => onDelete && onDelete(initialData!.id)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-red-600 transition-colors">確認刪除</button>
                         </div>
                     </div>
                )}
                
                <div className="space-y-6 overflow-y-auto flex-1 hide-scrollbar pb-2 px-1">
                    {/* Amount & Currency */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full flex justify-center items-baseline gap-2 mb-2">
                            <input 
                                type="number" 
                                className="w-full text-center bg-transparent text-5xl font-serif text-[#2d2d2d] outline-none placeholder-stone-200" 
                                placeholder="0" 
                                value={form.amount} 
                                onChange={e => setForm({...form, amount: e.target.value})} 
                                autoFocus={!initialData}
                            />
                        </div>
                        <div className="flex bg-[#edece8] rounded-md p-1 gap-1">
                             {['JPY', 'TWD'].map(cur => (
                                 <button
                                    key={cur}
                                    onClick={() => setForm({...form, currency: cur as any})}
                                    className={`px-4 py-1 rounded-sm text-xs font-bold transition-all ${form.currency === cur ? 'bg-white text-[#444] shadow-sm' : 'text-[#999]'}`}
                                 >
                                     {cur}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        <div className="col-span-3">
                            <label className="block text-[10px] font-bold text-[#999] mb-1 uppercase tracking-wider">項目名稱</label>
                            <input type="text" className="w-full p-3 bg-white border border-[#e5e5e5] rounded-lg outline-none focus:border-[#ccc] transition-colors text-[#444]" placeholder="例如：便利商店" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                             <label className="block text-[10px] font-bold text-[#999] mb-1 uppercase tracking-wider">日期</label>
                             <input 
                                type="date" 
                                className="w-full p-3 bg-white border border-[#e5e5e5] rounded-lg outline-none focus:border-[#ccc] transition-colors text-center font-mono text-[#666] text-sm" 
                                value={form.date} 
                                onChange={e => setForm({...form, date: e.target.value})} 
                             />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-[#999] mb-2 uppercase tracking-wider">類別</label>
                        <div className="grid grid-cols-3 gap-2">
                            {EXPENSE_CATEGORIES.map(cat => {
                                const Icon = cat.icon;
                                const isSelected = form.category === cat.value;
                                return (
                                    <button 
                                        key={cat.value}
                                        onClick={() => setForm({...form, category: cat.value as any})}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${isSelected ? `bg-[#444] text-white border-[#444]` : 'bg-white text-[#999] border-[#e5e5e5] hover:border-[#ccc]'}`}
                                    >
                                        <Icon size={18} className="mb-1" strokeWidth={1.5} />
                                        <span className="text-[10px] tracking-widest">{cat.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-[#999] mb-2 uppercase tracking-wider">付款人</label>
                        <div className="flex justify-center gap-3 overflow-x-auto p-2 hide-scrollbar">
                            {users.map(u => (
                                <button 
                                    key={u.id}
                                    onClick={() => setForm({...form, payer: u.id})}
                                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 border ${form.payer === u.id ? `bg-[#444] text-white border-[#444]` : 'bg-white text-[#ccc] border-[#e5e5e5]'}`}
                                >
                                    {u.name.charAt(0)}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="flex justify-between items-center text-[10px] font-bold text-[#999] mb-1 uppercase tracking-wider">
                            <span>收據 / 圖片</span>
                            {form.image && <button onClick={() => setForm({...form, image: ''})} className="text-[#999] flex items-center gap-1 hover:text-red-400"><Trash2 size={12}/> 清除</button>}
                        </label>
                        
                        <div className="mt-1">
                             {!form.image ? (
                                 <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    disabled={isUploading}
                                    className="w-full border border-dashed border-[#ccc] rounded-lg h-16 flex flex-col items-center justify-center gap-1 text-[#aaa] hover:bg-[#f0f0f0] transition-colors disabled:opacity-50"
                                 >
                                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                                    <span className="text-xs">{isUploading ? '上傳中...' : '拍照或上傳'}</span>
                                 </button>
                             ) : (
                                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[#e5e5e5] group">
                                     <img src={form.image} className="w-full h-full object-cover" alt="receipt" />
                                     <button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={isUploading}
                                        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                         <Edit2 size={24} className="mb-1" />
                                         <span className="text-xs">{isUploading ? '上傳中' : '更換圖片'}</span>
                                     </button>
                                </div>
                             )}
                             <input 
                                 type="file" 
                                 ref={fileInputRef} 
                                 className="hidden" 
                                 accept="image/*" 
                                 onChange={handleImageUpload} 
                             />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 flex-shrink-0 pt-4 border-t border-[#e5e5e5]">
                    {initialData && onDelete && (
                        <button onClick={() => setShowDeleteConfirm(true)} disabled={isUploading} className="px-4 py-2 text-red-400 text-sm hover:bg-red-50 rounded-md transition-colors mr-auto font-bold flex items-center gap-1">
                            <Trash2 size={14} /> 刪除
                        </button>
                    )}
                    <button onClick={onClose} disabled={isUploading} className="px-4 py-2 text-[#888] text-sm hover:text-[#444] transition-colors">取消</button>
                    <button onClick={handleSubmit} disabled={isUploading} className="px-6 py-2 bg-[#2d2d2d] text-white rounded-md text-sm shadow-sm hover:bg-[#000] transition-colors disabled:opacity-50">
                        {isUploading ? '處理中' : (initialData ? '儲存' : '新增')}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ExpensesViewProps {
    expenses: Expense[];
    users: UserData[];
    onSaveExpense: (expense: Omit<Expense, 'id'>, id?: number) => void;
    onDeleteExpense: (id: number) => void;
    onAddUser: () => void;
    onViewImage: (img: string) => void;
    onUpdateUser: (id: string, name: string) => void;
    onDeleteUser: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, users, onSaveExpense, onDeleteExpense, onAddUser, onViewImage, onUpdateUser, onDeleteUser }) => {
    const [expenseFilter, setExpenseFilter] = useState('ALL');
    const [modalData, setModalData] = useState<{ isOpen: boolean, editingExpense?: Expense }>({ isOpen: false });
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const expenseScrollRef = useDraggableScroll();
    const { rate, lastUpdated, fetchRate, loading } = useExchangeRate();
    
    // Long Press Refs
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPress = useRef(false);

    // Reset filter if the filtered user is deleted
    useEffect(() => {
        if (expenseFilter !== 'ALL' && !users.find(u => u.id === expenseFilter)) {
            setExpenseFilter('ALL');
        }
    }, [users, expenseFilter]);

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
            setExpenseFilter(id);
        }
    };

    const filteredExpenses = expenseFilter === 'ALL' ? expenses : expenses.filter(e => e.payer === expenseFilter);
    
    const { totalJPY, totalTWD } = useMemo(() => {
        let tJPY = 0;
        let tTWD = 0;
        filteredExpenses.forEach(item => {
            if (item.currency === 'JPY') {
                tJPY += item.amount;
                tTWD += item.amount * rate;
            } else {
                tTWD += item.amount;
                tJPY += item.amount / rate;
            }
        });
        return { totalJPY: tJPY, totalTWD: tTWD };
    }, [filteredExpenses, rate]);

    const handleSave = (data: Omit<Expense, 'id'>) => {
        onSaveExpense(data, modalData.editingExpense?.id);
        setModalData({ isOpen: false });
    };

    const handleDelete = (id: number) => {
        onDeleteExpense(id);
        setModalData({ isOpen: false });
    };

    return (
        <div className="pt-12 px-6 min-h-screen bg-[#faf9f6]">
           {/* Minimal Header */}
           <div className="flex items-center justify-between mb-8">
               <div>
                   <h1 className="text-xl font-serif font-bold text-[#2d2d2d] tracking-wide">旅行帳本</h1>
                   <p className="text-[#999] text-[10px] font-normal tracking-[0.2em] uppercase mt-1">Shared Wallet</p>
               </div>
               <button 
                    onClick={() => setModalData({ isOpen: true })}
                    className="w-10 h-10 bg-[#2d2d2d] rounded-full text-white flex items-center justify-center shadow-lg hover:bg-[#000] active:scale-95 transition-all"
               >
                   <Plus size={20} strokeWidth={1.5} />
               </button>
           </div>
           
           {/* Muji Style Asset Card */}
           <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-3 bg-[#e8e6e1]/50 -mt-1.5 backdrop-blur-[1px] rotate-[-1deg] rounded-sm"></div>

                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#888] tracking-widest uppercase mb-1">Total Expenses</span>
                        <h2 className="text-3xl font-serif font-medium text-[#2d2d2d] tracking-tight">
                            <span className="text-sm align-top mr-1">TWD</span>
                            {Math.round(totalTWD).toLocaleString()}
                        </h2>
                    </div>
                    <div className="text-right">
                         <span className="text-[10px] text-[#aaa] tracking-widest uppercase mb-1 block">JPY Est.</span>
                         <span className="text-lg font-serif text-[#666]">¥{Math.round(totalJPY).toLocaleString()}</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-[#e5e5e5] pt-3 flex justify-between items-center">
                     <div className="flex items-center gap-1.5 text-[10px] text-[#999]">
                         <Calendar size={12} />
                         <span>{new Date().toLocaleDateString('zh-TW')}</span>
                     </div>
                     <button onClick={fetchRate} disabled={loading} className="flex items-center gap-1.5 text-[10px] font-mono text-[#888] bg-[#f5f5f4] px-2 py-1 rounded-sm hover:bg-[#eee] transition-colors">
                         <RefreshCcw size={10} className={loading ? 'animate-spin' : ''} />
                         <span>1 JPY ≈ {rate.toFixed(3)}</span>
                     </button>
                </div>
           </div>
           
           {/* Minimal Filters */}
           <div ref={expenseScrollRef} className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar select-none items-center">
             <button onClick={() => setExpenseFilter('ALL')} className={`flex-shrink-0 px-4 h-8 rounded-full flex items-center justify-center text-[10px] font-bold tracking-wider transition-all border ${expenseFilter === 'ALL' ? 'bg-[#444] text-white border-[#444]' : 'bg-transparent text-[#999] border-[#e5e5e5]'}`}>ALL</button>
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
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border ${expenseFilter === user.id ? `bg-white border-[#666] text-[#444] shadow-sm` : 'bg-[#f5f5f4] text-[#ccc] border-transparent'} `}
               >
                   {user.name.charAt(0)}
               </button>
             ))}
             <div className="w-px h-6 bg-[#e5e5e5] mx-1"></div>
             <button onClick={onAddUser} className="flex-shrink-0 w-8 h-8 rounded-full border border-dashed border-[#ccc] flex items-center justify-center text-[#ccc] hover:text-[#666] hover:border-[#666] transition-colors">
                 <Plus size={14} />
             </button>
           </div>
           
           <CategoryStats expenses={filteredExpenses} totalTWD={totalTWD} rate={rate} />

           {/* Expense List */}
           <div className="space-y-1 pb-40">
             <div className="flex items-center gap-2 mb-3 px-1 border-b border-[#eee] pb-2">
                 <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Recent Activity</span>
             </div>
             
             {filteredExpenses.map(expense => (
                 <ExpenseItem 
                    key={expense.id} 
                    expense={expense} 
                    onViewImage={onViewImage} 
                    onEdit={() => setModalData({ isOpen: true, editingExpense: expense })}
                    userColor={users.find(u => u.id === expense.payer)?.color || 'bg-gray-100'}
                    rate={rate}
                    users={users}
                 />
             ))}

             {filteredExpenses.length === 0 && (
                 <div className="text-center py-16">
                     <div className="w-12 h-12 rounded-full border border-dashed border-[#ccc] flex items-center justify-center mx-auto mb-3 text-[#ccc]">
                         <ShoppingBag size={20} />
                     </div>
                     <p className="text-[#999] text-xs font-medium tracking-widest">NO DATA</p>
                 </div>
             )}
           </div>

           {modalData.isOpen && (
               <AddExpenseModal
                   onClose={() => setModalData({ isOpen: false })}
                   onSave={handleSave}
                   onDelete={handleDelete}
                   users={users}
                   initialData={modalData.editingExpense}
               />
           )}

           {editingUser && (
               <UserEditModal 
                   user={editingUser} 
                   onClose={() => setEditingUser(null)} 
                   onSave={(name) => onUpdateUser(editingUser.id, name)}
                   onDelete={() => onDeleteUser(editingUser.id)}
               />
           )}
        </div>
    );
};
