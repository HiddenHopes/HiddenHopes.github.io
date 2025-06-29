import { Center } from '@react-three/drei';
import React, { useState } from 'react';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

const DateTimePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const now = new Date();
  const [date, setDate] = useState(now);
  // For a simple calendar, just show the current month
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const today = now.getDate();
  const month = date.toLocaleString(undefined, { month: 'long' });
  const year = date.getFullYear();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Clock
  const [time, setTime] = useState(now);
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 54, left: 0, right:0, minWidth: 260, background: '#fff', color: '#232946', borderRadius: 10,
      boxShadow: '0 4px 16px #0002', padding: '16px 20px', zIndex: 100, fontFamily: 'inherit',
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#232946', cursor: 'pointer' }}>×</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <FaRegCalendarAlt style={{ fontSize: 22, color: '#ffa751' }} />
        <span style={{ fontWeight: 600, fontSize: 18 }}>Calendar</span>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{month} {year}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
        {weekDays.map((d, i) => <div key={d} style={{ fontWeight: 600, color: i === 5 ? '#d7263d' : '#888', fontSize: 13, textAlign:'center' }}>{d}</div>)}
        {Array(firstDay).fill(null).map((_, i) => <div key={'empty-' + i} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const dateObj = new Date(date.getFullYear(), date.getMonth(), i + 1);
          const isFriday = dateObj.getDay() === 5;
          return (
            <div key={i} style={{
              padding: '4px 0',
              borderRadius: 6,
              background: i + 1 === today ? 'linear-gradient(90deg,#ffe259,#ffa751)' : 'none',
              color: i + 1 === today ? '#232946' : isFriday ? '#d7263d' : '#444',
              fontWeight: i + 1 === today ? 700 : 400,
              fontSize: 14,
              textAlign: 'center',
            }}>{i + 1}</div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0 6px 0' }}>
        <FaRegClock style={{ fontSize: 22, color: '#1976d2' }} />
        <span style={{ fontWeight: 600, fontSize: 18 }}>Clock</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, letterSpacing: 2, color: '#232946', marginBottom: 2 }}>
        {time.toLocaleTimeString()}
      </div>
      <div style={{ textAlign: 'center', fontSize: 15, color: '#888' }}>{time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  );
};

export default DateTimePopup;
