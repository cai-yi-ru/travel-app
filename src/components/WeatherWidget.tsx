
import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, CloudFog, CloudRain, CloudSnow, CloudLightning, Cloud, Loader2, Shirt, ChevronDown, AlertCircle } from 'lucide-react';
import { DayData, WeatherCode } from '../types';
import { LOCATION_COORDS } from '../constants';
import { useDraggableScroll } from '../hooks';

const getWeatherInfo = (code: WeatherCode) => {
  if (code === 0) return { icon: Sun, label: '晴朗', color: 'text-orange-500' };
  if ([1, 2, 3].includes(code)) return { icon: CloudSun, label: '多雲時晴', color: 'text-blue-400' };
  if ([45, 48].includes(code)) return { icon: CloudFog, label: '有霧', color: 'text-stone-400' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: CloudRain, label: '下雨', color: 'text-blue-600' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: CloudSnow, label: '下雪', color: 'text-cyan-400' };
  if ([95, 96, 99].includes(code)) return { icon: CloudLightning, label: '雷雨', color: 'text-purple-500' };
  return { icon: Cloud, label: '多雲', color: 'text-gray-500' };
};

const HourlyWeatherList = ({ weather }: { weather: any[] }) => {
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

export const WeatherWidget = ({ data, dateLabel }: { data: DayData, dateLabel?: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [realWeather, setRealWeather] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchWeather = async () => {
            const coords = LOCATION_COORDS[data.location];
            if (!coords) return;
            setLoading(true);
            try {
                // If dateLabel is already ISO YYYY-MM-DD, use it directly.
                const targetDateStr = dateLabel;
                
                const forecastDaysLimit = 16; 
                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=${forecastDaysLimit}`;
                
                let result;
                try {
                    const externalRes = await fetch(apiUrl);
                    result = await externalRes.json();
                } catch (error) {
                    console.error("Direct fetch failed", error);
                }

                if (!result || result.error) throw new Error("Weather fetch failed");

                let dayIndex = 0;
                let isFallback = false;

                if (targetDateStr && result.daily && result.daily.time) {
                    const idx = result.daily.time.indexOf(targetDateStr);
                    if (idx !== -1) {
                        dayIndex = idx;
                    } else {
                        // Date is out of range
                        dayIndex = 0;
                        isFallback = true;
                    }
                } else {
                    dayIndex = 0;
                    isFallback = true; 
                    if (targetDateStr) isFallback = true;
                }

                const dailyMin = result.daily.temperature_2m_min[dayIndex];
                const dailyMax = result.daily.temperature_2m_max[dayIndex];
                
                let weatherCode;
                if (dayIndex === 0 && result.current) {
                    weatherCode = result.current.weather_code;
                } else {
                    const noonIndex = dayIndex * 24 + 12;
                    if (result.hourly && result.hourly.weather_code && result.hourly.weather_code[noonIndex]) {
                        weatherCode = result.hourly.weather_code[noonIndex];
                    } else {
                        weatherCode = 0; 
                    }
                }

                const currentInfo = getWeatherInfo(weatherCode as WeatherCode);
                
                const hourlyData = [];
                const isToday = dayIndex === 0 && !isFallback; 
                const startHour = isToday ? new Date().getHours() : 0;
                
                for(let i = 0; i < 24; i++) { 
                    const hourIndex = (dayIndex * 24) + i;
                    if (i >= startHour) {
                        if (result.hourly && hourIndex < result.hourly.time.length) {
                            const hCode = result.hourly.weather_code[hourIndex];
                            const hTemp = result.hourly.temperature_2m[hourIndex];
                            const hInfo = getWeatherInfo(hCode as WeatherCode);
                            
                            const timeStr = `${i.toString().padStart(2, '0')}:00`;
                            hourlyData.push({
                                time: timeStr,
                                temp: Math.round(hTemp),
                                icon: hInfo.icon,
                                color: hInfo.color
                            });
                        }
                    }
                }

                setRealWeather({
                    condition: currentInfo.label,
                    tempRange: `${Math.round(dailyMin)}° - ${Math.round(dailyMax)}°`,
                    icon: currentInfo.icon,
                    color: currentInfo.color,
                    hourly: hourlyData,
                    isFallback: isFallback,
                    dateDisplayed: result.daily.time[dayIndex]
                });

            } catch (error) {
                console.error("Failed to fetch weather", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [data.location, dateLabel]);

    const displayWeather = realWeather || { 
        condition: '載入中...', 
        tempRange: '--', 
        icon: Loader2,
        color: 'text-stone-300 animate-spin',
        hourly: [],
        isFallback: false
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
                    {displayWeather.isFallback && !isExpanded && (
                        <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle size={10} /> 顯示今日
                        </span>
                    )}
                    {!isExpanded && <span className="text-[10px] text-stone-400">點擊查看</span>}
                    <ChevronDown size={20} className={`text-stone-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 animate-fade-in">
                    {displayWeather.isFallback && (
                        <div className="mb-4 bg-orange-50 p-3 rounded-xl border border-orange-100 flex gap-3 items-center">
                            <AlertCircle size={16} className="text-orange-500 flex-shrink-0" />
                            <p className="text-xs text-orange-700 font-medium">
                                距離旅程日期尚久 (或日期未定)，目前顯示為 <strong>今日 ({new Date().toLocaleDateString()})</strong> 的天氣實況供參考。
                            </p>
                        </div>
                    )}

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
