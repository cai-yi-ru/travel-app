
import { LucideIcon } from 'lucide-react';

export type WeatherCode = 0 | 1 | 2 | 3 | 45 | 48 | 51 | 53 | 55 | 56 | 57 | 61 | 63 | 65 | 66 | 67 | 80 | 81 | 82 | 71 | 73 | 75 | 77 | 85 | 86 | 95 | 96 | 99;

export interface DetailedInfo {
  title: string;
  content: string;
}

export interface Recommendation {
  name: string;
  dish: string;
  note: string;
}

export interface FlightInfo {
  date: string;
  airline: string;
  flightNo: string;
  bookingCode: string;
  dep: { city: string; code: string; time: string; terminal: string };
  arr: { city: string; code: string; time: string; terminal: string };
  duration: string;
}

export interface Activity {
  id: string;
  time: string;
  type: 'flight' | 'food' | 'sightseeing' | 'transport' | 'hotel' | 'shop' | 'other';
  title: string;
  subtitle?: string;
  japaneseName?: string;
  TaiwanName?: string;
  description?: string;
  image?: string;
  images?: string[]; // Added: Support for multiple images
  address?: string;
  parking?: string;
  gpsPhone?: string;
  menuRec?: string[];
  details?: Record<string, string>;
  detailedInfo?: DetailedInfo[];
  recommendations?: Recommendation[];
  flightInfo?: FlightInfo;
  endTime?: string;
}

export interface DayData {
  date: string; // Changed: Date is now a field inside the object
  location: string;
  dayLabel: string;
  heroImage: string;
  title: string;
  subtitle: string;
  clothing: string;
  handDrawnMap?: string | null;
  activities: Activity[];
}

export type ItineraryData = DayData[]; // Changed: Itinerary is now an array of days

export interface UserData {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  payer: string;
  currency: 'TWD' | 'JPY';
  date: string;
  image?: string;
  category: 'food' | 'transport' | 'shopping' | 'ticket' | 'stay' | 'other';
}

export interface ExpenseCategoryDef {
    value: Expense['category'];
    label: string;
    icon: LucideIcon;
    color: string;
    border: string;
}

// --- New Types for Lists ---

export interface ChecklistItem {
    id: string;
    text: string;
    isChecked: boolean;
    category: string; // Added for grouping
    owner?: string; // User ID or 'ALL'
    image?: string; // Added: Image for checklist item
}

export interface Coupon {
    id: string;
    title: string;
    description?: string;
    image?: string; // For barcode or QR code
    expiryDate?: string;
}

export interface TripMetadata {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    startDate: string;
}
