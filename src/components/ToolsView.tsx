
import React, { useState, useRef } from 'react';
import { Calculator, RefreshCcw, X, Phone, CreditCard, Car, Siren, ExternalLink, RotateCcw, CloudUpload, User, Gift, MessageCircle, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { useExchangeRate, useCloudSync } from '../hooks';
import { seedTripDataToFirebase } from '../lib/firebaseUtils';

// --- Types ---
interface CommToolItem {
    id: string;
    title: string;
    jp: string;
    tw: string;
    icon: string;
    color: string;
}

const INITIAL_COMM_TOOLS: CommToolItem[] = [
    { id: '1', title: '刷卡提示 (指指通)', jp: '円でお願いします', tw: '請用日元結帳', icon: 'card', color: 'bg-indigo-100 text-indigo-600' },
    { id: '2', title: '禮物包裝 (指指通)', jp: 'ギフト用です', tw: '這是禮物用的', icon: 'gift', color: 'bg-pink-100 text-pink-600' },
    { id: '3', title: '給司機看 (指指通)', jp: 'ここへ行ってください。', tw: '請載我到這裡 (搭配地圖使用)', icon: 'car', color: 'bg-emerald-100 text-emerald-600' },
];

// --- Reusable Components ---

const ToolsCard = ({ 
    icon: Icon, title, content, subContent, colorClass, onClick, onLongPress 
}: { 
    icon: any, title: string, content: string, subContent?: string, colorClass: string, onClick?: () => void, onLongPress?: () => void
}) => {
    // Long Press Logic
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTouchStart = () => {
        timerRef.current = setTimeout(() => {
            if (onLongPress) {
                if(navigator.vibrate) navigator.vibrate(50);
                onLongPress();
            }
        }, 600);
    };

    const handleTouchEnd = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    return (
      <button 
        onClick={onClick}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`w-full bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4 text-left transition-transform select-none ${onClick ? 'active:scale-[0.98] hover:bg-stone-50' : 'cursor-default'}`}
      >
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-stone-800 text-lg mb-1">{title}</h3>
            <p className="text-stone-500 text-sm font-medium leading-relaxed whitespace-pre-line">{content}</p>
            {subContent && <p className="text-stone-400 text-xs mt-2 font-mono">{subContent}</p>}
        </div>
      </button>
    );
};

