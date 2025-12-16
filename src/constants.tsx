
import { Utensils, Bus, ShoppingBag, Ticket, BedDouble, Tag } from 'lucide-react';
import { ExpenseCategoryDef, ItineraryData, UserData, Expense, ChecklistItem, Coupon, TripMetadata } from './types';

export const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  '登別': { lat: 42.4111, lng: 141.1064 },
  '函館': { lat: 41.7687, lng: 140.7291 },
  '洞爺湖': { lat: 42.5896, lng: 140.8257 },
  '札幌': { lat: 43.0618, lng: 141.3545 },
  '小樽': { lat: 43.1907, lng: 140.9947 },
  '北湯澤': { lat: 42.6247, lng: 141.0371 }, // Added for new hotel location
};

export const ACTIVITY_TYPES = [
    { value: 'sightseeing', label: '觀光' },
    { value: 'food', label: '美食' },
    { value: 'hotel', label: '住宿' },
    { value: 'transport', label: '交通' },
    { value: 'shop', label: '購物' },
    { value: 'flight', label: '航班' },
    { value: 'other', label: '其他' },
];

export const EXPENSE_CATEGORIES: ExpenseCategoryDef[] = [
    { value: 'food', label: '飲食', icon: Utensils, color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
    { value: 'transport', label: '交通', icon: Bus, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
    { value: 'shopping', label: '購物', icon: ShoppingBag, color: 'bg-pink-100 text-pink-600', border: 'border-pink-200' },
    { value: 'ticket', label: '門票', icon: Ticket, color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
    { value: 'stay', label: '住宿', icon: BedDouble, color: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
    { value: 'other', label: '其他', icon: Tag, color: 'bg-stone-100 text-stone-600', border: 'border-stone-200' },
];

export const INITIAL_USERS: UserData[] = [
  { id: 'K', name: 'Ken', color: 'bg-blue-100 text-blue-700' },
  { id: 'M', name: 'Mary', color: 'bg-rose-100 text-rose-700' },
  { id: 'E', name: 'Eric', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'G', name: 'Grace', color: 'bg-amber-100 text-amber-700' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 1, title: '團費訂金', amount: 40000, payer: 'K', currency: 'TWD', date: 'Pre-trip', category: 'other' },
  { id: 2, title: '白色戀人伴手禮', amount: 5400, payer: 'M', currency: 'JPY', date: 'Dec 23', category: 'shopping' },
  { id: 3, title: '函館朝市海鮮丼', amount: 8500, payer: 'K', currency: 'JPY', date: 'Dec 22', category: 'food' },
  { id: 4, title: '便利商店零食', amount: 1200, payer: 'E', currency: 'JPY', date: 'Dec 20', category: 'food' },
];

// Changed from Object to Array
export const INITIAL_ITINERARY_DATA: ItineraryData = [
  {
    date: '2025-12-20',
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
        subtitle: '集合：05:30 高雄機場',
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
            { title: '集合資訊', content: '集合時間：12/20 05:30。地點：高雄小港機場 台灣虎航 櫃台。' },
            { title: '送機人員', content: '高雄小港機場送機：0978-506-677。' },
            { title: '航班資訊', content: '台灣虎航 IT260 | 08:00 高雄機場(KHH) 起飛 -> 12:55 抵達札幌新千歲(CTS)。' }
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
        title: '登別 石水亭',
        subtitle: 'NOBORIBETSU SEKISUITEI',
        japaneseName: '登別 石水亭',
        TaiwanName: '登別 石水亭',
        image: 'https://images.unsplash.com/photo-1563804806467-2c6364483a04?auto=format&fit=crop&w=800',
        address: '北海道登別市登別溫泉町203-1',
        gpsPhone: '0143-84-2255',
        detailedInfo: [
            { title: '住宿', content: '登別 石水亭 (NOBORIBETSU SEKISUITEI)。' },
            { title: '電話', content: '81-143-842255' },
            { title: '溫泉', content: '擁有多種泉質，能舒緩旅途疲勞，設有大浴場與露天風呂。' }
        ]
      }
    ]
  },
  {
    date: '2025-12-21',
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
            { title: '香風景百選', content: '登別溫泉地獄谷是日本著名溫泉登別溫泉的水源，四處可見赤紅色的岩石及黃灰色的岩丘，裂縫噴出的溫泉、蒸氣、以及火山煤氣，硫磺的濃烈氣味瀰漫，「地獄谷」因而得名，被認定為「香風景百選」及「北海道遺產」。' },
            { title: '遊步道', content: '沿著木棧道行走，近距離感受大自然的震撼力量與地熱奇景。' }
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
            { title: '尼克斯城', content: '位於園區中心的歐風城堡，其實是四層樓高之新型水族館，館內最具特色的是高達8公尺的廣角大型水槽「水晶塔」，以及北海道第一座水中隧道「AQUA隧道」，穿越其中彷彿置身於海中散步。' },
            { title: '必看表演', content: '最受萬眾期待的非【企鵝遊行】莫屬，可近距離看著企鵝們列隊搖搖擺擺晃步逛街的可愛模樣，總引得現場尖叫聲與快門聲不斷。' },
            { title: '銀河水槽', content: '一萬隻沙丁魚組成的魚群悠遊於水槽之中，折射水光閃閃發亮猶如銀河。' }
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
            { title: '金森倉庫群', content: '以紅磚砌築而成的金森倉庫群，座落於北海道道南圈函館市的港灣旁，在明治時代末期主要用來保存於港口卸船的海產物，如今則是規劃為購物商城，設有金森洋物館、歷史廣場、金森廳、啤酒屋等商場食店。' },
            { title: '函館明治館', content: '由函館郵局改建於1911年，木製窗框和地板都保有當時建築原貌。館內可欣賞世界各地音樂盒，或在玻璃工房觀賞製作玻璃製品過程。' },
            { title: '函館海鮮市場', content: '西波止場附近的室內賣場，從毛蟹、扇貝、三文魚等新鮮漁貨，到各式加工後的漬物或乾貨，應有盡有。' }
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
            { title: '纜車體驗', content: '函館山纜車設立於1958年，偌大的車廂可容納至125人，纜車每10分鐘一班，由山麓站出發只需要3分鐘就能到達山頂。隨著車廂節節升高，開闊的美麗景色也逐一映入眼簾。' }
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
        title: '函館 啄木亭',
        subtitle: 'YUMOTO TAKUBOKUTEI',
        japaneseName: '湯元 啄木亭',
        TaiwanName: '函館 啄木亭',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800',
        address: '北海道函館市湯川町1丁目18番15號',
        gpsPhone: '0138-59-5355',
        detailedInfo: [
            { title: '住宿', content: '函館 啄木亭 (YUMOTO TAKUBOKUTEI)。' },
            { title: '電話', content: '81-138-59-5355' },
            { title: '湯之川溫泉', content: '入住著名的湯之川溫泉區，飯店頂樓設有空中露天風呂，可眺望函館市街與海景。' }
        ]
      }
    ]
  },
  {
    date: '2025-12-22',
    location: '北湯澤',
    dayLabel: 'Day 3',
    heroImage: 'https://images.unsplash.com/photo-1566465079974-32dc3775e13d?auto=format&fit=crop&w=800',
    title: 'Day 3 函館至北湯澤',
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
            { title: '歷史背景', content: '建於西元1898年，位於函館市外圍近湯之川溫泉的清幽之地。由當時法國派遣而來傳道的八名修女所建立的修道院，其建築與庭園都洋溢著濃郁的歐洲氣息。' },
            { title: '參訪須知', content: '修道院內有資料展示室，展示當年修女傳道的生涯事蹟。現今仍有修女在修道院內生活，在參訪的時候請放輕聲量，維護院內寧靜平和的氛圍。' },
            { title: '必吃美食', content: '修道院門口的「市民之森」販賣部，其牛奶冰淇淋口感極其濃郁，被公認為函館最好吃的冰淇淋之一。' }
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
            { title: '北海道三大市場', content: '為北海道三大傳統市場之一，是踏訪函館不可錯過的美味景點。市場一帶集中了大小400多家水產店，形成了一個獨據特色的大型市場。' },
            { title: '充滿市氣', content: '市場嘈嘈嚷嚷，各式小販活力滿滿地吆喝叫賣，色澤誘人的新鮮海產、飄著奶油香的現烤扇貝、鮮美海鮮丼，叫賣聲不絕於耳。' }
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
            { title: '北國輕井澤', content: '有「北國輕井澤」之稱，湖上計有126個浮島，由18座橋連結各島，倒映在大沼湖面的駒之岳，是日本新三景之一。' },
            { title: '自然寶庫', content: '這裡還是原生林和野鳥的寶庫，一年四季景致充滿變化，讓您在絕美的湖光山色中享受片刻寧靜。此地也是著名歌曲「千之風化作」的誕生地。' }
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
            { title: '全景視野', content: '這座寬闊的火山口湖，20世紀初火山爆發頻繁，陷沒後形成了這座湖泊。由於地處溫泉區，湖面在冬天也不會凍結。我們將於展望台上眺望洞爺湖風光。' },
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
        title: '北湯澤 森之空庭',
        subtitle: 'KITAYUZAWA MORI NO SORANIWA',
        japaneseName: 'きたゆざわ 森のソラニワ',
        TaiwanName: '北湯澤 森之空庭',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800',
        address: '北海道伊達市大滝區北湯澤溫泉町300-7',
        gpsPhone: '0142-68-6677',
        detailedInfo: [
            { title: '住宿', content: '北湯澤 森之空庭 (KITAYUZAWA MORI NO SORANIWA)。' },
            { title: '電話', content: '81-142-686677' },
            { title: '溫泉', content: '佔地廣大的溫泉度假村，設有豐富的溫泉設施與露天風呂。' }
        ]
      }
    ]
  },
  {
     date: '2025-12-23',
     location: '札幌',
     dayLabel: 'Day 4',
     heroImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800',
     title: 'Day 4 札幌市區',
     subtitle: '白色戀人與燈樹節',
     clothing: '可能遇到下雪，建議穿著防滑靴子。',
     activities: [
        { id: '400', time: '07:30', type: 'food', title: '早餐：飯店內早餐', subtitle: '活力早餐', japaneseName: '朝食', TaiwanName: '飯店早餐', image: 'https://images.unsplash.com/photo-1525351462161-f212f29e47ce?auto=format&fit=crop&w=800', detailedInfo: [{ title: '內容', content: '飯店內享用早餐。' }] },
        { id: '401', time: '09:30', type: 'sightseeing', title: '北海道神宮', subtitle: '守護北海道的神社', japaneseName: '北海道神宮', TaiwanName: '北海道神宮', image: 'https://images.unsplash.com/photo-1575395333749-964920fb3490?auto=format&fit=crop&w=800', parking: '北海道神宮西駐車場', gpsPhone: '011-611-0261', detailedInfo: [{ title: '開拓之神', content: '在北海道神宮，大國魂神是北海道國土之神、大那牟遲神是國土經營、開拓之神，少彥名神是國土經營、醫藥、造酒之神而明治天皇則是奠定日本現代基礎的天皇。' }, { title: '正門朝東北', content: '北海道神宮的正門面朝東北，這是因為當初在開拓北海道時，俄國已決定進入樺太及千島地區，所以把北海道神宮面朝這個方向以保護人民。' }, { title: '免稅店', content: '行程包含前往免稅店(停留約一小時)，店裡有琳瑯滿目的日本製商品任您選購，還有安排中文解說店員為您服務。' }] },
        { id: '402', time: '13:00', type: 'sightseeing', title: '白色戀人公園', subtitle: '石屋製果觀光工廠', japaneseName: '白い恋人パーク', TaiwanName: '白色戀人公園', image: 'https://images.unsplash.com/photo-1523631942276-b44290378974?auto=format&fit=crop&w=800', parking: '白い恋人パーク駐車場', gpsPhone: '011-666-1481', detailedInfo: [{ title: '夢幻城堡', content: '除了有北海道知名的餅乾「白色戀人」的生產工廠外，還有咖啡店，以及白色戀人餅乾的體驗工房。另外還有各式玩具的收藏展示室。' }, { title: '歐式庭園', content: '整個園區像是童話中的糖果屋，空氣中瀰漫著香甜的巧克力味，館內陳列展示著巧克力的起源、製作的歷史，及精美的古董巧克力杯。' }] },
        { id: '403', time: '12:30', type: 'food', title: '午餐：日式燒肉 或 海鮮鍋物', subtitle: '餐標 2500 日幣', japaneseName: '焼肉 / 海鮮鍋', TaiwanName: '日式燒肉', image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=800', detailedInfo: [{ title: '內容', content: '享用日式燒肉 或 海鮮鍋物風味料理。' }] },
        { id: '404', time: '16:00', type: 'shop', title: '狸小路商店街', subtitle: '特別安排逛街', japaneseName: '狸小路商店街', TaiwanName: '狸小路商店街', image: 'https://images.unsplash.com/photo-1559260934-9b2743f4c489?auto=format&fit=crop&w=800', parking: '周邊收費停車場', gpsPhone: '011-241-5184', detailedInfo: [{ title: '購物天堂', content: '特別安排前往札幌最熱鬧的傳統商店街【狸小路】自由逛街購物，感受北國夜生活的熱鬧風情。藥妝、土產店林立。' }] },
        { id: '405', time: '18:00', type: 'food', title: '晚餐：方便逛街~敬請自理', subtitle: '推薦美食', japaneseName: '夕食：自理', TaiwanName: '晚餐推薦', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=800', detailedInfo: [{ title: '推薦 1：湯咖哩 GARAKU', content: '札幌超人氣排隊名店，湯頭濃郁鮮甜。必點「燉豬肉湯咖哩」。' }, { title: '推薦 2：空拉麵', content: '狸小路內的味噌拉麵名店，使用北海道產味噌，香氣十足。' }, { title: '推薦 3：Suage+', content: '知床雞串燒湯咖哩是招牌，蔬菜鮮甜好吃。' }], recommendations: [{ name: '湯咖哩 GARAKU', dish: 'とろとろ炙り焙煎角煮', note: '燉豬肉湯咖哩' }, { name: '空拉麵', dish: '味噌ラーメン', note: '味噌拉麵' }, { name: 'Suage+', dish: 'パリパリ知床鶏と野菜カレー', note: '知床雞湯咖哩' }] },
        { id: '406', time: '19:30', type: 'sightseeing', title: '大通公園', subtitle: '札幌白色燈樹節', japaneseName: 'さっぽろホワイトイルミネーション', TaiwanName: '大通公園', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800', detailedInfo: [{ title: '季節限定', content: '★特別安排：欣賞札幌白色燈樹節。始於1981年，是日本第一個彩燈節。從JR札幌站前到市中心的大通公園道路，傍晚至晚上十點，會場將被數十萬個美麗的小燈泡點亮。' }, { title: '三大區域', content: '主要分三個區域：大通公園(至12月下旬)、札幌站前大道(至2月中旬)、南一條大道(至3月中旬)。' }] },
        { id: '407', time: '21:00', type: 'hotel', title: '札幌 水星飯店', subtitle: 'MERCURE HOTEL SAPPORO', japaneseName: 'メルキュールホテル札幌', TaiwanName: '札幌 水星飯店', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800', address: '北海道札幌市中央區南4條西2丁目2-4', gpsPhone: '011-513-1100', detailedInfo: [{ title: '住宿', content: '札幌 水星飯店 (MERCURE HOTEL SAPPORO)。' }, { title: '電話', content: '81-11-5131100' }] }
     ]
  },
  {
    date: '2025-12-24',
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
            { title: '小樽運河', content: '興建於1914年，耗時9年完工。運河沿岸紅磚倉庫鱗比櫛次，印證小樽作為往日北海道金融、經濟中心的繁榮景象。如今步道寬敞平緩，是遊客漫步賞景的好去處。' },
            { title: '北一硝子館', content: '「硝子」是日文玻璃之意。北一硝子是小樽最具盛名的玻璃工藝品店，其中最具代表性的「三號館」是使用歷史建物的倉庫改裝而成，內部使用167盞油燈，洋溢著特有的風情。' },
            { title: '歐風蒸氣鐘', content: '位於小樽音樂盒堂前，是與加拿大溫哥華Gastown的蒸氣時鐘同型，目前是電動式時鐘，以電子控制讓鍋爐沸騰產生蒸氣。每隔15分鐘就會以蒸氣奏出5個音階旋律。' },
            { title: '音樂盒堂', content: '本館座落在洋溢著歐洲風情的童話十字路口上，店內蒐羅來自世界各地多達數千種工藝細膩的音樂盒，是挑選紀念品的好去處。★加贈：小樽不思議泡芙每人一顆。' }
        ],
        details: { gift: '贈送不思議泡芙每人一顆' }
      },
      {
        id: '502',
        time: '12:30',
        type: 'food',
        title: '午餐：方便逛街~敬請自理',
        subtitle: '小樽美食推薦',
        japaneseName: '昼食：自理',
        TaiwanName: '午餐推薦',
        image: 'https://images.unsplash.com/photo-1559969143-b2def2575d2d?auto=format&fit=crop&w=800',
        detailedInfo: [
            { title: '推薦 1：小樽政壽司', content: '漫畫「將太的壽司」場景，小樽最知名的壽司老店。必吃「烏賊素麵」。' },
            { title: '推薦 2：LeTAO', content: '必吃「雙層乳酪蛋糕」，入口即化，濃郁奶香。' },
            { title: '推薦 3：北果樓', content: '必買「夢不思議泡芙」，外皮酥脆，內餡爆漿。' }
        ],
        recommendations: [
            { name: '小樽政壽司', dish: '名物 元祖いかそうめん', note: '元祖烏賊素麵' },
            { name: 'LeTAO', dish: 'ドゥーブルフロマージュ', note: '雙層乳酪蛋糕' },
            { name: '北果樓', dish: '夢不思議シュークリーム', note: '夢不思議泡芙' }
        ]
      },
      {
        id: '503',
        time: '15:30',
        type: 'shop',
        title: '三井暢貨園區',
        subtitle: '札幌北廣島 OUTLET',
        japaneseName: '三井アウトレットパーク 札幌北広島',
        TaiwanName: '三井 Outlet',
        image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800',
        parking: '無料駐車場',
        gpsPhone: '011-377-3200',
        detailedInfo: [
            { title: '購物天堂', content: '這裡網羅了近130家世界一流品牌，有女裝、男裝、童裝以及運動和戶外、時尚、生活用品等。' },
            { title: '美食街', content: '還有容納650個座位的大型美食街，彙集豐富名產和當地農產品的「北海道本地農場樂園」。' }
        ]
      },
      {
        id: '504',
        time: '19:00',
        type: 'food',
        title: '晚餐：三大螃蟹吃到飽',
        subtitle: '酒水無限暢飲',
        japaneseName: '三大カニ食べ放題',
        TaiwanName: '螃蟹吃到飽',
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800', 
        detailedInfo: [
            { title: '豪華饗宴', content: '帝王蟹、長腳蟹、毛蟹三大螃蟹吃到飽 + 酒水無限暢飲 (餐標 7500 日幣)。' }
        ]
      },
      {
        id: '505',
        time: '21:00',
        type: 'hotel',
        title: '札幌 萬怡酒店',
        subtitle: 'COURTYARD BY MARRIOTT SAPPORO',
        japaneseName: 'コートヤード・バイ・マリオット札幌',
        TaiwanName: '札幌 萬怡酒店',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800',
        address: '北海道札幌市中央區南10條西1丁目1-57',
        gpsPhone: '011-206-0039',
        detailedInfo: [{ title: '特色', content: '保證入住國際五星級萬怡飯店，享受頂級住宿體驗。' }, { title: '電話', content: '81-11-206-0039' }]
      }
    ]
  },
  {
    date: '2025-12-25',
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
            { title: '札幌時計台', content: '北海道札幌市著名地標，正式名稱為「舊札幌農業學校演武場」。美式風格的木造建築，白色的牆身搭配紅色的屋頂，左右對稱的格局有鐘塔矗立於中，是日本國家重要文化財。' },
            { title: '北海道舊道廳', content: '舊道廳是北海道開拓時期的最高行政中心，現已功成身退，但是卻成為札幌最具代表性的建築物之一，同時也被指定為國家重要文化財。據說，舊道廳所有的建材幾乎都是出自北海道。' }
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
            { title: '互動體驗', content: '園內生活著12種不同的馬兒，為貼近馬兒與大自然嬉戲玩耍，特別安排互動體驗：每人一次騎馬或馬車體驗(僅2選1)。' },
            { title: 'K\'s花園', content: '公園內有一處K\'s花園，是以大人的庭園為概念來設計，各式草木與花朵交織成為一個悠閒的療癒空間。' }
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
        flightInfo: {
            date: '2025/12/25 (四)',
            airline: '台灣虎航',
            flightNo: 'IT261',
            bookingCode: 'KHH888',
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
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800',
        detailedInfo: [{ title: '結束', content: '行程結束，期待下次再見！' }]
      }
    ]
  }
];

