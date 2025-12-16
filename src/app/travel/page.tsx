'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, MapPin, CloudSun, Train, Utensils, Camera, 
  BedDouble, Phone, Copy, X, ChevronRight, ChevronDown, Wallet, 
  AlertTriangle, Car, Navigation, User, Shirt, Sun, Cloud, CloudRain, Plane, ShoppingBag,
  CloudSnow, CloudFog, CloudLightning, Loader2, Wine, Coffee, Eye, Edit2, Save, Plus, Trash2, Upload, Image as ImageIcon,
  Ticket
} from 'lucide-react';
import { WeatherCode, Activity, FlightInfo, DetailedInfo, Expense } from '../../types';
import { LucideIcon } from 'lucide-react';

// --- Constants & API Config ---

const LOCATION_COORDS = {
  '登別': { lat: 42.4111, lng: 141.1064 },
  '函館': { lat: 41.7687, lng: 140.7291 },
  '洞爺湖': { lat: 42.5896, lng: 140.8257 },
  '札幌': { lat: 43.0618, lng: 141.3545 },
  '小樽': { lat: 43.1907, lng: 140.9947 },
} as const;

type LocationKey = keyof typeof LOCATION_COORDS;

const getWeatherInfo = (code: WeatherCode) => {
  if (code === 0) return { icon: Sun, label: '晴朗', color: 'text-orange-500' };
  if ([1, 2, 3].includes(code)) return { icon: CloudSun, label: '多雲時晴', color: 'text-blue-400' };
  if ([45, 48].includes(code)) return { icon: CloudFog, label: '有霧', color: 'text-stone-400' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: CloudRain, label: '下雨', color: 'text-blue-600' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: CloudSnow, label: '下雪', color: 'text-cyan-400' };
  if ([95, 96, 99].includes(code)) return { icon: CloudLightning, label: '雷雨', color: 'text-purple-500' };
  return { icon: Cloud, label: '多雲', color: 'text-gray-500' };
};

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

