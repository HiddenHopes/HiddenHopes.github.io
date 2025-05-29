import React, { ReactElement, useState, useRef, useEffect } from 'react';
import { FaCloudSun, FaCloudRain, FaCloudShowersHeavy, FaSnowflake, FaWaveSquare, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

// Colorful icons for all weather types
const weatherIcons: Record<string, ReactElement> = {
  Clear: <FaCloudSun style={{ color: '#f7c948', filter: 'drop-shadow(0 0 2px #f7c948)' }} />,
  Rain: <FaCloudRain style={{ color: '#2196f3', filter: 'drop-shadow(0 0 2px #2196f3)' }} />,
  Drizzle: <FaCloudShowersHeavy style={{ color: '#4fc3f7', filter: 'drop-shadow(0 0 2px #4fc3f7)' }} />,
  Snow: <FaSnowflake style={{ color: '#90caf9', filter: 'drop-shadow(0 0 2px #90caf9)' }} />,
  Clouds: <FaCloudSun style={{ color: '#90a4ae', filter: 'drop-shadow(0 0 2px #90a4ae)' }} />,
};

const LOCAL_STORAGE_KEY = 'weather_location';
const SAVED_LOCATIONS_KEY = 'weather_saved_locations';

const WeatherUpdate: React.FC = () => {
  const [weather, setWeather] = useState<string>('');
  const [temp, setTemp] = useState<number | null>(null);
  const [desc, setDesc] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [place, setPlace] = useState<string>('');
  const [wind, setWind] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [forecast, setForecast] = useState<Array<{ date: string; min: number; max: number; code: number[] }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Earthquake state
  const [earthquakes, setEarthquakes] = useState<Array<any>>([]);
  const [quakeLoading, setQuakeLoading] = useState(false);
  const [quakeError, setQuakeError] = useState('');

  // Add state for lat/lon
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // On mount, check localStorage for saved location
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
          setCoords({ lat: parsed.lat, lon: parsed.lon });
          setPlace(parsed.place || '');
          // Only fetch weather data, do not open the popup
          fetchWeatherForCoords(parsed.lat, parsed.lon, parsed.place || '');
        }
      } catch {}
    }
    // Load saved locations
    const locs = localStorage.getItem(SAVED_LOCATIONS_KEY);
    if (locs) {
      try {
        setSavedLocations(JSON.parse(locs));
      } catch {}
    }
    // Ensure popup is closed on mount
    setShow(false);
  }, []);

  // Helper to fetch weather for given coords
  async function fetchWeatherForCoords(lat: number, lon: number, placeName?: string) {
    setLoading(true);
    setError('');
    // setShow(true); // Remove this line
    try {
      // Place name
      if (!placeName) {
        try {
          const placeRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const placeData = await placeRes.json();
          placeName = placeData.address?.city || placeData.address?.town || placeData.address?.village || placeData.address?.state || '';
        } catch {
          placeName = '';
        }
      }
      setPlace(placeName || '');
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ lat, lon, place: placeName }));
      // Weather
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.current_weather) {
        setTemp(data.current_weather.temperature);
        setWeather(data.current_weather.weathercode);
        setDesc('');
        setWind(data.current_weather.windspeed ?? null);
        setHumidity(data.current_weather.relativehumidity ?? null);
        setLastUpdated(new Date());
      } else {
        setError('Weather unavailable');
        setWind(null);
        setHumidity(null);
        setLastUpdated(null);
      }
      // 7-day forecast
      if (data.daily && data.daily.time && data.daily.temperature_2m_min && data.daily.temperature_2m_max && data.daily.weathercode) {
        const forecastArr = data.daily.time.map((date: string, i: number) => ({
          date,
          min: data.daily.temperature_2m_min[i],
          max: data.daily.temperature_2m_max[i],
          code: data.daily.weathercode[i],
        }));
        setForecast(forecastArr);
      } else {
        setForecast([]);
      }
      // Fetch recent earthquakes near the location
      fetchEarthquakes(lat, lon);
      setLoading(false);
    } catch (e) {
      setError('Failed to fetch weather');
      setLoading(false);
    }
  }

  // Helper to fetch earthquakes near a lat/lon
  async function fetchEarthquakes(lat: number, lon: number) {
    setQuakeLoading(true);
    setQuakeError('');
    setEarthquakes([]);
    try {
      // USGS API: earthquakes in last 7 days, within 300km
      const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=300&starttime=${new Date(Date.now() - 7*24*60*60*1000).toISOString().slice(0,10)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        setEarthquakes(data.features);
      } else {
        setEarthquakes([]);
      }
    } catch {
      setQuakeError('Failed to fetch earthquake data');
    }
    setQuakeLoading(false);
  }

  // Fetch weather and earthquakes when location is determined
  const fetchWeather = async () => {
    if (coords) {
      setShow(true); // Only open popup on user action
      fetchWeatherForCoords(coords.lat, coords.lon, place);
      return;
    }
    setLoading(true);
    setError('');
    setShow(true);
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetchWeatherForCoords(latitude, longitude);
      }, () => {
        setError('Location permission denied');
        setLoading(false);
      });
    } catch (e) {
      setError('Failed to fetch weather');
      setLoading(false);
    }
  };

  // Map Open-Meteo weathercode to icon/desc
  function getWeatherIconAndDesc(code: string | number) {
    if (typeof code === 'number') {
      if (code === 0) return { icon: weatherIcons['Clear'], desc: 'Clear' };
      if (code >= 1 && code <= 3) return { icon: weatherIcons['Clouds'], desc: 'Cloudy' };
      if (code >= 51 && code <= 67) return { icon: weatherIcons['Drizzle'], desc: 'Drizzle' };
      if (code >= 71 && code <= 77) return { icon: weatherIcons['Snow'], desc: 'Snow' };
      if (code >= 80 && code <= 99) return { icon: weatherIcons['Rain'], desc: 'Rain' };
    }
    return { icon: weatherIcons['Clouds'], desc: 'Unknown' };
  }

  // For combined icon, make both sun and rain colorful
  function getCombinedWeatherIcon(codes: number[]): ReactElement {
    const hasClear = codes.some(code => code === 0);
    const hasRain = codes.some(code => (code >= 51 && code <= 67) || (code >= 80 && code <= 99));
    const hasCloud = codes.some(code => code >= 1 && code <= 3);
    const hasSnow = codes.some(code => code >= 71 && code <= 77);
    if (hasClear && hasRain) {
      // Sun + Rain (show sun behind rain, both colorful)
      return (
        <span style={{ position: 'relative', display: 'inline-block', width: 28, height: 22 }}>
          <FaCloudSun style={{ color: '#f7c948', position: 'absolute', left: 0, top: 0, fontSize: 22, zIndex: 1, filter: 'drop-shadow(0 0 2px #f7c948)' }} />
          <FaCloudRain style={{ color: '#2196f3', position: 'absolute', left: 8, top: 6, fontSize: 20, zIndex: 2, filter: 'drop-shadow(0 0 2px #2196f3)' }} />
        </span>
      );
    }
    if (hasClear && hasCloud) {
      return <FaCloudSun style={{ color: '#f7c948', filter: 'drop-shadow(0 0 2px #f7c948)' }} />;
    }
    if (hasRain) return <FaCloudRain style={{ color: '#2196f3', filter: 'drop-shadow(0 0 2px #2196f3)' }} />;
    if (hasSnow) return <FaSnowflake style={{ color: '#90caf9', filter: 'drop-shadow(0 0 2px #90caf9)' }} />;
    if (hasCloud) return <FaCloudSun style={{ color: '#90a4ae', filter: 'drop-shadow(0 0 2px #90a4ae)' }} />;
    if (hasClear) return <FaCloudSun style={{ color: '#f7c948', filter: 'drop-shadow(0 0 2px #f7c948)' }} />;
    return <FaCloudSun style={{ color: '#90a4ae', filter: 'drop-shadow(0 0 2px #90a4ae)' }} />;
  }

  const weatherInfo = getWeatherIconAndDesc(weather);

  // Save location to savedLocations and localStorage
  function saveLocationToHistory(location: { display_name: string; lat: string; lon: string }) {
    setSavedLocations(prev => {
      const exists = prev.some(l => l.lat === location.lat && l.lon === location.lon);
      if (exists) return prev;
      const updated = [location, ...prev].slice(0, 10); // keep max 10
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  async function handleSearchLocation(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }

  async function handleSelectLocation(lat: string, lon: string, displayName: string) {
    setShow(true);
    setPlace(displayName);
    setSearchResults([]);
    setSearchQuery('');
    setLoading(true);
    setError('');
    setCoords({ lat: Number(lat), lon: Number(lon) });
    // Save to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ lat: Number(lat), lon: Number(lon), place: displayName }));
    saveLocationToHistory({ display_name: displayName, lat, lon });
    fetchEarthquakes(Number(lat), Number(lon));
    try {
      // Use Open-Meteo API for current and 7-day forecast, with hourly weathercode
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&hourly=weathercode&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.current_weather) {
        setTemp(data.current_weather.temperature);
        setWeather(data.current_weather.weathercode);
        setDesc('');
        setWind(data.current_weather.windspeed ?? null);
        setHumidity(data.current_weather.relativehumidity ?? null);
        setLastUpdated(new Date());
      } else {
        setError('Weather unavailable');
        setWind(null);
        setHumidity(null);
        setLastUpdated(null);
      }
      // Improved 7-day forecast: aggregate hourly weather codes for each day
      if (data.daily && data.daily.time && data.daily.temperature_2m_min && data.daily.temperature_2m_max && data.hourly && data.hourly.weathercode && data.hourly.time) {
        const forecastArr = data.daily.time.map((date: string, i: number) => {
          // Get all hourly weathercodes for this day
          const codes: number[] = [];
          data.hourly.time.forEach((t: string, idx: number) => {
            if (t.startsWith(date)) codes.push(data.hourly.weathercode[idx]);
          });
          return {
            date,
            min: data.daily.temperature_2m_min[i],
            max: data.daily.temperature_2m_max[i],
            code: Array.from(new Set(codes)), // unique codes for the day
          };
        });
        setForecast(forecastArr);
      } else {
        setForecast([]);
      }
      // Fetch recent earthquakes near the selected location
      fetchEarthquakes(parseFloat(lat), parseFloat(lon));
      setLoading(false);
    } catch {
      setError('Failed to fetch weather');
      setLoading(false);
    }
  }

  // New function to get icons and descriptions for an array of weather codes
  function getWeatherIconsAndDescs(codes: number[]): { icon: ReactElement; desc: string }[] {
    // Map all codes to icons/descs, deduplicate by type
    const types: { [k: string]: { icon: ReactElement; desc: string } } = {};
    codes.forEach(code => {
      const info = getWeatherIconAndDesc(code);
      types[info.desc] = info;
    });
    return Object.values(types);
  }

  function getMainWeatherDesc(codes: number[]): string {
    // Priority: Rain > Snow > Clear > Cloudy > Drizzle > Unknown
    const hasRain = codes.some(code => (code >= 51 && code <= 67) || (code >= 80 && code <= 99));
    const hasSnow = codes.some(code => code >= 71 && code <= 77);
    const hasClear = codes.some(code => code === 0);
    const hasCloud = codes.some(code => code >= 1 && code <= 3);
    const hasDrizzle = codes.some(code => code >= 51 && code <= 67);
    if (hasRain && hasClear) return 'Rain & Sun';
    if (hasRain) return 'Rain';
    if (hasSnow) return 'Snow';
    if (hasClear) return 'Clear';
    if (hasCloud) return 'Cloudy';
    if (hasDrizzle) return 'Drizzle';
    return 'Unknown';
  }

  // Debounced search for location suggestions
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    // Match saved locations first (max 5)
    const matchedSaved = savedLocations.filter(loc => loc.display_name.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
    setSearchResults(matchedSaved);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`);
        const data = await res.json();
        // Merge with matchedSaved, dedup by lat/lon, max 5
        const merged = [...matchedSaved];
        data.forEach((loc: any) => {
          if (!merged.some(l => l.lat === loc.lat && l.lon === loc.lon) && merged.length < 5) merged.push(loc);
        });
        setSearchResults(merged.slice(0, 5));
      } catch {
        setSearchResults(matchedSaved);
      }
      setSearching(false);
    }, 400);
  };

  // Graph component for 7-day temperature trend
  function TemperatureGraph({ forecast }: { forecast: Array<{ min: number; max: number; date?: string }> }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      if (!canvasRef.current || forecast.length === 0) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Prepare data
      const maxTemp = Math.max(...forecast.map(f => f.max));
      const minTemp = Math.min(...forecast.map(f => f.min));
      const range = maxTemp - minTemp || 1;
      // Make graph bigger and points farther apart
      const w = 320;
      const h = 100;
      canvas.width = w;
      canvas.height = h;
      const padX = 36;
      const padY = 32;
      const step = (w - padX * 2) / (forecast.length - 1);
      // Draw hill/area
      ctx.beginPath();
      ctx.moveTo(padX, h - padY);
      forecast.forEach((f, i) => {
        const x = padX + i * step;
        const y = padY + ((maxTemp - f.max) / range) * (h - padY * 2);
        ctx.lineTo(x, y);
      });
      ctx.lineTo(w - padX, h - padY);
      ctx.closePath();
      // Gradient fill (orange/yellow)
      const grad = ctx.createLinearGradient(0, padY, 0, h - padY);
      grad.addColorStop(0, '#ffe259');
      grad.addColorStop(1, '#ffa751');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      // Draw line
      ctx.beginPath();
      forecast.forEach((f, i) => {
        const x = padX + i * step;
        const y = padY + ((maxTemp - f.max) / range) * (h - padY * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#ffa751';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#ffa751';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Draw points, temp values, and date labels
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      forecast.forEach((f, i) => {
        const x = padX + i * step;
        const y = padY + ((maxTemp - f.max) / range) * (h - padY * 2);
        // Point
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffa751';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Temp value label
        ctx.fillStyle = '#232946';
        ctx.font = 'bold 16px Arial';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${f.max}°`, x, y - 12);
        // Date label (below x-axis)
        if (f.date) {
          ctx.font = '14px Arial';
          ctx.fillStyle = '#888';
          ctx.textBaseline = 'top';
          const dateObj = new Date(f.date);
          // Only show day number (e.g., 26)
          const dateStr = dateObj.getDate().toString();
          ctx.fillText(dateStr, x, h - padY + 10);
        }
      });
    }, [forecast]);
    return (
      <canvas
        ref={canvasRef}
        width={320}
        height={100}
        style={{ width: 320, height: 100, display: 'block', margin: '0 auto 12px auto', background: 'transparent' }}
      />
    );
  }

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        onClick={fetchWeather}
        title="Show Weather Update"
        style={{
          width: 46,
          height: 46,
          marginRight: 8,
          background: 'linear-gradient(135deg, #b3e0ff 0%, #ffe259 100%)',
          color: '#232946',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          boxShadow: '0 2px 8px #b3e0ff88',
        }}
      >
        {/* Show today's weather icon if available, else default to sun */}
        {weatherInfo.icon || <FaCloudSun />}
      </button>
      {show && (
        <>
          <div
            onClick={() => setShow(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
              background: 'transparent',
            }}
          />
          <div style={{
            position: 'absolute',
            top: 54,
            right: 0,
            minWidth: 260,
            background: '#fff',
            color: '#232946',
            borderRadius: 10,
            boxShadow: '0 4px 16px #0002',
            padding: '10px 16px',
            zIndex: 100,
          }}>
            {/* Location Search */}
            <form onSubmit={handleSearchLocation} style={{ marginBottom: 8, display: 'flex', gap: 4 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => {
                  if (!searchQuery.trim() && savedLocations.length > 0) {
                    setSearchResults(savedLocations.slice(0, 5)); // Show max 5 on focus
                  }
                }}
                placeholder="Search location..."
                style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #b3e0ff', fontSize: 13 }}
                autoComplete="off"
              />
              <button type="submit" style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#51ff8b', color: '#232946', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Search</button>
            </form>
            {searching && <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Searching...</div>}
            {searchResults.length > 0 && (
              <div style={{ maxHeight: 120, overflowY: 'auto', marginBottom: 8, border: '1px solid #b3e0ff', borderRadius: 6, background: '#fff' }}>
                {searchResults.slice(0, 5).map(res => (
                  <div
                    key={res.lat + res.lon}
                    onClick={() => handleSelectLocation(res.lat, res.lon, res.display_name)}
                    style={{ padding: '6px 8px', cursor: 'pointer', borderRadius: 6, background: '#f7f7f7', marginBottom: 2, fontSize: 13 }}
                  >
                    {res.display_name}
                  </div>
                ))}
              </div>
            )}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 60, width: '100%' }}>
                <span style={{
                  display: 'inline-block',
                  width: 32,
                  height: 32,
                  border: '4px solid #b3e0ff',
                  borderTop: '4px solid #51ff8b',
                  borderRight: '4px solid #ffe259',
                  borderRadius: '50%',
                  animation: 'spinWeatherLoader 0.8s linear infinite',
                  marginBottom: 6,
                }} />
                <span style={{ fontSize: 13, color: '#888' }}>Fetching weather...</span>
                <style>{`
                  @keyframes spinWeatherLoader {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : error ? (
              <div style={{ color: '#d7263d' }}>{error}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{weatherInfo.icon}</span>
                  <span>{weatherInfo.desc}</span>
                  {temp !== null && <span style={{ marginLeft: 8 }}>{temp}°C</span>}
                </div>
                {place && <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>📍 {place}</div>}
                {wind !== null && <div style={{ fontSize: 13, color: '#888' }}>💨 Wind: {wind} km/h</div>}
                {humidity !== null && <div style={{ fontSize: 13, color: '#888' }}>💧 Humidity: {humidity}%</div>}
                {lastUpdated && <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>Last updated: {lastUpdated.toLocaleTimeString()}</div>}
                {forecast.length > 0 && (
                  <div style={{ marginTop: 10, width: '100%' }}>
                    <TemperatureGraph forecast={forecast.map(f => ({ min: f.min, max: f.max, date: f.date }))} />
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>Next 7 Days:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {forecast.map((f, i) => {
                        const dateObj = new Date(f.date);
                        const day = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                        const dateShort = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        const dateDisplay = `${dateShort}, ${day}`;
                        const codesArr = Array.isArray(f.code) ? f.code : [f.code];
                        const icon = getCombinedWeatherIcon(codesArr);
                        const mainDesc = getMainWeatherDesc(codesArr);
                        return (
                          <div key={f.date} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#444', gap: 8 }}>
                            <span style={{ width: 80 }}>{dateDisplay}</span>
                            <span style={{ fontSize: 18 }}>{icon}</span>
                            <span>{mainDesc}</span>
                            <span style={{ marginLeft: 'auto' }}>{f.min}°/{f.max}°C</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Earthquake forecast section */}
                <div style={{ marginTop: 18, width: '100%' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ position: 'relative', display: 'inline-block', width: 28, height: 22 }}>
                      {/* Vibrating red circles */}
                      <span style={{
                        position: 'absolute', left: 6, top: 2, width: 17, height: 17, borderRadius: '50%', background: 'rgba(215, 38, 62, 0.94)', zIndex: 0, boxShadow: '0 0 8px 2px #d7263d44', animation: 'quakePulse1 1.2s infinite alternate' }} />
                      <span style={{
                        position: 'absolute', left: 3, top: -1, width: 23, height: 23, borderRadius: '50%', background: 'rgba(215, 38, 62, 0.66)', zIndex: 0, boxShadow: '0 0 12px 4px #d7263d33', animation: 'quakePulse2 1.2s infinite alternate' }} />
                      <span style={{
                        position: 'absolute', left: 0, top: 0, width: 28, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                        <FaWaveSquare style={{ fontSize: 18, color: '#d7263d', verticalAlign: 'middle', position: 'relative', zIndex: 2 }} />
                      </span>
                      <style>{`
                        @keyframes quakePulse1 { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0.2; transform: scale(1.25); } }
                        @keyframes quakePulse2 { 0% { opacity: 0.5; transform: scale(1); } 100% { opacity: 0.1; transform: scale(1.4); } }
                      `}</style>
                    </span>
                    Recent Earthquakes (300km radius, 7 days):
                  </div>
                  {quakeLoading ? (
                    <div style={{ fontSize: 13, color: '#888' }}>Loading earthquakes...</div>
                  ) : quakeError ? (
                    <div style={{ color: '#d7263d', fontSize: 13 }}>{quakeError}</div>
                  ) : earthquakes.length === 0 ? (
                    <div style={{ fontSize: 13, color: '#888' }}>No significant earthquakes nearby.</div>
                  ) : (
                    <div style={{ maxHeight: 120, overflowY: 'auto', fontSize: 13 }}>
                      {earthquakes.slice(0, 5).map((q: any) => (
                        <div key={q.id} style={{ marginBottom: 6, padding: 6, borderRadius: 6, background: '#f7f7f7', border: '1px solid #e3f6ff', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FaWaveSquare style={{ fontSize: 16, color: '#d7263d', verticalAlign: 'middle' }} />
                          <span style={{ fontWeight: 600, color: q.properties.mag >= 5 ? '#d7263d' : '#1976d2' }}>M{q.properties.mag}</span>
                          {q.properties.place && <span> — {q.properties.place}</span>}
                          <span style={{ color: '#888', marginLeft: 6 }}>{new Date(q.properties.time).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherUpdate;