// --- Initial Data for Lists ---

export const INITIAL_PACKING_LIST: ChecklistItem[] = [
    // 重要證件 (出国相关文件)
    { id: '1', text: '護照正本 (有效期 6 個月以上)', isChecked: false, category: '重要證件與票卷', owner: 'ALL' },
    { id: '2', text: '護照影本 (建議與正本分開放)', isChecked: false, category: '重要證件與票卷', owner: 'ALL' },
    { id: '3', text: '簽證 (確認是否需要)', isChecked: false, category: '重要證件與票卷', owner: 'ALL' },
    { id: '4', text: '信用卡 (建議帶2張/JCB/訂房卡)', isChecked: false, category: '重要證件與票卷', owner: 'M' },
    { id: '5', text: '國際駕照 + 日文譯本 (若自駕)', isChecked: false, category: '重要證件與票卷', owner: 'K' },
    { id: '6', text: '日幣現金 (不同面額)', isChecked: false, category: '重要證件與票卷', owner: 'K' },
    { id: '7', text: '些許台幣 (回國搭車/急用)', isChecked: false, category: '重要證件與票卷', owner: 'K' },
    { id: '8', text: '飯店住宿確認信 (入住憑證)', isChecked: false, category: '重要證件與票卷', owner: 'ALL' },
    { id: '9', text: '機票憑證 (紙本備份)', isChecked: false, category: '重要證件與票卷', owner: 'ALL' },
    { id: '10', text: 'Visit Japan Web QR Code (截圖)', isChecked: false, category: '重要證件與票卷', owner: 'ALL' },
    { id: '11', text: '筆記本 & 筆 (填寫入境卡用)', isChecked: false, category: '重要證件與票卷', owner: 'ALL' },

    // 隨身行李規定 (提醒)
    { id: '15', text: '★ 行動電源/鋰電池 (務必隨身，不可託運)', isChecked: false, category: '隨身手提行李 (Must Carry On)', owner: 'ALL' },
    { id: '16', text: '液體限制 (單瓶100ml內，裝於透明夾鏈袋)', isChecked: false, category: '隨身手提行李 (Must Carry On)', owner: 'ALL' },
    { id: '17', text: '打火機 (限1枚，不可託運)', isChecked: false, category: '隨身手提行李 (Must Carry On)', owner: 'K' },
    { id: '18', text: '摺疊雨傘 / 輕便雨衣', isChecked: false, category: '隨身手提行李 (Must Carry On)', owner: 'E' },
    { id: '19', text: '薄外套 (飛機上冷)', isChecked: false, category: '隨身手提行李 (Must Carry On)', owner: 'ALL' },
    { id: '20', text: '可折疊水瓶 (機場安檢後裝水)', isChecked: false, category: '隨身手提行李 (Must Carry On)', owner: 'ALL' },
    { id: '21', text: '護手霜 / 護唇膏 (機上乾燥)', isChecked: false, category: '隨身手提行李 (Must Carry On)', owner: 'M' },

    // 托運 (Check In)
    { id: '25', text: '刀具 (含指甲剪) - 務必托運', isChecked: false, category: '托運行李 (Must Check In)', owner: 'ALL' },
    { id: '26', text: '長柄傘 - 務必托運', isChecked: false, category: '托運行李 (Must Check In)', owner: 'ALL' },
    { id: '27', text: '自拍棒/腳架 (管徑>1cm 或 高度>60cm) - 務必托運', isChecked: false, category: '托運行李 (Must Check In)', owner: 'ALL' },

    // 盥洗與日常用品 (个人用品)
    { id: '30', text: '牙刷、牙膏、牙線 (日本部分飯店不主動提供)', isChecked: false, category: '盥洗與日常用品', owner: 'ALL' },
    { id: '31', text: '沐浴乳、洗髮精、潤髮乳 (旅行組)', isChecked: false, category: '盥洗與日常用品', owner: 'ALL' },
    { id: '32', text: '洗面乳、卸妝用品、毛巾', isChecked: false, category: '盥洗與日常用品', owner: 'M' },
    { id: '33', text: '保養品 (精華液、乳液、化妝棉)', isChecked: false, category: '盥洗與日常用品', owner: 'M' },
    { id: '34', text: '衛生用品 (衛生棉、衛生紙、濕紙巾)', isChecked: false, category: '盥洗與日常用品', owner: 'G' },
    { id: '35', text: '刮鬍刀 (男)', isChecked: false, category: '盥洗與日常用品', owner: 'K' },
    { id: '36', text: '視力用品 (眼鏡/隱形眼鏡/藥水)', isChecked: false, category: '盥洗與日常用品', owner: 'ALL' },
    { id: '37', text: '梳子 / 鏡子', isChecked: false, category: '盥洗與日常用品', owner: 'M' },
    { id: '38', text: '防曬乳 / 防蚊液', isChecked: false, category: '盥洗與日常用品', owner: 'ALL' },
    { id: '39', text: '口罩 (飛機 & 公共場所)', isChecked: false, category: '盥洗與日常用品', owner: 'ALL' },
    { id: '39-1', text: '酒精消毒噴霧', isChecked: false, category: '盥洗與日常用品', owner: 'ALL' },

    // 藥物 (Medicine)
    { id: '50', text: '腸胃藥 (止瀉/胃藥)', isChecked: false, category: '藥物', owner: 'K' },
    { id: '51', text: '感冒藥 (綜合感冒藥)', isChecked: false, category: '藥物', owner: 'K' },
    { id: '52', text: '止痛藥 (頭痛/經痛)', isChecked: false, category: '藥物', owner: 'K' },
    { id: '53', text: '過敏藥 (鼻炎/皮膚)', isChecked: false, category: '藥物', owner: 'K' },
    { id: '54', text: '暈車/暈機藥', isChecked: false, category: '藥物', owner: 'K' },
    { id: '55', text: '外傷藥 (OK繃/藥膏)', isChecked: false, category: '藥物', owner: 'K' },
    { id: '56', text: '眼藥水', isChecked: false, category: '藥物', owner: 'ALL' },

    // 衣物與配件 (Clothing)
    { id: '40', text: '貼身衣物 (內衣褲/襪子)', isChecked: false, category: '衣物與配件', owner: 'ALL' },
    { id: '41', text: '睡衣 / 睡褲', isChecked: false, category: '衣物與配件', owner: 'ALL' },
    { id: '42', text: '日常衣服 (視天數)', isChecked: false, category: '衣物與配件', owner: 'ALL' },
    { id: '43', text: '發熱衣 / 發熱褲 (視季節)', isChecked: false, category: '衣物與配件', owner: 'ALL' },
    { id: '44', text: '保暖外套 (羽絨/風衣)', isChecked: false, category: '衣物與配件', owner: 'ALL' },
    { id: '45', text: '配件 (帽子/圍巾/手套)', isChecked: false, category: '衣物與配件', owner: 'M' },
    { id: '46', text: '太陽眼鏡 / 墨鏡', isChecked: false, category: '衣物與配件', owner: 'M' },
    { id: '47', text: '好走的鞋 / 運動鞋', isChecked: false, category: '衣物與配件', owner: 'ALL' },
    { id: '48', text: '拖鞋 (飯店內或飛機上穿)', isChecked: false, category: '衣物與配件', owner: 'ALL' },
    { id: '49', text: '零錢包 (日本零錢多)', isChecked: false, category: '衣物與配件', owner: 'ALL' },

    // 3C 電子相關
    { id: '60', text: '手機', isChecked: false, category: '3C 電子產品', owner: 'ALL' },
    { id: '61', text: '充電器 / 充電線 (Type-C/Lightning)', isChecked: false, category: '3C 電子產品', owner: 'ALL' },
    { id: '62', text: '萬國轉接頭 (日本雙孔扁插)', isChecked: false, category: '3C 電子產品', owner: 'K' },
    { id: '63', text: '耳機', isChecked: false, category: '3C 電子產品', owner: 'ALL' },
    { id: '64', text: '上網 SIM 卡 / WiFi 機', isChecked: false, category: '3C 電子產品', owner: 'E' },
    { id: '65', text: '自拍棒 / 相機腳架 (短的)', isChecked: false, category: '3C 電子產品', owner: 'M' },
    { id: '66', text: '相機 (含記憶卡/電池/充電器)', isChecked: false, category: '3C 電子產品', owner: 'E' },
    { id: '67', text: '行李秤 (避免超重)', isChecked: false, category: '3C 電子產品', owner: 'M' },

    // 其他小物
    { id: '70', text: '衣物壓縮袋', isChecked: false, category: '其他小物', owner: 'M' },
    { id: '71', text: '塑膠袋 (裝髒衣物/垃圾)', isChecked: false, category: '其他小物', owner: 'G' },

    // 回台禁帶物品 (提醒) - NEW
    { id: '90', text: '❌ 新鮮蔬果 (哈密瓜、草莓、蘋果等)', isChecked: false, category: '回台禁帶物品 (提醒)', owner: 'ALL' },
    { id: '91', text: '❌ 肉類製品 (肉乾、火腿、香腸)', isChecked: false, category: '回台禁帶物品 (提醒)', owner: 'ALL' },
    { id: '92', text: '❌ 含肉塊泡麵 (部分含肉乾燥包不可)', isChecked: false, category: '回台禁帶物品 (提醒)', owner: 'ALL' },
    { id: '93', text: '❌ 溫泉蛋 / 未全熟蛋製品', isChecked: false, category: '回台禁帶物品 (提醒)', owner: 'ALL' },
    { id: '94', text: '❌ 含土植物 / 生鮮種子', isChecked: false, category: '回台禁帶物品 (提醒)', owner: 'ALL' },
    { id: '95', text: '❌ 電子菸 / 加熱菸 (嚴格禁止)', isChecked: false, category: '回台禁帶物品 (提醒)', owner: 'ALL' },
];