// --- Helper Hook for Drag-to-Scroll ---
const useDraggableScroll = () => {
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

const USERS = [
  { id: 'K', name: 'Ken', color: 'bg-blue-100 text-blue-700' },
  { id: 'M', name: 'Mary', color: 'bg-rose-100 text-rose-700' },
  { id: 'E', name: 'Eric', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'G', name: 'Grace', color: 'bg-amber-100 text-amber-700' },
];

// --- Expense Item Component ---
interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  const user = USERS.find(u => u.id === expense.payer);
  const userColor = user?.color || 'bg-gray-100 text-gray-700';
  const amountInTWD = expense.currency === 'JPY' ? expense.amount * 0.22 : expense.amount;
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${userColor}`}>
          {expense.payer}
        </div>
        <div className="flex-1">
          <p className="font-medium text-stone-800">{expense.title}</p>
          <p className="text-xs text-stone-400">{expense.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-stone-800">
          {expense.currency} {expense.amount.toLocaleString()}
        </p>
        {expense.currency === 'JPY' && (
          <p className="text-xs text-stone-400">≈ ${Math.round(amountInTWD).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

const EXPENSES: Expense[] = [
  { id: 1, title: '團費訂金', amount: 40000, payer: 'K', currency: 'TWD', date: 'Pre-trip', category: 'other' },
  { id: 2, title: '白色戀人伴手禮', amount: 5400, payer: 'M', currency: 'JPY', date: 'Dec 23', category: 'shopping' },
  { id: 3, title: '函館朝市海鮮丼', amount: 8500, payer: 'K', currency: 'JPY', date: 'Dec 22', category: 'food' },
  { id: 4, title: '便利商店零食', amount: 1200, payer: 'E', currency: 'JPY', date: 'Dec 20', category: 'food' },
];

// --- Tools Card Component ---
interface ToolsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  content: string;
  colorClass: string;
  onClick: () => void;
}

const ToolsCard = ({ icon: Icon, title, content, colorClass, onClick }: ToolsCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`${colorClass} p-4 rounded-xl border-2 border-current/20 hover:border-current/40 transition-all active:scale-95 flex flex-col items-center justify-center gap-2`}
    >
      <Icon size={24} />
      <span className="font-bold text-sm">{title}</span>
      <span className="text-lg font-mono font-bold">{content}</span>
    </button>
  );
};

// --- INITIAL ITINERARY DATA ---
type DayKey = 'Dec 20 Sat' | 'Dec 21 Sun' | 'Dec 22 Mon' | 'Dec 23 Tue' | 'Dec 24 Wed' | 'Dec 25 Thu';

interface DayData {
  location: string;
  dayLabel: string;
  heroImage: string;
  title: string;
  subtitle: string;
  clothing: string;
  handDrawnMap?: string | null;
  activities: any[];
  [key: string]: any;
}

const INITIAL_ITINERARY_DATA: Record<DayKey, DayData> = {
  'Dec 20 Sat': {
    location: '登別',
    dayLabel: 'Day 1', 
    heroImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800',
    title: 'Day 1 抵達北海道',
    subtitle: '支笏湖與登別溫泉',
    clothing: '北海道氣溫較低，建議穿著保暖大衣、圍巾及手套。',
    handDrawnMap: null, 
    activities: [
      {
        id: '101',
        time: '08:00',
        type: 'flight',
        title: '出發：高雄 -> 新千歲',
        subtitle: 'IT260 KHH -> CTS',
        japaneseName: '新千歳空港',
        TaiwanName: '新千歲機場',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800',
        flightInfo: {
            date: '2025/12/20 (六)',
            airline: '台灣虎航',
            flightNo: 'IT260',
            bookingCode: 'KHH888',
            dep: { city: '高雄', code: 'KHH', time: '08:00', terminal: 'Int' },
            arr: { city: '札幌', code: 'CTS', time: '12:55', terminal: 'Int' },
            duration: '3h 55m'
        },
        detailedInfo: [
            { title: '集合', content: '請於起飛前 2.5 小時抵達高雄小港機場國際線櫃檯集合。' }
        ]
      },
      {
        id: '102',
        time: '13:30',
        type: 'food',
        title: '午餐：機上精緻簡餐',
        subtitle: '高空美味',
        japaneseName: '機内食',
        TaiwanName: '機上餐',
        image: 'https://images.unsplash.com/photo-1542296332-2e44a99cfef9?auto=format&fit=crop&w=800', 
        detailedInfo: [{ title: '內容', content: '享用航空公司準備的精緻機上料理。' }]
      },
      {
        id: '103',
        time: '15:30',
        type: 'sightseeing',
        title: '支笏湖',
        subtitle: '日本第二深的不凍湖',
        japaneseName: '支笏湖',
        TaiwanName: '支笏湖',
        address: '北海道千歳市支笏湖温泉',
        image: 'https://images.unsplash.com/photo-1610684526770-4c43c20262a2?auto=format&fit=crop&w=800',
        parking: '支笏湖畔停車場',
        gpsPhone: '0123-25-2401',
        detailedInfo: [
            { title: '地理特色', content: '位於支笏洞爺國立公園，是三萬年前火山運動後的火口湖，水深達363公尺。' },
            { title: '不凍湖', content: '因湖水極深，即使在嚴冬也不會結冰，透明度極高，有「支笏湖藍」之美稱。' }
        ]
      },
      {
        id: '104',
        time: '17:30',
        type: 'sightseeing',
        title: '登別溫泉鄉',
        subtitle: '溫泉之夜 & 閻魔王變臉',
        japaneseName: '登別温泉',
        TaiwanName: '登別溫泉',
        image: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800',
        detailedInfo: [
            { title: '極樂通商店街', content: '晚餐後建議穿著浴衣漫步於極樂通商店街，感受獨特的溫泉氛圍。' },
            { title: '閻魔堂', content: '欣賞定時演出的「閻魔王變臉秀」，機關人偶的表情變化非常有趣。' }
        ]
      },
      {
        id: '105',
        time: '18:30',
        type: 'food',
        title: '晚餐：總匯自助餐或會席料理',
        subtitle: '飯店內享用',
        japaneseName: '夕食：ビュッフェ',
        TaiwanName: '飯店晚餐',
        image: 'https://images.unsplash.com/photo-1578425673526-8849727228eb?auto=format&fit=crop&w=800',
        detailedInfo: [
            { title: '餐食內容', content: '於飯店內享用豐盛的北海道總匯自助餐，或精緻的迎賓會席料理（視飯店安排）。' }
        ]
      },
      {
        id: '106',
        time: '20:00',
        type: 'hotel',
        title: '登別雅亭溫泉飯店',
        subtitle: '或 石水亭 或 同級',
        japaneseName: '登別 石水亭',
        TaiwanName: '登別溫泉飯店',
        image: 'https://images.unsplash.com/photo-1563804806467-2c6364483a04?auto=format&fit=crop&w=800',
        parking: '飯店專用停車場',
        gpsPhone: '0143-84-3311',
        detailedInfo: [
            { title: '溫泉特色', content: '登別溫泉素有「溫泉百貨公司」之稱，擁有多種泉質，能舒緩旅途疲勞。' },
            { title: '設施', content: '設有大浴場與露天風呂，請務必體驗。' }
        ]
      }
    ]
  },
  'Dec 21 Sun': {
    location: '函館', 
    dayLabel: 'Day 2',
    heroImage: 'https://images.unsplash.com/photo-1623377639970-57226e520a7c?auto=format&fit=crop&w=800',
    title: 'Day 2 登別與函館',
    subtitle: '地獄谷、企鵝遊行與百萬夜景',
    clothing: '戶外活動較多，建議穿著舒適好走的鞋子並注意防風。',
    activities: [
      {
        id: '200',
        time: '07:30',
        type: 'food',
        title: '早餐：飯店內早餐',
        subtitle: '元氣的開始',
        japaneseName: '朝食',
        TaiwanName: '飯店早餐',
        image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '享用飯店內豐富的日式與西式自助早餐。' }]
      },
      {
        id: '201',
        time: '09:00',
        type: 'sightseeing',
        title: '登別地獄谷',
        subtitle: '火山地貌奇景',
        japaneseName: '登別地獄谷',
        TaiwanName: '登別地獄谷',
        image: 'https://images.unsplash.com/photo-1623377639970-57226e520a7c?auto=format&fit=crop&w=800',
        parking: '地獄谷駐車場',
        gpsPhone: '0143-84-3311',
        detailedInfo: [
            { title: '景觀特色', content: '直徑450公尺的爆裂火山口，赤紅岩石與無數噴氣孔，煙霧繚繞宛如地獄。' },
            { title: '步道', content: '沿著木棧道行走，近距離感受大自然的震撼力量。' }
        ]
      },
      {
        id: '202',
        time: '11:00',
        type: 'sightseeing',
        title: '尼克斯海洋公園',
        subtitle: '國王企鵝大遊行',
        japaneseName: '登別ニクス海洋公園',
        TaiwanName: '尼克斯海洋公園',
        image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800',
        parking: '園區附設停車場',
        gpsPhone: '0143-83-3800',
        detailedInfo: [
            { title: '必看表演', content: '不可錯過可愛的「國王企鵝大遊行」，企鵝們搖搖擺擺地從遊客面前走過，非常療癒。' },
            { title: '北歐風格', content: '以丹麥耶斯克城堡為藍本興建，是一座充滿北歐浪漫風情的水族館。' }
        ]
      },
      {
        id: '203',
        time: '12:30',
        type: 'food',
        title: '午餐：日式壽喜燒 或 燒肉',
        subtitle: '餐標 2000 日幣',
        japaneseName: 'すき焼き / 焼肉',
        TaiwanName: '日式壽喜燒',
        image: 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '享用道地的日式壽喜燒鍋物或日式燒肉料理。' }]
      },
      {
        id: '204',
        time: '15:00',
        type: 'sightseeing',
        title: '金森倉庫群 & 明治館',
        subtitle: '函館港邊散策',
        japaneseName: '金森赤レンガ倉庫',
        TaiwanName: '金森紅磚倉庫',
        image: 'https://images.unsplash.com/photo-1624676659682-6c9337660431?auto=format&fit=crop&w=800',
        parking: 'タイムズ金森赤レンガ倉庫',
        gpsPhone: '0138-27-5530',
        detailedInfo: [
            { title: '歷史背景', content: '明治時代的紅磚倉庫群，見證了函館港的繁榮。現在改建為風格獨具的購物中心。' },
            { title: '海鮮市場', content: '順道造訪附近的「函館海鮮市場（波止場）」，感受港口城市的活力。' }
        ]
      },
      {
        id: '205',
        time: '18:30',
        type: 'sightseeing',
        title: '函館山空中纜車',
        subtitle: '米其林三星百萬夜景',
        japaneseName: '函館山ロープウェイ',
        TaiwanName: '函館山纜車',
        image: 'https://images.unsplash.com/photo-1617512759381-41c777224403?auto=format&fit=crop&w=800',
        parking: '函館山ロープウェイ山麓駅駐車場',
        gpsPhone: '0138-23-3105',
        detailedInfo: [
            { title: '世界三大夜景', content: '特殊的扇形地形，兩側海灣包夾著璀璨的市區燈火，宛如散落在地上的珠寶箱。' },
            { title: '特別安排', content: '含往返纜車票各一次，3分鐘即可抵達山頂展望台。' }
        ],
        details: { note: '含往返纜車票各一次' }
      },
      {
        id: '206',
        time: '19:30',
        type: 'food',
        title: '晚餐：總匯自助餐或會席料理',
        subtitle: '飯店內或外用',
        japaneseName: '夕食',
        TaiwanName: '飯店晚餐',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '飯店內總匯自助餐 或 飯店內溫泉會席料理 或 飯店外日式料理。' }]
      },
      {
        id: '207',
        time: '21:00',
        type: 'hotel',
        title: '平成館 溫泉飯店',
        subtitle: '或 IMAGINE HOTEL 或 大沼王子',
        japaneseName: '平成館 しおさい亭',
        TaiwanName: '平成館溫泉飯店',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800',
        detailedInfo: [
            { title: '住宿', content: '平成館 溫泉飯店 或 IMAGINE HOTEL & RESORT 或 大沼王子 或 同級。' },
            { title: '湯之川溫泉', content: '若入住湯之川地區，可享受著名的「湯之川溫泉」，是北海道三大溫泉鄉之一。' }
        ]
      }
    ]
  },
  'Dec 22 Mon': {
    location: '洞爺湖',
    dayLabel: 'Day 3',
    heroImage: 'https://images.unsplash.com/photo-1566465079974-32dc3775e13d?auto=format&fit=crop&w=800',
    title: 'Day 3 函館至洞爺',
    subtitle: '修道院、朝市與國定公園',
    clothing: '湖邊風大，建議加強頭部保暖。',
    activities: [
      {
        id: '300',
        time: '07:30',
        type: 'food',
        title: '早餐：飯店內早餐',
        subtitle: '美好的一天',
        japaneseName: '朝食',
        TaiwanName: '飯店早餐',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '飯店內享用美味早餐。' }]
      },
      {
        id: '301',
        time: '09:00',
        type: 'sightseeing',
        title: '百年女子修道院',
        subtitle: '特拉普派修道院',
        japaneseName: 'トラピスチヌ修道院',
        TaiwanName: '女子修道院',
        image: 'https://images.unsplash.com/photo-1519817914152-22d2161e81bd?auto=format&fit=crop&w=800',
        parking: '市民の森駐車場',
        gpsPhone: '0138-59-1134',
        detailedInfo: [
            { title: '莊嚴聖地', content: '日本第一家女子修道院，融合哥德式與羅馬式建築風格，環境清幽莊嚴。' },
            { title: '必吃', content: '修道院門口的「市民之森」牛奶冰淇淋，口感極其濃郁，不可錯過。' }
        ]
      },
      {
        id: '302',
        time: '10:30',
        type: 'sightseeing',
        title: '函館傳統朝市',
        subtitle: '體驗在地鮮味',
        japaneseName: '函館朝市',
        TaiwanName: '函館朝市',
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800',
        parking: '函館朝市駅前駐車場',
        gpsPhone: '0138-22-7981',
        detailedInfo: [
            { title: '北海道廚房', content: '聚集了約250家店舖，販售最新鮮的帝王蟹、海膽、烏賊及各式乾貨。' },
            { title: '活動', content: '可參觀著名的「釣活烏賊」體驗。' }
        ]
      },
      {
        id: '303',
        time: '12:30',
        type: 'food',
        title: '午餐：日式陶板燒 或 海鮮小火鍋',
        subtitle: '餐標 2000 日幣',
        japaneseName: '陶板焼き / 鍋',
        TaiwanName: '日式陶板燒',
        image: 'https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '享用熱騰騰的日式陶板燒料理 或 鮮美的日式海鮮小火鍋。' }]
      },
      {
        id: '304',
        time: '14:00',
        type: 'sightseeing',
        title: '大沼國定公園',
        subtitle: '新日本三景',
        japaneseName: '大沼国定公園',
        TaiwanName: '大沼國定公園',
        image: 'https://images.unsplash.com/photo-1566465079974-32dc3775e13d?auto=format&fit=crop&w=800',
        parking: '大沼公園広場駐車場',
        gpsPhone: '0138-67-2170',
        detailedInfo: [
            { title: '湖光山色', content: '以秀麗的駒之岳為背景，湖面上散布著126個小島。走訪「月見橋」，欣賞大沼湖畔的絕美風光。' },
            { title: '名曲誕生地', content: '此地也是著名歌曲「千之風化作」的誕生地。' }
        ]
      },
      {
        id: '305',
        time: '16:30',
        type: 'sightseeing',
        title: '洞爺湖展望台',
        subtitle: '眺望不凍湖',
        japaneseName: 'サイロ展望台',
        TaiwanName: '洞爺湖展望台',
        image: 'https://images.unsplash.com/photo-1634293398332-639633090706?auto=format&fit=crop&w=800',
        parking: 'サイロ展望台駐車場',
        gpsPhone: '0142-87-2221',
        detailedInfo: [
            { title: '全景視野', content: '拍攝洞爺湖全景的最佳地點，可以將中島、有珠山、昭和新山一覽無遺。' },
            { title: '購物', content: '商店內有販售著名的「洞爺湖木刀」及各式北海道伴手禮。' }
        ]
      },
      {
        id: '306',
        time: '18:30',
        type: 'food',
        title: '晚餐：總匯自助餐或會席料理',
        subtitle: '飯店內享用',
        japaneseName: '夕食',
        TaiwanName: '飯店晚餐',
        image: 'https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '飯店內享用總匯自助餐 或 飯店內溫泉會席料理。' }]
      },
      {
        id: '307',
        time: '20:00',
        type: 'hotel',
        title: '洞爺湖 萬世閣溫泉飯店',
        subtitle: '或 湖畔亭 或 太陽宮殿 或 同級',
        japaneseName: '洞爺湖万世閣',
        TaiwanName: '洞爺湖溫泉飯店',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800',
        detailedInfo: [
            { title: '住宿', content: '洞爺湖 萬世閣溫泉飯店 或 湖畔亭溫泉飯店 或 太陽宮殿溫泉飯店 或 北湯澤森之空庭 或 同級。' },
            { title: '溫泉', content: '享受洞爺湖溫泉，部分露天風呂可直接眺望湖景。' }
        ]
      }
    ]
  },
  'Dec 23 Tue': {
    location: '札幌',
    dayLabel: 'Day 4',
    heroImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800',
    title: 'Day 4 札幌市區',
    subtitle: '白色戀人與燈樹節',
    clothing: '可能遇到下雪，建議穿著防滑靴子。',
    activities: [
      {
        id: '400',
        time: '07:30',
        type: 'food',
        title: '早餐：飯店內早餐',
        subtitle: '活力早餐',
        japaneseName: '朝食',
        TaiwanName: '飯店早餐',
        image: 'https://images.unsplash.com/photo-1525351462161-f212f29e47ce?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '飯店內享用早餐。' }]
      },
      {
        id: '401',
        time: '09:30',
        type: 'sightseeing',
        title: '北海道神宮',
        subtitle: '守護北海道的神社',
        japaneseName: '北海道神宮',
        TaiwanName: '北海道神宮',
        image: 'https://images.unsplash.com/photo-1575395333749-964920fb3490?auto=format&fit=crop&w=800',
        parking: '北海道神宮西駐車場',
        gpsPhone: '011-611-0261',
        detailedInfo: [
            { title: '信仰中心', content: '北海道總鎮守，環境清幽莊嚴。是賞櫻與賞楓的名所。' },
            { title: '免稅店', content: '行程包含前往免稅店，可自由選購日本藥妝與紀念品。' }
        ]
      },
      {
        id: '402',
        time: '13:00',
        type: 'sightseeing',
        title: '白色戀人公園',
        subtitle: '石屋製果觀光工廠',
        japaneseName: '白い恋人パーク',
        TaiwanName: '白色戀人公園',
        image: 'https://images.unsplash.com/photo-1523631942276-b44290378974?auto=format&fit=crop&w=800',
        parking: '白い恋人パーク駐車場',
        gpsPhone: '011-666-1481',
        detailedInfo: [
            { title: '夢幻城堡', content: '參觀「白色戀人」巧克力餅乾生產線。歐式城堡建築與中庭花園非常適合拍照。' }
        ]
      },
      {
        id: '403',
        time: '12:30',
        type: 'food',
        title: '午餐：日式燒肉 或 海鮮鍋物',
        subtitle: '餐標 2500 日幣',
        japaneseName: '焼肉 / 海鮮鍋',
        TaiwanName: '日式燒肉',
        image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '享用日式燒肉 或 海鮮鍋物風味料理。' }]
      },
      {
        id: '404',
        time: '16:00',
        type: 'shop',
        title: '狸小路商店街',
        subtitle: '特別安排逛街',
        japaneseName: '狸小路商店街',
        TaiwanName: '狸小路商店街',
        image: 'https://images.unsplash.com/photo-1559260934-9b2743f4c489?auto=format&fit=crop&w=800',
        parking: '周邊收費停車場',
        gpsPhone: '011-241-5184',
        detailedInfo: [
            { title: '購物天堂', content: '長達900公尺的商店街，有遮雨棚不受天氣影響。藥妝、土產店林立。' }
        ]
      },
      {
        id: '405',
        time: '18:00',
        type: 'food',
        title: '晚餐：方便逛街~敬請自理',
        subtitle: '推薦美食',
        japaneseName: '夕食：自理',
        TaiwanName: '晚餐推薦',
        image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=800',
        detailedInfo: [
            { title: '推薦 1：湯咖哩 GARAKU', content: '札幌超人氣排隊名店，湯頭濃郁鮮甜。必點「燉豬肉湯咖哩」。' },
            { title: '推薦 2：空拉麵', content: '狸小路內的味噌拉麵名店，使用北海道產味噌，香氣十足。' },
            { title: '推薦 3：Suage+', content: '知床雞串燒湯咖哩是招牌，蔬菜鮮甜好吃。' }
        ],
        recommendations: [
            { name: '湯咖哩 GARAKU', dish: 'とろとろ炙り焙煎角煮', note: '燉豬肉湯咖哩' },
            { name: '空拉麵', dish: '味噌ラーメン', note: '味噌拉麵' },
            { name: 'Suage+', dish: 'パリパリ知床鶏と野菜カレー', note: '知床雞湯咖哩' }
        ]
      },
      {
        id: '406',
        time: '19:30',
        type: 'sightseeing',
        title: '大通公園',
        subtitle: '札幌白色燈樹節',
        japaneseName: 'さっぽろホワイトイルミネーション',
        TaiwanName: '大通公園',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800',
        detailedInfo: [
            { title: '季節限定', content: '★特別安排：欣賞札幌白色燈樹節（預計2025年11月下旬至2026年3月中旬）。' },
            { title: '景色', content: '璀璨燈飾點亮冬夜的札幌，浪漫迷人。' }
        ]
      },
      {
        id: '407',
        time: '21:00',
        type: 'hotel',
        title: '札幌 MY STAY 或 IBIS',
        subtitle: '或 同級',
        japaneseName: 'ホテルマイステイズ札幌',
        TaiwanName: '札幌市區飯店',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '住宿', content: '札幌 MY STAY 或 IBIS 或 同級市區飯店。' }]
      }
    ]
  },
  'Dec 24 Wed': {
    location: '小樽',
    dayLabel: 'Day 5',
    heroImage: 'https://images.unsplash.com/photo-1534335346437-14b34eb40330?auto=format&fit=crop&w=800',
    title: 'Day 5 小樽漫遊',
    subtitle: '運河浪漫與螃蟹大餐',
    clothing: '運河邊風較大，建議圍上厚圍巾。',
    activities: [
      {
        id: '500',
        time: '07:30',
        type: 'food',
        title: '早餐：飯店內早餐',
        subtitle: '早安札幌',
        japaneseName: '朝食',
        TaiwanName: '飯店早餐',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '飯店內享用早餐。' }]
      },
      {
        id: '501',
        time: '10:00',
        type: 'sightseeing',
        title: '小樽浪漫遊',
        subtitle: '運河、硝子、音樂盒',
        japaneseName: '小樽運河',
        TaiwanName: '小樽運河',
        image: 'https://images.unsplash.com/photo-1534335346437-14b34eb40330?auto=format&fit=crop&w=800',
        parking: '小樽運河周辺駐車場',
        gpsPhone: '0134-32-4111',
        detailedInfo: [
            { title: '小樽運河', content: '欣賞昔日石造倉庫群倒映在運河上的美景。' },
            { title: '北一硝子館', content: '參觀精緻的玻璃工藝品。' },
            { title: '音樂盒堂', content: '門口有著名的歐風蒸氣鐘。★加贈：小樽不思議泡芙每人一顆。' }], details: { gift: '贈送不思議泡芙每人一顆' } },
        { id: '502', time: '12:30', type: 'food', title: '午餐：方便逛街~敬請自理', subtitle: '小樽美食推薦', japaneseName: '昼食：自理', TaiwanName: '午餐推薦', image: 'https://images.unsplash.com/photo-1559969143-b2def2575d2d?auto=format&fit=crop&w=800', detailedInfo: [{ title: '推薦 1：小樽政壽司', content: '漫畫「將太的壽司」場景，小樽最知名的壽司老店。必吃「烏賊素麵」。' }, { title: '推薦 2：LeTAO', content: '必吃「雙層乳酪蛋糕」，入口即化，濃郁奶香。' }, { title: '推薦 3：北果樓', content: '必買「夢不思議泡芙」，外皮酥脆，內餡爆漿。' }], recommendations: [{ name: '小樽政壽司', dish: '名物 元祖いかそうめん', note: '元祖烏賊素麵' }, { name: 'LeTAO', dish: 'ドゥーブルフロマージュ', note: '雙層乳酪蛋糕' }, { name: '北果樓', dish: '夢不思議シュークリーム', note: '夢不思議泡芙' }] },
        { id: '503', time: '15:30', type: 'shop', title: '三井暢貨園區', subtitle: '札幌北廣島 OUTLET', japaneseName: '三井アウトレットパーク 札幌北広島', TaiwanName: '三井 Outlet', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800', parking: '無料駐車場', gpsPhone: '011-377-3200', detailedInfo: [{ title: '購物', content: '北海道最大Outlet，集合各國品牌。' }] },
        { id: '504', time: '19:00', type: 'food', title: '晚餐：三大螃蟹吃到飽', subtitle: '酒水無限暢飲', japaneseName: '三大カニ食べ放題', TaiwanName: '螃蟹吃到飽', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800', detailedInfo: [{ title: '豪華饗宴', content: '帝王蟹、長腳蟹、毛蟹三大螃蟹吃到飽 + 酒水無限暢飲 (餐標 7500 日幣)。' }] },
        { id: '505', time: '21:00', type: 'hotel', title: '國際五星萬怡飯店', subtitle: '★保證入住★', japaneseName: 'コートヤード・バイ・マリオット', TaiwanName: '萬怡飯店', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800', detailedInfo: [{ title: '特色', content: '保證入住國際五星級萬怡飯店，享受頂級住宿體驗。' }] }
     ]
  },
  'Dec 25 Thu': {
    location: '札幌',
    dayLabel: 'Day 6',
    heroImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800',
    title: 'Day 6 滿載而歸',
    subtitle: '市區觀光與馬場體驗',
    clothing: '輕鬆舒適的返程穿搭。',
    activities: [
      {
        id: '600',
        time: '07:30',
        type: 'food',
        title: '早餐：飯店內早餐',
        subtitle: '最後的早晨',
        japaneseName: '朝食',
        TaiwanName: '飯店早餐',
        image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '飯店內享用豐盛早餐。' }]
      },
      {
        id: '601',
        time: '09:00',
        type: 'sightseeing',
        title: '札幌市內觀光',
        subtitle: '時計台 & 舊道廳',
        japaneseName: '札幌市時計台',
        TaiwanName: '札幌時計台',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800',
        parking: '無（需停周邊）',
        gpsPhone: '011-231-0838',
        detailedInfo: [
            { title: '路經參觀', content: '搭車經過札幌著名的地標：現存最古老的鐘樓「時計台」以及紅磚巴洛克建築「舊道廳」。' }
        ]
      },
      {
        id: '602',
        time: '11:00',
        type: 'sightseeing',
        title: '北方馬の國公園',
        subtitle: '親近自然與馬匹',
        japaneseName: 'ノーザンホースパーク',
        TaiwanName: '北方馬公園',
        image: 'https://images.unsplash.com/photo-1534258889929-d80af9c50988?auto=format&fit=crop&w=800',
        parking: '無料駐車場',
        gpsPhone: '0144-58-2116',
        detailedInfo: [
            { title: '特別贈送', content: '贈送騎馬或馬車體驗（二選一），在廣闊的牧場草原上悠閒散步。' }
        ],
        details: { activity: '贈送騎馬或馬車體驗' }
      },
      {
        id: '603',
        time: '13:00',
        type: 'food',
        title: '午餐：機上精緻餐食',
        subtitle: '賦歸',
        japaneseName: '機内食',
        TaiwanName: '機上餐',
        image: 'https://images.unsplash.com/photo-1542296332-2e44a99cfef9?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '內容', content: '享用機上餐食。' }]
      },
      {
        id: '604',
        time: '13:55',
        type: 'flight',
        title: '返程：新千歲 -> 高雄',
        subtitle: 'IT261 CTS -> KHH',
        japaneseName: '新千歳空港',
        TaiwanName: '新千歲機場',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800',
        // NEW: Structured Flight Info
        flightInfo: {
            date: '2025/12/25 (四)',
            airline: '台灣虎航',
            flightNo: 'IT261',
            bookingCode: 'KHH888', // Example
            dep: { city: '札幌', code: 'CTS', time: '13:55', terminal: 'Int' },
            arr: { city: '高雄', code: 'KHH', time: '18:05', terminal: 'Int' },
            duration: '5h 10m'
        },
        detailedInfo: [
            { title: '賦歸', content: '帶著滿滿的回憶與戰利品，搭機返回溫暖的家。' }
        ]
      },
      {
        id: '605',
        time: '19:00',
        type: 'hotel',
        title: '溫暖的家',
        subtitle: '甜蜜的家',
        japaneseName: '自宅',
        TaiwanName: '溫暖的家',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800', // Home vibe
        detailedInfo: [{ title: '結束', content: '行程結束，期待下次再見！' }]
      }
    ]
  }
};

// --- New Component: Flight Ticket ---
const FlightTicket = ({ data }: { data: FlightInfo }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-6">
    {/* Header */}
    <div className="bg-stone-50 px-5 py-3 border-b border-stone-100 flex items-center gap-2">
       <Ticket size={16} className="text-stone-400" />
       <span className="font-bold text-stone-600 text-sm tracking-wider">航班與訂位資訊</span>
    </div>
    <div className="p-5">
       {/* Route & Date */}
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

       {/* Times */}
       <div className="flex items-center justify-between bg-stone-50 rounded-xl p-4">
          {/* Dep */}
          <div className="text-center">
             <div className="text-2xl font-black text-stone-800 font-mono">{data.dep.time}</div>
             <div className="text-xs text-stone-400 font-bold mt-1">{data.dep.code} <span className="font-normal opacity-70">{data.dep.terminal}</span></div>
          </div>

          {/* Duration */}
          <div className="flex-1 px-4 flex flex-col items-center">
             <span className="text-[10px] text-stone-400 mb-1">{data.duration}</span>
             <div className="w-full h-[1px] bg-stone-300 relative">
                <div className="absolute right-0 -top-[3px] w-0 h-0 border-l-[4px] border-l-stone-300 border-y-[3px] border-y-transparent" />
             </div>
          </div>

          {/* Arr */}
          <div className="text-center">
             <div className="text-2xl font-black text-stone-800 font-mono">{data.arr.time}</div>
             <div className="text-xs text-stone-400 font-bold mt-1">{data.arr.code} <span className="font-normal opacity-70">{data.arr.terminal}</span></div>
          </div>
       </div>
    </div>
  </div>
);

// --- New Component: Hourly Weather List ---
interface HourlyWeatherItem {
  time: string;
  temp: number;
  icon: LucideIcon;
  color: string;
}

const HourlyWeatherList = ({ weather }: { weather: HourlyWeatherItem[] }) => {
  const scrollRef = useDraggableScroll();
  if (!weather || weather.length === 0) return <div className="text-xs text-stone-400 p-2">暫無每小時資料</div>;
  return (
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 hide-scrollbar pb-2 -mx-2 px-2 select-none">
          {weather.map((w, i) => {
              const WeatherIconComponent = w.icon;
              return (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center min-w-[3.5rem] bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                      <span className="text-xs text-stone-400 font-medium mb-1">{w.time}</span>
                      <div className={`my-1 ${w.color}`}>
                          <WeatherIconComponent size={24} strokeWidth={1.5} />
                      </div>
                      <span className="font-serif text-lg font-bold text-stone-800">{w.temp}°</span>
                  </div>
              );
          })}
      </div>
  );
};

// --- New Component: Weather Widget ---
interface WeatherWidgetData {
  location: LocationKey | string;
  clothing?: string;
}

interface RealWeatherData {
  condition: string;
  tempRange: string;
  icon: LucideIcon;
  color: string;
  hourly: HourlyWeatherItem[];
}

const WeatherWidget = ({ data }: { data: WeatherWidgetData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [realWeather, setRealWeather] = useState<RealWeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchWeather = async () => {
            const coords = data.location in LOCATION_COORDS ? LOCATION_COORDS[data.location as LocationKey] : undefined;
            if (!coords) return;
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const result = await response.json();
                const currentCode = result.current.weather_code;
                const currentInfo = getWeatherInfo(currentCode);
                const dailyMin = result.daily.temperature_2m_min[0];
                const dailyMax = result.daily.temperature_2m_max[0];
                const hourlyData = [];
                const now = new Date();
                const currentHour = now.getHours();
                for(let i = 0; i < 24; i++) { 
                    const hourIndex = currentHour + i;
                    if (hourIndex < result.hourly.time.length) {
                        const hCode = result.hourly.weather_code[hourIndex];
                        const hTemp = result.hourly.temperature_2m[hourIndex];
                        const hInfo = getWeatherInfo(hCode);
                        const timeStr = new Date(now.getTime() + i * 60 * 60 * 1000).getHours().toString().padStart(2, '0') + ":00";
                        hourlyData.push({
                            time: timeStr,
                            temp: Math.round(hTemp),
                            icon: hInfo.icon,
                            color: hInfo.color
                        });
                    }
                }
                setRealWeather({
                    condition: currentInfo.label,
                    tempRange: `${Math.round(dailyMin)}° - ${Math.round(dailyMax)}°`,
                    icon: currentInfo.icon,
                    color: currentInfo.color,
                    hourly: hourlyData
                });
            } catch (error) {
                console.error("Failed to fetch weather", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [data.location]);

    const displayWeather = realWeather || { 
        condition: '載入中...', 
        tempRange: '--', 
        icon: Loader2,
        color: 'text-stone-300 animate-spin',
        hourly: [] 
    };
    const MainIcon = displayWeather.icon;

    return (
        <div className="mx-4 mt-6 bg-white rounded-2xl p-5 shadow-sm border border-stone-100 transition-all duration-300 active:scale-[0.99]">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <h3 className="font-serif font-bold text-lg text-stone-800">{data.location} 天氣</h3>
                    {!isExpanded && (
                         <div className="flex items-center gap-2 text-stone-600 bg-stone-50 px-2 py-1 rounded-lg">
                            <div className={displayWeather.color}>
                                <MainIcon size={18} />
                            </div>
                            <span className="text-sm font-medium">{displayWeather.condition} {displayWeather.tempRange}</span>
                         </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {!isExpanded && <span className="text-[10px] text-stone-400">Tap to details</span>}
                    <ChevronDown size={20} className={`text-stone-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 animate-fade-in">
                    <div className="mb-4 bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex gap-3 items-start">
                        <div className="bg-white p-1.5 rounded-full shadow-sm text-amber-500 mt-0.5">
                            <Shirt size={14} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">穿著建議</p>
                            <p className="text-sm text-stone-700 leading-relaxed">{data.clothing || '請注意保暖。'}</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 size={24} className="animate-spin text-stone-300" />
                        </div>
                    ) : (
                        <HourlyWeatherList weather={displayWeather.hourly} />
                    )}
                    <div className="mt-2 text-[10px] text-right text-stone-300">Data by Open-Meteo</div>
                </div>
            )}
        </div>
    );
};

