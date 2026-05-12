import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'session' | 'deadline';
}

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Math Study Session', date: new Date().toISOString().split('T')[0], time: '14:00', type: 'session' },
    { id: '2', title: 'Physics Assignment', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '23:59', type: 'deadline' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'session' as const });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: currentDate.toISOString().split('T')[0],
      time: newEvent.time,
      type: newEvent.type
    };
    setEvents([...events, event]);
    setIsAdding(false);
    setNewEvent({ title: '', time: '', type: 'session' });
  };

  const selectedDateStr = currentDate.toISOString().split('T')[0];
  const dayEvents = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <CalendarIcon className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white italic tracking-tighter uppercase leading-tight">Study <span className="text-blue-500">Sync</span></h2>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Schedule Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft size={20} className="text-white/40" /></button>
            <span className="text-xs font-black text-white uppercase tracking-widest min-w-[100px] text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronRight size={20} className="text-white/40" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-[10px] font-black text-white/20 text-center uppercase py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const isSelected = currentDate.getDate() === day;
            const hasEvents = events.some(e => {
              const d = new Date(e.date);
              return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
            });

            return (
              <button 
                key={day}
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all group ${
                  isSelected ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'hover:bg-white/5'
                }`}
              >
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : isToday ? 'text-blue-400' : 'text-white/60'}`}>{day}</span>
                {hasEvents && !isSelected && (
                  <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Agenda • {currentDate.toLocaleDateString()}</h3>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            {isAdding ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <input 
                placeholder="EVENT TITLE"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white uppercase tracking-widest outline-none focus:border-blue-500 transition-all shadow-inner"
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value.toUpperCase()})}
              />
              <div className="flex gap-3">
                <input 
                  type="time"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all shadow-inner"
                  value={newEvent.time}
                  onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                />
                <select 
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                  value={newEvent.type}
                  onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                >
                  <option value="session" className="bg-[#03070c]">Session</option>
                  <option value="deadline" className="bg-[#03070c]">Deadline</option>
                </select>
              </div>
              <button 
                onClick={handleAddEvent}
                className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                Add to Schedule
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {dayEvents.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No Events Scheduled</p>
                </div>
              ) : (
                dayEvents.map(event => (
                  <div key={event.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-full absolute left-0 top-0 rounded-l-2xl ${event.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                        <Clock size={14} className={event.type === 'deadline' ? 'text-red-400' : 'text-blue-400'} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight">{event.title}</h4>
                        <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{event.time} • {event.type}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