export const INITIAL_SHOPPING_LIST: ChecklistItem[] = [
    { id: '1', text: 'EVE 止痛藥 (藍色)', isChecked: false, category: '藥妝', owner: 'K' },
    { id: '2', text: '大正百保能感冒微粒', isChecked: false, category: '藥妝', owner: 'M' },
    { id: '3', text: '合利他命 EX Plus', isChecked: false, category: '藥妝', owner: 'E' },
    { id: '4', text: 'DHC 護唇膏', isChecked: false, category: '藥妝', owner: 'G' },
    { id: '5', text: 'Alfort 帆船巧克力', isChecked: false, category: '零食', owner: 'K' },
    { id: '6', text: '白色戀人', isChecked: false, category: '零食', owner: 'M' },
    { id: '7', text: '六花亭 萊姆葡萄奶油夾心餅', isChecked: false, category: '零食', owner: 'ALL' },
    { id: '8', text: 'UNIQLO 發熱衣', isChecked: false, category: '服飾', owner: 'E' },
];

export const INITIAL_COUPONS: Coupon[] = [
    { id: '1', title: '唐吉訶德', description: '免稅 10% + 折扣 5% (滿 10,000 日圓)', expiryDate: '2025-12-31' },
    { id: '2', title: 'Bic Camera', description: '免稅 10% + 折扣 7% (電器)', expiryDate: '2025-12-31' },
    { id: '3', title: '松本清', description: '免稅 10% + 折扣 3%~7%', expiryDate: '2025-12-31' },
];

// --- Initial Data for Dashboard (Multi-Trip) ---

// 預設空白行程也使用 ISO Date Key
export const BLANK_ITINERARY: ItineraryData = [
    {
        date: '2026-01-01',
        location: '目的地', dayLabel: 'Day 1', heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800',
        title: 'Day 1 出發', subtitle: '旅程開始', clothing: '舒適輕便', activities: []
    }
];

export const INITIAL_TRIPS: TripMetadata[] = [
    { id: 'hokkaido_trip', title: 'Hokkaido Family Trip', subtitle: '北海道 2026', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800', startDate: '2025-12-20' },
];