// --- New Component: Day Info Editor Modal ---
interface DayInfoEditModalProps {
  dayKey: string;
  dayData: {
    location: string;
    dayLabel: string;
    heroImage: string;
    title: string;
    subtitle: string;
    clothing?: string;
    handDrawnMap?: string | null;
    [key: string]: any; // Allow other properties
  };
  onClose: () => void;
  onSave: (data: any) => void;
}

const DayInfoEditModal = ({ dayKey, dayData, onClose, onSave }: DayInfoEditModalProps) => {
    const [form, setForm] = useState({ ...dayData });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              setForm({ ...form, heroImage: reader.result });
            }
          };
          reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">編輯行程資訊 ({dayKey.split(' ')[0]})</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">首圖 (Hero Image)</label>
                        <div className="flex gap-2 mb-2">
                            <input 
                                type="text" 
                                className="flex-1 p-2 border rounded text-sm"
                                placeholder="Image URL"
                                value={form.heroImage?.startsWith('data:') ? '' : form.heroImage}
                                onChange={e => setForm({...form, heroImage: e.target.value})}
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="bg-stone-100 p-2 rounded border border-stone-200">
                                <Upload size={16} />
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
                        <label className="block text-xs font-bold text-stone-400 mb-1">標題 (Title)</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded font-bold"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">副標題 (Subtitle)</label>
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
                    <button onClick={() => onSave(form)} className="px-6 py-2 bg-stone-900 text-white rounded-lg font-bold shadow-lg">儲存</button>
                </div>
            </div>
        </div>
    );
}