const FullScreenMessageModal = ({ title, jpText, subText, onClose }: { title: string, jpText: string, subText: string, onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-fade-in" onClick={onClose}>
        <div className="absolute top-6 right-6 p-4 bg-stone-100 rounded-full cursor-pointer hover:bg-stone-200">
            <X size={32} className="text-stone-500" />
        </div>
        <p className="text-stone-400 mb-8 font-bold tracking-widest uppercase text-xs">Tap anywhere to close</p>
        <div className="w-full text-center space-y-6">
            <div className="inline-block px-4 py-1 bg-stone-100 rounded-full text-stone-500 text-sm font-bold mb-4">
                {title}
            </div>
            <h1 className="text-[10vw] font-black text-stone-900 leading-tight font-serif break-words px-2 whitespace-pre-line">
                {jpText}
            </h1>
            <div className="w-16 h-1 bg-stone-200 mx-auto rounded-full"></div>
            <p className="text-2xl text-stone-500 font-medium whitespace-pre-line">
                ( {subText} )
            </p>
        </div>
    </div>
);

const EditToolModal = ({ item, onClose, onSave, onDelete }: { item?: CommToolItem, onClose: () => void, onSave: (data: CommToolItem) => void, onDelete?: (id: string) => void }) => {
    const [form, setForm] = useState<Partial<CommToolItem>>({
        title: item?.title || '',
        jp: item?.jp || '',
        tw: item?.tw || '',
        icon: item?.icon || 'message',
        color: item?.color || 'bg-stone-100 text-stone-600'
    });

    const handleSubmit = () => {
        if (!form.title || !form.jp) return alert("請填寫標題與日文內容");
        onSave({
            id: item?.id || Date.now().toString(),
            title: form.title!,
            jp: form.jp!,
            tw: form.tw || '',
            icon: form.icon!,
            color: form.color!
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-stone-800">{item ? '編輯指指通' : '新增指指通'}</h3>
                    <button onClick={onClose}><X size={24} className="text-stone-400" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">標題</label>
                        <input type="text" className="w-full p-3 bg-stone-50 rounded-lg outline-none focus:ring-2 focus:ring-stone-200 font-bold" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="例如：少冰少糖" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">日文內容 (顯示於大字卡)</label>
                        <textarea className="w-full p-3 bg-stone-50 rounded-lg outline-none focus:ring-2 focus:ring-stone-200 h-24 font-bold text-lg" value={form.jp} onChange={e => setForm({...form, jp: e.target.value})} placeholder="氷少なめでお願いします" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">中文說明 (備註)</label>
                        <input type="text" className="w-full p-3 bg-stone-50 rounded-lg outline-none focus:ring-2 focus:ring-stone-200 text-sm" value={form.tw} onChange={e => setForm({...form, tw: e.target.value})} placeholder="請幫我做少冰，謝謝" />
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    {item && onDelete && (
                        <button onClick={() => { if(confirm('確定要刪除嗎？')) { onDelete(item.id); onClose(); }}} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button onClick={handleSubmit} className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                        <Save size={18} /> 儲存
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Helper ---
const getIconComponent = (name: string) => {
    switch(name) {
        case 'card': return CreditCard;
        case 'gift': return Gift;
        case 'car': return Car;
        default: return MessageCircle;
    }
};

// --- Main Component ---

export const ToolsView = ({ tripId, onReset }: { tripId?: string, onReset?: () => void }) => {
    const { rate, lastUpdated, fetchRate, loading } = useExchangeRate();
    const [calcAmount, setCalcAmount] = useState('');
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const [activeMessage, setActiveMessage] = useState<{ title: string, jp: string, tw: string } | null>(null);
    
    // Tools Management State
    // Use fallback ID if tripId not provided (though it should be)
    const effectiveTripId = tripId || 'hokkaido_trip';
    const [commTools, setCommTools] = useCloudSync<CommToolItem[]>('tools_comm_list', INITIAL_COMM_TOOLS, effectiveTripId);
    const [editingTool, setEditingTool] = useState<{ isOpen: boolean, item?: CommToolItem }>({ isOpen: false });

    const handleSaveTool = (item: CommToolItem) => {
        const exists = commTools.find(t => t.id === item.id);
        if (exists) {
            setCommTools(commTools.map(t => t.id === item.id ? item : t));
        } else {
            // Assign a random color for new items if default
            const colors = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-teal-100 text-teal-600', 'bg-purple-100 text-purple-600'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setCommTools([...commTools, { ...item, color: item.color === 'bg-stone-100 text-stone-600' ? randomColor : item.color }]);
        }
    };

    const handleDeleteTool = (id: string) => {
        setCommTools(commTools.filter(t => t.id !== id));
    };

    const handleSyncDefault = async () => {
        if (confirm("確定要將預設的行程資料寫入此旅程嗎？這將會覆蓋 Firebase 上的現有資料 (如果存在)。")) {
            alert("請回到首頁建立新旅程以套用預設資料。");
        }
    };

    return (
        <div className="pt-12 px-6 min-h-screen bg-stone-50/50 pb-32">
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-6">實用工具</h1>

            <div className="space-y-6">
                
                {/* 1. 匯率與計算 */}
                <section className="space-y-3">
                    <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">匯率工具</h2>
                    <ToolsCard 
                        icon={RefreshCcw}
                        title="即時匯率"
                        content={`1 JPY ≈ ${rate.toFixed(3)} TWD`}
                        subContent={`最後更新: ${lastUpdated || '尚無資料'}`}
                        colorClass="bg-blue-100 text-blue-600"
                        onClick={fetchRate}
                    />
                    <ToolsCard 
                        icon={Calculator}
                        title="匯率換算"
                        content="快速換算日幣至台幣"
                        subContent="點擊開啟計算機"
                        colorClass="bg-orange-100 text-orange-600"
                        onClick={() => setIsCalcOpen(true)}
                    />
                </section>

                {/* 2. 聯絡資訊 */}
                <section className="space-y-3">
                    <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">聯絡資訊</h2>
                    
                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                            <User size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-stone-800 text-lg mb-1">領隊：施經宇</h3>
                            <div className="space-y-2 mt-2">
                                <a href="tel:+886918899314" className="block p-2 bg-stone-50 rounded-lg flex items-center justify-between active:bg-stone-100">
                                    <span className="text-sm font-bold text-stone-600">🇹🇼 台灣手機</span>
                                    <span className="text-sm font-mono text-stone-800">0918-899-314</span>
                                </a>
                                <a href="tel:+818040705529" className="block p-2 bg-stone-50 rounded-lg flex items-center justify-between active:bg-stone-100">
                                    <span className="text-sm font-bold text-stone-600">🇯🇵 日本手機</span>
                                    <span className="text-sm font-mono text-stone-800">080-4070-5529</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a href="tel:110" className="block active:scale-[0.98] transition-transform">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center gap-2">
                                <div className="p-3 rounded-full bg-red-50 text-red-600">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-800">警察局</h3>
                                    <p className="text-2xl font-black text-stone-900 font-serif">110</p>
                                </div>
                            </div>
                        </a>
                        <a href="tel:119" className="block active:scale-[0.98] transition-transform">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center gap-2">
                                <div className="p-3 rounded-full bg-red-50 text-red-600">
                                    <Siren size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-800">救護/火警</h3>
                                    <p className="text-2xl font-black text-stone-900 font-serif">119</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </section>

                {/* 3. 旅行指指通 */}
                <section className="space-y-3">
                    <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">溝通與連結</h2>
                    
                    {commTools.map(item => (
                        <ToolsCard 
                            key={item.id}
                            icon={getIconComponent(item.icon)}
                            title={item.title}
                            content={item.jp}
                            subContent={item.tw}
                            colorClass={item.color}
                            onClick={() => setActiveMessage({
                                title: '指指通 (Point & Speak)',
                                jp: item.jp,
                                tw: item.tw
                            })}
                            onLongPress={() => setEditingTool({ isOpen: true, item: item })}
                        />
                    ))}

                    <button 
                        onClick={() => setEditingTool({ isOpen: true })}
                        className="w-full py-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 font-bold flex items-center justify-center gap-2 hover:bg-stone-50 hover:border-stone-300 transition-colors"
                    >
                        <Plus size={20} /> 新增指指通
                    </button>

                    <a href="https://vjw-lp.digital.go.jp/en/" target="_blank" rel="noreferrer" className="block active:scale-[0.98] transition-transform mt-4">
                        <div className="w-full bg-stone-900 p-5 rounded-2xl shadow-lg flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <ExternalLink size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Visit Japan Web</h3>
                                    <p className="text-stone-400 text-xs">入境申報與海關二維碼</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </section>
                
                {/* 4. Settings */}
                {onReset && (
                    <section className="space-y-3">
                         <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">資料管理</h2>
                         
                         <button onClick={onReset} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center gap-2 text-red-500 font-bold active:scale-[0.98] transition-transform hover:bg-red-50">
                             <RotateCcw size={18} />
                             重置所有資料 (Local Reset)
                         </button>
                    </section>
                )}
            </div>
            
            <div className="mt-12 text-center pb-8">
                 <p className="text-[10px] text-stone-300">Hokkaido Trip App • v1.3.1</p>
            </div>

            {/* Calculator Modal */}
            {isCalcOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsCalcOpen(false)}>
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <Calculator size={24} className="text-orange-500" />
                                匯率換算
                            </h3>
                            <button onClick={() => setIsCalcOpen(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><X size={20} /></button>
                        </div>
                        
                        <div className="bg-stone-50 p-4 rounded-2xl mb-4 border border-stone-100">
                            <label className="text-xs font-bold text-stone-400 block mb-2">日幣 (JPY)</label>
                            <input 
                                type="number" 
                                value={calcAmount} 
                                onChange={e => setCalcAmount(e.target.value)} 
                                className="w-full bg-transparent text-4xl font-mono font-bold text-stone-800 outline-none placeholder-stone-200"
                                placeholder="0"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-center my-2">
                            <div className="bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-stone-400">
                                x {rate.toFixed(4)}
                            </div>
                        </div>

                        <div className="bg-stone-900 p-4 rounded-2xl text-white">
                             <label className="text-xs font-bold text-stone-400 block mb-1">約合台幣 (TWD)</label>
                             <div className="text-4xl font-mono font-bold">
                                 {calcAmount ? Math.round(Number(calcAmount) * rate).toLocaleString() : '0'}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Screen Message Modal */}
            {activeMessage && (
                <FullScreenMessageModal 
                    title={activeMessage.title}
                    jpText={activeMessage.jp}
                    subText={activeMessage.tw}
                    onClose={() => setActiveMessage(null)}
                />
            )}

            {/* Edit Tool Modal */}
            {editingTool.isOpen && (
                <EditToolModal 
                    item={editingTool.item}
                    onClose={() => setEditingTool({ isOpen: false })}
                    onSave={handleSaveTool}
                    onDelete={handleDeleteTool}
                />
            )}
        </div>
    );
};