// --- Components (DetailModal, TabBar, etc.) ---
type TabType = 'expenses' | 'itinerary' | 'tools';

interface TabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabBar = ({ activeTab, setActiveTab }: TabBarProps) => {
    // ... (TabBar code remains same)
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full z-50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] max-w-[90vw]">
        <button onClick={() => setActiveTab('expenses')} className={`relative px-4 sm:px-6 py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 group ${activeTab === 'expenses' ? 'bg-stone-100 text-stone-900 shadow-inner' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}>
          <Wallet size={20} strokeWidth={activeTab === 'expenses' ? 2.5 : 2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">記帳</span>
        </button>
        <button onClick={() => setActiveTab('itinerary')} className={`relative px-6 sm:px-8 py-3 rounded-full flex flex-col items-center justify-center transition-all duration-500 ease-out group ${activeTab === 'itinerary' ? 'bg-stone-800 text-white shadow-lg scale-105' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}>
          <Calendar size={22} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">我的行程</span>
        </button>
        <button onClick={() => setActiveTab('tools')} className={`relative px-4 sm:px-6 py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 group ${activeTab === 'tools' ? 'bg-stone-100 text-stone-900 shadow-inner' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}>
          <Navigation size={20} strokeWidth={activeTab === 'tools' ? 2.5 : 2} className="mb-0.5 transition-transform group-active:scale-90" />
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap">工具</span>
        </button>
      </div>
    );
  };

interface DetailModalProps {
  activity: Activity | null;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

const DetailModal = ({ activity, onClose, onSave }: DetailModalProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Activity>>(activity ? { ...activity } : {});
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [fullScreenContent, setFullScreenContent] = useState<{ jp: string; tw?: string } | string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
        if (activity) {
            setEditForm({ ...activity });
        }
    }, [activity]);
  
    if (!activity) return null;
  
    const handleCopy = (text: string) => { alert(`Copied: ${text}`); };
    const openFullScreen = (jp: string, tw?: string) => {
        // If it's an image URL (starts with http or data:), set as string
        if (jp.startsWith('http') || jp.startsWith('data:')) {
            setFullScreenContent(jp);
        } else {
            // Otherwise, set as object with jp and optional tw
            setFullScreenContent({ jp, tw });
        }
        setShowFullScreen(true);
    };
  
    const handleSave = () => {
        if (activity && editForm.id) {
            onSave(editForm as Activity);
        }
        setIsEditing(false);
    };

    const handleClose = () => {
        if(isEditing) {
            setIsEditing(false);
            // Reset form to original activity data
            if (activity) {
                setEditForm({ ...activity });
            }
        } else {
            onClose();
        }
    };
  
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
  
    // Image Upload Handler  
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setEditForm({ ...editForm, image: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    };

    return (
        <>
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={handleClose} />
        <div className="bg-white w-full max-w-md h-[85vh] sm:h-[80vh] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col transform transition-transform duration-300 ease-out animate-slide-up">
            
            {/* Header Actions */}
            <div className="flex justify-between px-4 pt-4 pb-2">
                 {isEditing ? (
                     <button onClick={handleClose} className="text-stone-400 hover:text-stone-600">Cancel</button>
                 ) : (
                     <div className="w-8" /> // Spacer
                 )}
                 
                 <div className="flex gap-2">
                     {!isEditing ? (
                         <button onClick={() => setIsEditing(true)} className="bg-stone-100 p-2 rounded-full shadow-sm active:scale-95 transition-transform">
                             <Edit2 size={18} className="text-stone-800" />
                         </button>
                     ) : (
                         <button onClick={handleSave} className="bg-stone-900 p-2 rounded-full shadow-sm active:scale-95 transition-transform">
                             <Save size={18} className="text-white" />
                         </button>
                     )}
                     <button onClick={handleClose} className="bg-stone-100 p-2 rounded-full shadow-sm active:scale-95 transition-transform">
                         <X size={20} className="text-stone-800" />
                     </button>
                 </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white hide-scrollbar">
            
            {isEditing ? (
                /* --- EDIT MODE --- */
                <div className="space-y-4 pb-10">
                    <div>
                        <label className="text-xs font-bold text-stone-400 mb-1 block">Image</label>
                        {/* URL Input */}
                        <input 
                            type="text" 
                            className="w-full p-2 border border-stone-200 rounded-lg text-sm mb-2"
                            placeholder="Image URL"
                            value={editForm.image?.startsWith('data:') ? '' : editForm.image || ''}
                            onChange={e => setEditForm({...editForm, image: e.target.value})}
                        />
                        {/* File Upload Button */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-200 transition-colors w-full justify-center"
                            >
                                <Upload size={16} />
                                Upload Image
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                    
                    {/* Preview */}
                    {editForm.image && (
                         <div className="relative w-full h-32 rounded-lg overflow-hidden border border-stone-200">
                            <img src={editForm.image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-2 py-0.5">Preview</div>
                         </div>
                    )}
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-stone-400">Time</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-stone-200 rounded-lg text-sm font-mono"
                                value={editForm.time || ''}
                                onChange={e => setEditForm({...editForm, time: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-400">Type</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-stone-200 rounded-lg text-sm uppercase"
                                value={editForm.type || ''}
                                onChange={e => setEditForm({...editForm, type: e.target.value as Activity['type']})}
                            />
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-stone-400">Title</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-stone-200 rounded-lg text-lg font-bold"
                            value={editForm.title || ''}
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                        />
                    </div>
                    
                    <div>
                         <label className="text-xs font-bold text-stone-400">Address / Subtitle</label>
                         <input 
                             type="text" 
                             className="w-full p-2 border border-stone-200 rounded-lg text-sm"
                             value={editForm.address || editForm.subtitle || ''}
                             onChange={e => setEditForm({...editForm, address: e.target.value, subtitle: e.target.value})} // Updating both for simplicity as they often map similarly in view
                         />
                     </div>

                     <div>
                         <label className="text-xs font-bold text-stone-400">Japanese Name (Big Text)</label>
                         <input 
                             type="text" 
                             className="w-full p-2 border border-stone-200 rounded-lg text-sm"
                             value={editForm.japaneseName || ''}
                             onChange={e => setEditForm({...editForm, japaneseName: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-stone-400">Taiwan Name (Small Text)</label>
                         <input 
                             type="text" 
                             className="w-full p-2 border border-stone-200 rounded-lg text-sm"
                             value={editForm.TaiwanName || ''}
                             onChange={e => setEditForm({...editForm, TaiwanName: e.target.value})}
                         />
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        <div>
                             <label className="text-xs font-bold text-stone-400">Parking Info</label>
                             <input 
                                 type="text" 
                                 className="w-full p-2 border border-stone-200 rounded-lg text-sm"
                                 value={editForm.parking || ''}
                                 onChange={e => setEditForm({...editForm, parking: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="text-xs font-bold text-stone-400">Car GPS Phone</label>
                             <input 
                                 type="text" 
                                 className="w-full p-2 border border-stone-200 rounded-lg text-sm font-mono"
                                 value={editForm.gpsPhone || ''}
                                 onChange={e => setEditForm({...editForm, gpsPhone: e.target.value})}
                             />
                         </div>
                     </div>

                     <div>
                         <label className="text-xs font-bold text-stone-400">Description (Simple)</label>
                         <textarea 
                             className="w-full p-2 border border-stone-200 rounded-lg text-sm"
                             rows={3}
                             value={editForm.description || ''}
                             onChange={e => setEditForm({...editForm, description: e.target.value})}
                         />
                     </div>

                     <div className="border-t border-stone-100 pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-stone-400 block">Detailed Info Points</label>
                            <button onClick={addDetailedInfo} className="text-xs bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded flex items-center gap-1">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        
                        {editForm.detailedInfo?.map((info, idx) => (
                            <div key={idx} className="mb-3 p-3 bg-stone-50 rounded-lg relative group">
                                <button 
                                    onClick={() => removeDetailedInfo(idx)}
                                    className="absolute top-2 right-2 text-stone-300 hover:text-red-400"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <input 
                                    type="text" 
                                    className="w-full p-1 bg-transparent border-b border-stone-200 text-sm font-bold mb-1 pr-6"
                                    placeholder="Title (e.g. 特色)"
                                    value={info.title}
                                    onChange={e => updateDetailedInfo(idx, 'title', e.target.value)}
                                />
                                <textarea 
                                    className="w-full p-1 bg-transparent text-sm"
                                    placeholder="Content"
                                    rows={2}
                                    value={info.content}
                                    onChange={e => updateDetailedInfo(idx, 'content', e.target.value)}
                                />
                            </div>
                        ))}
                     </div>
                </div>
            ) : (
                /* --- VIEW MODE --- */
                <>
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold tracking-wider text-stone-400 uppercase border border-stone-200 px-2 py-0.5 rounded-full">{activity.type}</span>
                            <span className="text-xs font-mono text-stone-400">{activity.time}</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight mb-1">{activity.title}</h2>
                        <p className="text-stone-500 flex items-center gap-1 text-sm">
                            <MapPin size={14} />
                            {activity.address || 'Hokkaido'}
                        </p>
                    </div>
                    
                    {/* === FLIGHT TICKET CARD (Priority Display) === */}
                    {activity.type === 'flight' && activity.flightInfo && (
                        <FlightTicket data={activity.flightInfo} />
                    )}

                    {/* --- Point & Speak (Main) - Hide for flights if redundancy unwanted, but keeping for flexibility --- */}
                    {activity.type !== 'flight' && (
                        <div className="mb-8 p-6 bg-stone-50 rounded-2xl border border-stone-100 text-center space-y-2 cursor-pointer hover:bg-stone-100 transition-colors active:scale-[0.98] group" 
                            onClick={() => openFullScreen(activity.japaneseName || activity.title, activity.TaiwanName || activity.title)}>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Point & Speak</p>
                            <h3 className="text-4xl font-black text-stone-900 leading-tight font-serif py-2 group-hover:scale-105 transition-transform">{activity.japaneseName || activity.title}</h3>
                            <p className="text-stone-400 text-sm font-medium mb-4">( {activity.TaiwanName || activity.title} )</p>
                            <p className="text-stone-300 text-[10px] pt-2">Tap to enlarge</p>
                        </div>
                    )}

                    {/* --- Food Recommendations Point & Speak --- */}
                    {activity.recommendations && (
                        <div className="mb-8 space-y-3">
                            <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider mb-2">店家招牌指指通</h4>
                            {activity.recommendations.map((rec, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div>
                                        <p className="text-xs text-amber-800 font-bold mb-1">{rec.name}</p>
                                        <p className="text-stone-900 font-serif font-bold">{rec.note}</p>
                                    </div>
                                    <button 
                                        onClick={() => openFullScreen(rec.dish, rec.note)}
                                        className="p-2 bg-white rounded-full shadow-sm text-amber-500 hover:bg-amber-100 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- Parking & GPS Info --- */}
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
                                    <button onClick={() => activity.gpsPhone && handleCopy(activity.gpsPhone)} className="w-10 h-10 flex items-center justify-center bg-stone-50 rounded-full text-stone-600">
                                        <Navigation size={18} />
                                    </button>
                                    <div>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">CAR GPS PHONE</p>
                                        <p className="text-xl font-mono font-bold text-stone-800 tracking-wide">{activity.gpsPhone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- Detailed Description (Structured) --- */}
                    {activity.detailedInfo && activity.detailedInfo.length > 0 ? (
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

                    {/* --- Menu Recommendations (Simple Tags) --- */}
                    {activity.menuRec && (
                        <div className="mt-8">
                            <h4 className="font-bold text-stone-900 mb-3 text-sm uppercase tracking-wider">Must Try (推薦菜單)</h4>
                            <div className="flex flex-wrap gap-2">
                            {activity.menuRec.map((item, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-900 rounded-lg text-sm font-medium border border-amber-100">{item}</span>
                            ))}
                            </div>
                        </div>
                    )}

                    {/* --- Location Image (Moved to bottom) --- */}
                    {activity.image && (
                        <div className="mt-8 rounded-2xl overflow-hidden shadow-md">
                            <img 
                                src={activity.image} 
                                alt={activity.title} 
                                className="w-full h-48 object-cover cursor-pointer" 
                                onClick={() => activity.image && openFullScreen(activity.image)} // Enable fullscreen on click
                            />
                        </div>
                    )}
                </>
            )}

            </div>
        </div>
        </div>
        
        {/* Full Screen Overlay */}
        {showFullScreen && fullScreenContent && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-fade-in" onClick={() => setShowFullScreen(false)}>
                <div className="absolute top-6 right-6 p-4 bg-stone-100 rounded-full z-50">
                    <X size={32} className="text-stone-500" />
                </div>
                <p className="text-stone-400 mb-8 font-bold tracking-widest uppercase z-50">Tap anywhere to close</p>
                <div className="w-full text-center space-y-4 flex flex-col items-center justify-center h-full">
                    {/* Check if content is image URL or text */}
                    {typeof fullScreenContent === 'string' && (fullScreenContent.startsWith('http') || fullScreenContent.startsWith('data:')) ? (
                         <img src={fullScreenContent} alt="Fullscreen" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
                    ) : typeof fullScreenContent === 'object' && fullScreenContent !== null ? (
                        <>
                            <h1 className="text-[10vw] font-black text-stone-900 leading-tight font-serif break-words px-4">{fullScreenContent.jp}</h1>
                            {fullScreenContent.tw && <p className="text-2xl text-stone-500 font-medium">( {fullScreenContent.tw} )</p>}
                        </>
                    ) : null}
                </div>
            </div>
        )}
    </>
  );
}

// --- Main App Component (App) ---
// (Existing App component logic with Date Selector, Weather, Timeline, etc.)
// I'll include the full App component here for completeness
const App = () => {
    // ... (Existing state and hooks)
    const [activeTab, setActiveTab] = useState<TabType>('itinerary');
    const [selectedDay, setSelectedDay] = useState<DayKey>('Dec 20 Sat');
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [showDriverCard, setShowDriverCard] = useState(false);
    const [expenseFilter, setExpenseFilter] = useState('ALL');
    
    // Use State for Itinerary Data to allow edits
    const [itineraryData, setItineraryData] = useState<Record<DayKey, DayData>>(INITIAL_ITINERARY_DATA);
    const [editDayModal, setEditDayModal] = useState<DayData | null>(null);
    
    // Hand-drawn map fullscreen state
    const [fullScreenMap, setFullScreenMap] = useState<string | null>(null);
  
    const dateScrollRef = useDraggableScroll();
    const expenseScrollRef = useDraggableScroll();
    const dayData = itineraryData[selectedDay];
    const filteredExpenses = expenseFilter === 'ALL' ? EXPENSES : EXPENSES.filter(e => e.payer === expenseFilter);
    const totalAmount = filteredExpenses.reduce((sum, item) => {
       const amountInTWD = item.currency === 'JPY' ? item.amount * 0.22 : item.amount;
       return sum + amountInTWD;
    }, 0);
  
    const handleSaveActivity = (updatedActivity: Activity) => {
        const newDayActivities = dayData.activities.map((act: Activity) => 
            act.id === updatedActivity.id ? updatedActivity : act
        );
        setItineraryData({
            ...itineraryData,
            [selectedDay]: {
                ...dayData,
                activities: newDayActivities
            }
        });
        setSelectedActivity(updatedActivity); // Update modal view immediately
    };
    
    const handleSaveDayInfo = (updatedDayInfo: DayData) => {
        setItineraryData({
            ...itineraryData,
            [selectedDay]: updatedDayInfo
        });
        setEditDayModal(null);
    };
  
    const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  const updatedDay = { ...dayData, handDrawnMap: reader.result };
                  setItineraryData({ ...itineraryData, [selectedDay]: updatedDay });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const mapInputRef = useRef<HTMLInputElement>(null);
  
    return (
      <div className="min-h-screen bg-stone-50 font-sans pb-32 max-w-md mx-auto relative overflow-hidden shadow-2xl">
        {activeTab === 'itinerary' && (
          <>
            <div className="bg-white sticky top-0 z-40 border-b border-stone-100 shadow-sm">
              <div className="pt-12 pb-2 px-6">
                <p className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase text-center mb-1">Family Trip</p>
                <h1 className="text-xl font-serif font-bold text-center text-stone-800">北海道旅行 <span className="text-stone-300 text-base font-light rounded-full border border-stone-200 px-2 py-0.5 ml-1">2026</span></h1>
              </div>
              <div ref={dateScrollRef} className="flex overflow-x-auto px-4 pb-2 hide-scrollbar space-x-6 snap-x select-none">
                {Object.keys(INITIAL_ITINERARY_DATA).map((dateKey) => (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDay(dateKey as DayKey)}
                    className={`flex flex-col items-center justify-center min-w-[3rem] py-2 transition-all duration-300 snap-center group ${
                      selectedDay === dateKey 
                        ? 'text-stone-900 scale-110' 
                        : 'text-stone-300 hover:text-stone-500'
                    }`}
                  >
                    {/* Top: Day of Week (Small) e.g., SAT - All Caps, Spaced */}
                    <span className="text-[12px] font-bold uppercase tracking-widest opacity-60 mb-0">
                      {dateKey.split(' ')[2].toUpperCase()}
                    </span>
                    {/* Bottom: Date (Large) e.g., 20 - Serif */}
                    <span className={`text-4xl font-serif ${selectedDay === dateKey ? 'font-bold' : 'font-medium'}`}>
                      {dateKey.split(' ')[1]}
                    </span>
                  </button>
                ))}
                <div className="w-2 shrink-0"></div>
              </div>
            </div>
            {dayData ? (
              <>
                <div className="relative h-48 mx-4 mt-4 rounded-3xl overflow-hidden shadow-md group">
                  <img src={dayData.heroImage} alt="Hero" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                     {/* Edit Day Info Button */}
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
                <WeatherWidget data={dayData} />
                <div className="mt-8 px-4 space-y-0">
                  {dayData.activities.map((item, index) => {
                    const style = getActivityColor(item.type);
                    return (
                      <div key={item.id} className="flex gap-4 relative group" onClick={() => setSelectedActivity(item)}>
                          {/* Same logic for Timeline Item */}
                          <div className="w-16 shrink-0 flex flex-col items-end pt-1 relative">
                            <span className="font-serif text-lg font-medium text-stone-800">{item.time}</span>
                            <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">Details</span>
                            {index !== dayData.activities.length - 1 && (<div className="absolute top-10 right-[-17px] bottom-[-20px] w-[1px] bg-stone-200" />)}
                          </div>
                          <div className="relative">
                            <div className={`w-2.5 h-2.5 rounded-full mt-3 ring-4 ring-stone-50 ${style.bg.replace('bg-', 'bg-').replace('50', '400')}`} />
                          </div>
                          <div className={`flex-1 mb-8 bg-white p-4 rounded-2xl shadow-sm border-l-[3px] ${style.border} active:scale-[0.98] transition-all hover:shadow-md cursor-pointer`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${style.tag}`}>{item.type}</span>
                                {item.endTime && <span className="text-[10px] text-stone-400">Until {item.endTime}</span>}
                            </div>
                            <h3 className="font-bold text-stone-800 text-lg leading-tight mb-1">{item.title}</h3>
                            <p className="text-sm text-stone-500 font-medium mb-3">{item.subtitle}</p>
                            <div className="flex items-center gap-1 text-xs text-stone-400 mt-auto pt-2 border-t border-stone-50">
                                {getActivityIcon(item.type)}
                                <span className="truncate max-w-[150px]">{(item.description || (item.detailedInfo && item.detailedInfo[0].content)).substring(0, 20)}...</span>
                                <ChevronRight size={14} className="ml-auto" />
                            </div>
                          </div>
                      </div>
                    );
                  })}
                </div>
  
                {/* Hand-Drawn Journey Map Section */}
                <div className="px-6 mt-4 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-serif font-bold text-lg text-stone-800">手繪旅程圖</h3>
                        <div className="flex gap-2">
                            {dayData.handDrawnMap && (
                               <button 
                                  onClick={() => {
                                      const updatedDay = { ...dayData, handDrawnMap: null };
                                      setItineraryData({ ...itineraryData, [selectedDay]: updatedDay });
                                  }}
                                  className="text-stone-400 hover:text-red-500 transition-colors"
                               >
                                  <Trash2 size={16} />
                               </button>
                            )}
                            <button 
                              onClick={() => mapInputRef.current?.click()} 
                              className="text-stone-400 hover:text-stone-900 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <input 
                            type="file" 
                            ref={mapInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleMapUpload}
                        />
                    </div>
                    
                    {dayData.handDrawnMap ? (
                        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-stone-100 bg-white cursor-pointer" onClick={() => dayData.handDrawnMap && setFullScreenMap(dayData.handDrawnMap)}>
                            <img src={dayData.handDrawnMap} alt="Journey Map" className="w-full h-auto object-cover" />
                        </div>
                    ) : (
                        <button 
                          onClick={() => mapInputRef.current?.click()}
                          className="w-full h-48 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 text-stone-400 hover:bg-stone-50 hover:border-stone-300 transition-all"
                        >
                            <ImageIcon size={32} className="opacity-50" />
                            <span className="text-sm font-medium">上傳手繪圖或筆記</span>
                        </button>
                    )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 px-6 text-center">
                 <div className="bg-stone-100 p-4 rounded-full mb-4"><Calendar size={48} className="text-stone-300" /></div>
                 <h3 className="text-xl font-serif font-bold text-stone-700 mb-2">暫無行程</h3>
                 <p className="text-stone-400 text-sm">該日期尚未規劃行程資料。</p>
              </div>
            )}
            <div className="h-10" />
          </>
        )}
        {/* ... (Expenses and Tools tabs remain unchanged - omitted for brevity) */}
        {activeTab === 'expenses' && (
        <div className="pt-12 px-6 min-h-screen bg-white">
           <h1 className="text-2xl font-serif font-bold text-stone-800 mb-6">旅行帳本 <span className="text-stone-300 text-sm font-sans font-normal ml-2">Shared Wallet</span></h1>
           <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-stone-800 rounded-full opacity-50 blur-2xl" />
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Total Budget Used</p>
              <h2 className="text-4xl font-mono font-bold mb-1">${Math.floor(totalAmount).toLocaleString()}</h2>
              <p className="text-stone-500 text-xs">Based on current rates</p>
           </div>
           <div ref={expenseScrollRef} className="flex gap-4 mb-6 overflow-x-auto pb-2 hide-scrollbar select-none">
             <button onClick={() => setExpenseFilter('ALL')} className={`flex-shrink-0 h-12 px-5 rounded-full border flex items-center justify-center text-sm font-bold transition-colors ${expenseFilter === 'ALL' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200'}`}>全部</button>
             {USERS.map(user => (
               <button key={user.id} onClick={() => setExpenseFilter(user.id)} className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${expenseFilter === user.id ? 'border-stone-900 scale-110 shadow-md' : 'border-transparent opacity-70 grayscale'} ${user.color}`}>{user.id}</button>
             ))}
           </div>
           <div className="space-y-1 pb-24">
             {filteredExpenses.map(expense => (<ExpenseItem key={expense.id} expense={expense} />))}
           </div>
           <button className="fixed bottom-24 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"><span className="text-2xl font-light">+</span></button>
        </div>
      )}
      {activeTab === 'tools' && (
        <div className="pt-12 px-6">
           <h1 className="text-2xl font-serif font-bold text-stone-800 mb-8">緊急聯絡 & 支援</h1>
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <ToolsCard icon={AlertTriangle} title="警察" content="110" colorClass="bg-red-50 text-red-600" onClick={() => alert('Calling 110...')} />
                 <ToolsCard icon={AlertTriangle} title="救護/火警" content="119" colorClass="bg-red-50 text-red-600" onClick={() => alert('Calling 119...')} />
              </div>
              <div className="pt-6">
                <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">交通卡片 (給司機看)</h2>
                <div 
                  className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => setShowDriverCard(true)}
                >
                   <div className="absolute top-0 left-0 w-1 h-full bg-stone-900" />
                   <p className="text-xs text-stone-400 mb-4">給司機 (TO DRIVER)</p>
                   <p className="text-2xl font-serif font-black text-stone-900 mb-2 leading-tight">ここへ行ってください。<br/><span className="text-lg font-normal text-stone-500">(請載我到這裡)</span></p>
                   <p className="text-stone-300 text-[10px] pt-2 mt-2 border-t border-stone-50">Tap to enlarge</p>
                </div>
              </div>
              <div className="pt-6">
                 <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">實用連結</h2>
                 <button className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><span>Visit Japan Web</span></button>
              </div>
           </div>
        </div>
      )}
      
      {/* Driver Card Overlay */}
      {showDriverCard && (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-fade-in" onClick={() => setShowDriverCard(false)}>
                <div className="absolute top-6 right-6 p-4 bg-stone-100 rounded-full">
                    <X size={32} className="text-stone-500" />
                </div>
                <p className="text-stone-400 mb-8 font-bold tracking-widest uppercase">Tap anywhere to close</p>
                <div className="w-full text-center space-y-4">
                    <h1 className="text-[15vw] font-black text-stone-900 leading-tight font-serif break-words">ここへ行ってください。</h1>
                    <p className="text-2xl text-stone-500 font-medium">( 請載我到這裡 )</p>
                </div>
            </div>
      )}

      {/* Day Edit Modal */}
      {editDayModal && (
          <DayInfoEditModal 
              dayKey={selectedDay} 
              dayData={editDayModal} 
              onClose={() => setEditDayModal(null)} 
              onSave={handleSaveDayInfo} 
          />
      )}
      
      {/* Fullscreen Map Overlay */}
      {fullScreenMap && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setFullScreenMap(null)}>
           <div className="absolute top-6 right-6 p-4 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-colors">
               <X size={32} className="text-white" />
           </div>
           <img src={fullScreenMap} alt="Full Map" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <DetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} onSave={handleSaveActivity} />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default App;