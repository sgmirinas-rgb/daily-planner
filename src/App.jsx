import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import { Plus, ChevronLeft, ChevronRight, Circle, CheckCircle2, Trash2, Pencil, X, Repeat, Tag, ArrowRight, CalendarDays } from 'lucide-react';

/* ---------- theme & constants ---------- */

const theme = {
  paper: '#FFFFFF',
  ink: '#111111',
  inkMuted: '#8C8C8C',
  accent: '#111111',
  accentSoft: '#EDEDED',
  line: '#DEDEDE',
  card: '#FFFFFF',
};

const CATEGORY_COLORS = ['#D32F2F', '#E53935', '#F57C00', '#F9A825', '#388E3C', '#43A047', '#1976D2', '#1E88E5', '#7B1FA2', '#8E24AA', '#00838F', '#6D4C41', '#546E7A', '#000000'];

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

/* ---------- Korean public holidays (2026-2030 완벽 반영) ---------- */
const KOREAN_HOLIDAYS = {
  // 2026년
  '2026-01-01': { name: '신정', type: 'holiday' },
  '2026-02-16': { name: '설날 연휴', type: 'holiday' },
  '2026-02-17': { name: '설날', type: 'holiday' },
  '2026-02-18': { name: '설날 연휴', type: 'holiday' },
  '2026-03-01': { name: '삼일절', type: 'holiday' },
  '2026-03-02': { name: '삼일절 대체공휴일', type: 'holiday' },
  '2026-05-05': { name: '어린이날', type: 'holiday' },
  '2026-05-24': { name: '부처님오신날', type: 'holiday' },
  '2026-05-25': { name: '부처님오신날 대체공휴일', type: 'holiday' },
  '2026-06-06': { name: '현충일', type: 'holiday' },
  '2026-08-15': { name: '광복절', type: 'holiday' },
  '2026-08-17': { name: '광복절 대체공휴일', type: 'holiday' },
  '2026-09-24': { name: '추석 연휴', type: 'holiday' },
  '2026-09-25': { name: '추석', type: 'holiday' },
  '2026-09-26': { name: '추석 연휴', type: 'holiday' },
  '2026-10-03': { name: '개천절', type: 'holiday' },
  '2026-10-05': { name: '개천절 대체공휴일', type: 'holiday' },
  '2026-10-09': { name: '한글날', type: 'holiday' },
  '2026-12-25': { name: '성탄절', type: 'holiday' },

  // 2027년
  '2027-01-01': { name: '신정', type: 'holiday' },
  '2027-02-06': { name: '설날 연휴', type: 'holiday' },
  '2027-02-07': { name: '설날', type: 'holiday' },
  '2027-02-08': { name: '설날 연휴', type: 'holiday' },
  '2027-03-01': { name: '삼일절', type: 'holiday' },
  '2027-05-05': { name: '어린이날', type: 'holiday' },
  '2027-05-13': { name: '부처님오신날', type: 'holiday' },
  '2027-06-06': { name: '현충일', type: 'holiday' },
  '2027-08-15': { name: '광복절', type: 'holiday' },
  '2027-08-16': { name: '광복절 대체공휴일', type: 'holiday' },
  '2027-09-14': { name: '추석 연휴', type: 'holiday' },
  '2027-09-15': { name: '추석', type: 'holiday' },
  '2027-09-16': { name: '추석 연휴', type: 'holiday' },
  '2027-10-03': { name: '개천절', type: 'holiday' },
  '2027-10-04': { name: '개천절 대체공휴일', type: 'holiday' },
  '2027-10-09': { name: '한글날', type: 'holiday' },
  '2027-10-11': { name: '한글날 대체공휴일', type: 'holiday' },
  '2027-12-25': { name: '성탄절', type: 'holiday' },

  // 2028년
  '2028-01-01': { name: '신정', type: 'holiday' },
  '2028-01-26': { name: '설날 연휴', type: 'holiday' },
  '2028-01-27': { name: '설날', type: 'holiday' },
  '2028-01-28': { name: '설날 연휴', type: 'holiday' },
  '2028-03-01': { name: '삼일절', type: 'holiday' },
  '2028-05-02': { name: '부처님오신날', type: 'holiday' },
  '2028-05-05': { name: '어린이날', type: 'holiday' },
  '2028-06-06': { name: '현충일', type: 'holiday' },
  '2028-08-15': { name: '광복절', type: 'holiday' },
  '2028-10-02': { name: '추석 연휴', type: 'holiday' },
  '2028-10-03': { name: '추석 및 개천절', type: 'holiday' },
  '2028-10-04': { name: '추석 연휴', type: 'holiday' },
  '2028-10-05': { name: '대체공휴일', type: 'holiday' },
  '2028-10-09': { name: '한글날', type: 'holiday' },
  '2028-12-25': { name: '성탄절', type: 'holiday' },

  // 2029년
  '2029-01-01': { name: '신정', type: 'holiday' },
  '2029-02-12': { name: '설날 연휴', type: 'holiday' },
  '2029-02-13': { name: '설날', type: 'holiday' },
  '2029-02-14': { name: '설날 연휴', type: 'holiday' },
  '2029-03-01': { name: '삼일절', type: 'holiday' },
  '2029-05-05': { name: '어린이날', type: 'holiday' },
  '2029-05-07': { name: '어린이날 대체공휴일', type: 'holiday' },
  '2029-05-20': { name: '부처님오신날', type: 'holiday' },
  '2029-05-21': { name: '부처님오신날 대체공휴일', type: 'holiday' },
  '2029-06-06': { name: '현충일', type: 'holiday' },
  '2029-08-15': { name: '광복절', type: 'holiday' },
  '2029-09-21': { name: '추석 연휴', type: 'holiday' },
  '2029-09-22': { name: '추석', type: 'holiday' },
  '2029-09-23': { name: '추석 연휴', type: 'holiday' },
  '2029-09-24': { name: '추석 대체공휴일', type: 'holiday' },
  '2029-10-03': { name: '개천절', type: 'holiday' },
  '2029-10-09': { name: '한글날', type: 'holiday' },
  '2029-12-25': { name: '성탄절', type: 'holiday' },

  // 2030년
  '2030-01-01': { name: '신정', type: 'holiday' },
  '2030-02-02': { name: '설날 연휴', type: 'holiday' },
  '2030-02-03': { name: '설날', type: 'holiday' },
  '2030-02-04': { name: '설날 연휴', type: 'holiday' },
  '2030-02-05': { name: '설날 대체공휴일', type: 'holiday' },
  '2030-03-01': { name: '삼일절', type: 'holiday' },
  '2030-05-05': { name: '어린이날', type: 'holiday' },
  '2030-05-06': { name: '어린이날 대체공휴일', type: 'holiday' },
  '2030-05-09': { name: '부처님오신날', type: 'holiday' },
  '2030-06-06': { name: '현충일', type: 'holiday' },
  '2030-08-15': { name: '광복절', type: 'holiday' },
  '2030-09-11': { name: '추석 연휴', type: 'holiday' },
  '2030-09-12': { name: '추석', type: 'holiday' },
  '2030-09-13': { name: '추석 연휴', type: 'holiday' },
  '2030-10-03': { name: '개천절', type: 'holiday' },
  '2030-10-09': { name: '한글날', type: 'holiday' },
  '2030-12-25': { name: '성탄절', type: 'holiday' },
};

function getKoreanHoliday(key) {
  return KOREAN_HOLIDAYS[key] || null;
}

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap');`;

/* ---------- date utils ---------- */

function pad2(n) { return String(n).padStart(2, '0'); }
function toKey(date) { return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`; }
function fromKey(key) { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); }
function addDaysKey(key, n) { const d = fromKey(key); d.setDate(d.getDate() + n); return toKey(d); }
function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }

function buildMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = startWeekday - 1; i >= 0; i--) cells.push({ date: new Date(year, month - 1, daysInPrev - i), currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), currentMonth: true });
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last); next.setDate(next.getDate() + 1);
    cells.push({ date: next, currentMonth: next.getMonth() === month });
  }
  return cells;
}

/* ---------- routine materialization ---------- */

function routineMatchesDate(routine, date) {
  if (routine.type === 'daily') return true;
  if (routine.type === 'weekly') return routine.weekdays.includes(date.getDay());
  if (routine.type === 'monthly') return routine.monthDays.includes(date.getDate());
  return false;
}

function materializeRoutines(routines, todos, fromDate, toDate) {
  const existingKeys = new Set(todos.filter(t => t.routineId).map(t => `${t.routineId}__${t.date}`));
  const additions = [];
  routines.forEach(routine => {
    const startBound = routine.startDate && fromKey(routine.startDate) > fromDate ? fromKey(routine.startDate) : fromDate;
    let cursor = new Date(startBound);
    while (cursor <= toDate) {
      if (routineMatchesDate(routine, cursor)) {
        const key = toKey(cursor);
        const uniqueKey = `${routine.id}__${key}`;
        if (!existingKeys.has(uniqueKey)) {
          additions.push({ id: uid(), date: key, text: routine.text, categoryId: routine.categoryId, completed: false, routineId: routine.id });
          existingKeys.add(uniqueKey);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });
  return additions.length ? [...todos, ...additions] : todos;
}

function materializeAll(d) {
  const today = new Date();
  const from = new Date(today); from.setDate(from.getDate() - 90);
  const to = new Date(today); to.setDate(to.getDate() + 365);
  return { ...d, todos: materializeRoutines(d.routines, d.todos, from, to) };
}

function defaultData() {
  return {
    categories: [
      { id: 'work', name: '업무', color: '#1976D2' },
      { id: 'personal', name: '개인', color: '#388E3C' },
      { id: 'etc', name: '기타', color: '#F57C00' },
    ],
    todos: [],
    routines: [],
  };
}

/* ---------- shared modal shell ---------- */

function ModalOverlay({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: 'rgba(35,48,61,0.45)' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- month calendar ---------- */

function MonthCalendar({ viewDate, onPrev, onNext, onToday, selectedKey, onSelect, todosByDate, categoryMap }) {
  const cells = useMemo(() => buildMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  const todayKey = toKey(new Date());
  
  return (
    <div className="rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.line}` }}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrev} style={{ color: theme.inkMuted }}><ChevronLeft size={18} /></button>
        <div className="flex items-center gap-2">
          <h3 style={{ fontFamily: '"Source Serif 4", Georgia, serif', color: theme.ink }} className="text-base font-semibold">
            {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
          </h3>
          <button onClick={onToday} className="text-xs px-2 py-0.5 rounded-full" style={{ border: `1px solid ${theme.line}`, color: theme.inkMuted }}>오늘</button>
        </div>
        <button onClick={onNext} style={{ color: theme.inkMuted }}><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY.map((w, i) => (<div key={w} className="text-xs py-1" style={{ color: i === 0 ? '#D32F2F' : i === 6 ? '#1976D2' : theme.inkMuted }}>{w}</div>))}
        {cells.map((cell, i) => {
          const key = toKey(cell.date);
          const items = todosByDate[key] || [];
          const isSelected = key === selectedKey;
          const isToday = key === todayKey;
          const dotColors = [...new Set(items.map(t => categoryMap[t.categoryId]?.color).filter(Boolean))].slice(0, 3);
          
          const holiday = getKoreanHoliday(key);
          const dayOfWeek = cell.date.getDay();
          const cellColor = holiday || dayOfWeek === 0 ? '#D32F2F' : dayOfWeek === 6 ? '#1976D2' : theme.ink;
          
          return (
            <button
              key={i}
              onClick={() => onSelect(key)}
              className="flex flex-col items-center py-1.5 gap-1 rounded-lg"
              style={{ opacity: cell.currentMonth ? 1 : 0.35, background: isSelected ? theme.accentSoft : 'transparent' }}
            >
              <span
                className="text-sm w-6 h-6 flex items-center justify-center rounded-full"
                style={{ color: isSelected ? theme.accent : cellColor, border: isToday ? `1px solid ${theme.accent}` : '1px solid transparent', fontWeight: isSelected ? 600 : 400 }}
              >
                {cell.date.getDate()}
              </span>
              <span className="flex gap-0.5 h-1.5 items-center">
                {dotColors.map(c => (<span key={c} className="w-1 h-1 rounded-full" style={{ background: c }} />))}
                {holiday && <span title={holiday.name} className="text-[8px] leading-none font-medium" style={{ color: '#D32F2F' }}>●</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- day panel ---------- */

function DayPanel({
  dateKey, todos, categoryMap,
  onAddClick, onToggle, onEdit, onDelete, onQuickDefer, onChooseDate,
  onPrevDay, onNextDay,
  selectMode, onEnterSelectMode, onExitSelectMode,
  selectedIds, onToggleSelect, onOpenMove, onDeferAllIncomplete,
}) {
  const dateObj = fromKey(dateKey);
  const label = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${WEEKDAY[dateObj.getDay()]})`;
  const incompleteCount = todos.filter(t => !t.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <button onClick={onPrevDay} style={{ color: theme.inkMuted }}><ChevronLeft size={18} /></button>
          <h2 style={{ fontFamily: '"Source Serif 4", Georgia, serif', color: theme.ink }} className="text-lg font-semibold whitespace-nowrap">{label}</h2>
          <button onClick={onNextDay} style={{ color: theme.inkMuted }}><ChevronRight size={18} /></button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!selectMode && incompleteCount > 0 && (
            <button onClick={onDeferAllIncomplete} className="text-xs px-2.5 py-1 rounded-full" style={{ border: `1px solid ${theme.line}`, color: theme.inkMuted }}>
              미완료 {incompleteCount}개 미루기
            </button>
          )}
          {!selectMode ? (
            <button onClick={onEnterSelectMode} className="text-xs px-2.5 py-1 rounded-full" style={{ border: `1px solid ${theme.line}`, color: theme.inkMuted }}>선택</button>
          ) : (
            <button onClick={onExitSelectMode} className="text-xs px-2.5 py-1 rounded-full" style={{ border: `1px solid ${theme.line}`, color: theme.inkMuted }}>취소</button>
          )}
        </div>
      </div>

      {selectMode && (
        <div className="flex items-center justify-between mb-3 rounded-xl px-3 py-2" style={{ background: theme.accentSoft }}>
          <span className="text-sm" style={{ color: theme.ink }}>{selectedIds.size}개 선택됨</span>
          <button
            onClick={onOpenMove}
            className={`text-sm font-medium ${selectedIds.size === 0 ? 'opacity-40 pointer-events-none' : ''}`}
            style={{ color: theme.accent }}
          >
            날짜 이동
          </button>
        </div>
      )}

      <div className="space-y-2">
        {todos.length === 0 && (
          <p className="text-sm py-8 text-center" style={{ color: theme.inkMuted }}>이 날은 할 일이 없어요. 아래에서 추가해보세요.</p>
        )}
        {todos.map(t => {
          const cat = categoryMap[t.categoryId];
          const checked = selectedIds.has(t.id);
          return (
            <div key={t.id} className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ background: theme.card, border: `1px solid ${theme.line}` }}>
              {selectMode ? (
                <button onClick={() => onToggleSelect(t.id)}>
                  {checked ? <CheckCircle2 size={20} style={{ color: theme.accent }} /> : <Circle size={20} style={{ color: theme.inkMuted }} />}
                </button>
              ) : (
                <button onClick={() => onToggle(t.id)}>
                  {t.completed ? <CheckCircle2 size={20} style={{ color: theme.accent }} /> : <Circle size={20} style={{ color: theme.inkMuted }} />}
                </button>
              )}
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat ? cat.color : '#999' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: t.completed ? theme.inkMuted : theme.ink, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.text}</p>
                <p className="text-xs" style={{ color: theme.inkMuted }}>{cat ? cat.name : '미분류'}{t.routineId ? ' · 반복' : ''}</p>
              </div>
              {!selectMode && (
                <div className="flex items-center gap-2.5 shrink-0">
                  <button onClick={() => onQuickDefer(t)} title="내일로 미루기" style={{ color: theme.inkMuted }}><ArrowRight size={16} /></button>
                  <button onClick={() => onChooseDate(t)} title="날짜 선택해서 미루기" style={{ color: theme.inkMuted }}><CalendarDays size={16} /></button>
                  <button onClick={() => onEdit(t)} title="수정" style={{ color: theme.inkMuted }}><Pencil size={16} /></button>
                  <button onClick={() => onDelete(t.id)} title="삭제" style={{ color: theme.inkMuted }}><Trash2 size={16} /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!selectMode && (
        <button onClick={onAddClick} className="mt-4 w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{ background: theme.accent, color: '#fff' }}>
          <Plus size={16} /> 할 일 추가
        </button>
      )}
    </div>
  );
}

/* ---------- add / edit sheet ---------- */

function AddSheet({ categories, defaultCategoryId, selectedDateKey, editingTodo, onClose, onSubmitOneTime, onSubmitRoutine, onSubmitEdit }) {
  const isEdit = !!editingTodo;
  const [text, setText] = useState(editingTodo?.text || '');
  const [categoryId, setCategoryId] = useState(editingTodo?.categoryId ?? defaultCategoryId ?? null);
  const [isRoutine, setIsRoutine] = useState(false);
  const [type, setType] = useState('weekly');
  const dObj = fromKey(selectedDateKey);
  const [weekdays, setWeekdays] = useState([dObj.getDay()]);
  const [monthDays, setMonthDays] = useState([dObj.getDate()]);

  function toggleWeekday(d) { setWeekdays(w => w.includes(d) ? w.filter(x => x !== d) : [...w, d]); }
  function toggleMonthDay(d) { setMonthDays(w => w.includes(d) ? w.filter(x => x !== d) : [...w, d]); }

  function submit() {
    if (!text.trim()) return;
    if (isEdit) { onSubmitEdit(editingTodo.id, text.trim(), categoryId); onClose(); return; }
    if (isRoutine) {
      onSubmitRoutine({
        text: text.trim(), categoryId, type,
        weekdays: type === 'weekly' ? weekdays : [],
        monthDays: type === 'monthly' ? monthDays : [],
        startDate: selectedDateKey,
      });
    } else {
      onSubmitOneTime({ text: text.trim(), categoryId, date: selectedDateKey });
    }
    onClose();
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: theme.ink }}>{isEdit ? '할 일 수정' : '할 일 추가'}</h3>
        <button onClick={onClose} style={{ color: theme.inkMuted }}><X size={18} /></button>
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="무엇을 할까요?"
        className="w-full text-sm rounded-xl px-3 py-2.5 mb-4 outline-none"
        style={{ border: `1px solid ${theme.line}` }}
        autoFocus
      />

      <p className="text-xs mb-2" style={{ color: theme.inkMuted }}>카테고리</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full"
            style={{ border: `1px solid ${categoryId === c.id ? c.color : theme.line}`, background: categoryId === c.id ? c.color + '22' : 'transparent', color: theme.ink }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name}
          </button>
        ))}
      </div>

      {!isEdit && (
        <>
          <label className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: theme.ink }}>반복 일정(루틴)으로 등록</span>
            <button onClick={() => setIsRoutine(v => !v)} className="w-10 h-6 rounded-full relative" style={{ background: isRoutine ? theme.accent : theme.line }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: isRoutine ? '18px' : '2px', transition: 'left 0.15s' }} />
            </button>
          </label>

          {isRoutine && (
            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                {[['daily', '매일'], ['weekly', '매주'], ['monthly', '매월']].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setType(v)}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{ border: `1px solid ${type === v ? theme.accent : theme.line}`, background: type === v ? theme.accentSoft : 'transparent', color: theme.ink }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {type === 'weekly' && (
                <div className="flex gap-1.5 flex-wrap">
                  {WEEKDAY.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => toggleWeekday(i)}
                      className="w-8 h-8 rounded-full text-xs"
                      style={{ background: weekdays.includes(i) ? theme.accent : 'transparent', color: weekdays.includes(i) ? '#fff' : theme.ink, border: `1px solid ${weekdays.includes(i) ? theme.accent : theme.line}` }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}
              {type === 'monthly' && (
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <button
                      key={d}
                      onClick={() => toggleMonthDay(d)}
                      className="w-8 h-8 rounded-full text-xs"
                      style={{ background: monthDays.includes(d) ? theme.accent : 'transparent', color: monthDays.includes(d) ? '#fff' : theme.ink, border: `1px solid ${monthDays.includes(d) ? theme.accent : theme.line}` }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <button onClick={submit} className="w-full py-3 rounded-xl text-sm font-medium" style={{ background: theme.accent, color: '#fff' }}>
        {isEdit ? '수정 완료' : '추가'}
      </button>
    </ModalOverlay>
  );
}

/* ---------- category modal ---------- */

function CategoryModal({ categories, onAdd, onDelete, onClose }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: theme.ink }}>카테고리 관리</h3>
        <button onClick={onClose} style={{ color: theme.inkMuted }}><X size={18} /></button>
      </div>
      <div className="space-y-2 mb-5">
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ border: `1px solid ${theme.line}` }}>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: c.color }} /><span className="text-sm" style={{ color: theme.ink }}>{c.name}</span></div>
            <button onClick={() => onDelete(c.id)} style={{ color: theme.inkMuted }}><Trash2 size={16} /></button>
          </div>
        ))}
        {categories.length === 0 && <p className="text-sm py-2" style={{ color: theme.inkMuted }}>등록된 카테고리가 없어요.</p>}
      </div>
      <p className="text-xs mb-2" style={{ color: theme.inkMuted }}>새 카테고리</p>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="카테고리 이름"
        className="w-full text-sm rounded-xl px-3 py-2.5 mb-3 outline-none"
        style={{ border: `1px solid ${theme.line}` }}
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full" style={{ background: c, boxShadow: color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none' }} />
        ))}
      </div>
      <button
        onClick={() => { if (!name.trim()) return; onAdd(name.trim(), color); setName(''); }}
        className="w-full py-3 rounded-xl text-sm font-medium"
        style={{ background: theme.accent, color: '#fff' }}
      >
        카테고리 추가
      </button>
    </ModalOverlay>
  );
}

/* ---------- routine modal ---------- */

function RoutineModal({ routines, categoryMap, onDelete, onClose }) {
  function describe(r) {
    if (r.type === 'daily') return '매일';
    if (r.type === 'weekly') return '매주 ' + [...r.weekdays].sort().map(d => WEEKDAY[d]).join(',');
    if (r.type === 'monthly') return '매월 ' + [...r.monthDays].sort((a, b) => a - b).join(',') + '일';
    return '';
  }
  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: theme.ink }}>루틴 관리</h3>
        <button onClick={onClose} style={{ color: theme.inkMuted }}><X size={18} /></button>
      </div>
      {routines.length === 0 && <p className="text-sm py-6 text-center" style={{ color: theme.inkMuted }}>등록된 루틴이 없어요. 할 일 추가에서 '반복 일정'을 켜보세요.</p>}
      <div className="space-y-2">
        {routines.map(r => {
          const cat = categoryMap[r.categoryId];
          return (
            <div key={r.id} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ border: `1px solid ${theme.line}` }}>
              <div className="min-w-0">
                <p className="text-sm truncate" style={{ color: theme.ink }}>{r.text}</p>
                <p className="text-xs" style={{ color: theme.inkMuted }}>{describe(r)}{cat ? ' · ' + cat.name : ''}</p>
              </div>
              <button onClick={() => onDelete(r.id)} style={{ color: theme.inkMuted }}><Trash2 size={16} /></button>
            </div>
          );
        })}
      </div>
    </ModalOverlay>
  );
}

/* ---------- move (date-pick) modal ---------- */

function MoveModal({ initialDateKey, onConfirm, onClose }) {
  const [viewDate, setViewDate] = useState(fromKey(initialDateKey));
  const [chosen, setChosen] = useState(initialDateKey);
  const cells = useMemo(() => buildMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: theme.ink }}>날짜 선택</h3>
        <button onClick={onClose} style={{ color: theme.inkMuted }}><X size={18} /></button>
      </div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })} style={{ color: theme.inkMuted }}><ChevronLeft size={18} /></button>
        <span className="text-sm font-medium" style={{ color: theme.ink }}>{viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월</span>
        <button onClick={() => setViewDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })} style={{ color: theme.inkMuted }}><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center mb-4">
        {WEEKDAY.map(w => (<div key={w} className="text-xs py-1" style={{ color: theme.inkMuted }}>{w}</div>))}
        {cells.map((cell, i) => {
          const key = toKey(cell.date);
          const isChosen = chosen === key;
          return (
            <button
              key={i}
              onClick={() => setChosen(key)}
              className="py-1.5 rounded-lg text-sm"
              style={{ opacity: cell.currentMonth ? 1 : 0.35, background: isChosen ? theme.accent : 'transparent', color: isChosen ? '#fff' : theme.ink }}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
      <button onClick={() => onConfirm(chosen)} className="w-full py-3 rounded-xl text-sm font-medium" style={{ background: theme.accent, color: '#fff' }}>
        이 날짜로 이동
      </button>
    </ModalOverlay>
  );
}

/* ---------- app ---------- */

export default function App() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedKey, setSelectedKey] = useState(toKey(new Date()));
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [moveTargetIds, setMoveTargetIds] = useState([]);
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (active) { setSession(currentSession); setAuthChecked(true); }
    })();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthChecked(true);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session?.user) { setData(null); setLoaded(false); return; }
    (async () => {
      try {
        const { data: row, error } = await supabase
          .from('planner_data')
          .select('data')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (error) throw error;
        const initial = row?.data || defaultData();
        setData(materializeAll(initial));
      } catch (e) {
        console.error('플래너 데이터 불러오기 실패:', e);
        setData(materializeAll(defaultData()));
      } finally {
        setLoaded(true);
      }
    })();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!loaded || !data || !session?.user) return;
    const timer = setTimeout(async () => {
      const { error } = await supabase.from('planner_data').upsert({
        user_id: session.user.id,
        data,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error('플래너 데이터 저장 실패:', error);
    }, 250);
    return () => clearTimeout(timer);
  }, [data, loaded, session?.user?.id]);

  const todosByDate = useMemo(() => {
    const map = {};
    (data?.todos || []).forEach(t => { (map[t.date] ||= []).push(t); });
    return map;
  }, [data?.todos]);

  const categoryMap = useMemo(() => {
    const map = {};
    (data?.categories || []).forEach(c => { map[c.id] = c; });
    return map;
  }, [data?.categories]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.paper }}>
        <style>{FONT_IMPORT}</style>
        <p className="text-sm" style={{ color: theme.inkMuted, fontFamily: '"Inter", system-ui, sans-serif' }}>로그인 확인 중…</p>
      </div>
    );
  }

  if (!session) return <Auth />;

  if (!loaded || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.paper }}>
        <style>{FONT_IMPORT}</style>
        <p className="text-sm" style={{ color: theme.inkMuted, fontFamily: '"Inter", system-ui, sans-serif' }}>불러오는 중…</p>
      </div>
    );
  }

  const dayTodos = (todosByDate[selectedKey] || []).slice().sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  function addCategory(name, color) { setData(d => ({ ...d, categories: [...d.categories, { id: uid(), name, color }] })); }
  function deleteCategory(id) {
    setData(d => ({
      ...d,
      categories: d.categories.filter(c => c.id !== id),
      todos: d.todos.map(t => t.categoryId === id ? { ...t, categoryId: null } : t),
      routines: d.routines.map(r => r.categoryId === id ? { ...r, categoryId: null } : r),
    }));
  }

  function addOneTimeTodo({ text, categoryId, date }) { setData(d => ({ ...d, todos: [...d.todos, { id: uid(), date, text, categoryId, completed: false }] })); }
  function addRoutine(payload) {
    const routine = { id: uid(), ...payload };
    setData(d => materializeAll({ ...d, routines: [...d.routines, routine] }));
  }
  function deleteRoutine(id) {
    if (typeof window !== 'undefined' && !window.confirm('이 루틴과 관련된 모든 일정을 삭제할까요? 되돌릴 수 없어요.')) return;
    setData(d => ({ ...d, routines: d.routines.filter(r => r.id !== id), todos: d.todos.filter(t => t.routineId !== id) }));
  }

  function toggleComplete(id) { setData(d => ({ ...d, todos: d.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })); }
  function updateTodoText(id, text, categoryId) { setData(d => ({ ...d, todos: d.todos.map(t => t.id === id ? { ...t, text, categoryId } : t) })); }
  function deleteTodo(id) { setData(d => ({ ...d, todos: d.todos.filter(t => t.id !== id) })); }
  function quickDefer(t) { const newKey = addDaysKey(t.date, 1); setData(d => ({ ...d, todos: d.todos.map(x => x.id === t.id ? { ...x, date: newKey } : x) })); }

  function shiftDay(delta) {
    const newKey = addDaysKey(selectedKey, delta);
    setSelectedKey(newKey);
    const d = fromKey(newKey);
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }
  function chooseDateForSingle(t) { setMoveTargetIds([t.id]); setShowMoveModal(true); }

  function toggleSelect(id) {
    setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function openMoveForSelected() { setMoveTargetIds(Array.from(selectedIds)); setShowMoveModal(true); }
  function deferAllIncomplete() {
    const ids = dayTodos.filter(t => !t.completed).map(t => t.id);
    if (ids.length === 0) return;
    setMoveTargetIds(ids);
    setShowMoveModal(true);
  }
  function confirmMove(newDateKey) {
    setData(d => ({ ...d, todos: d.todos.map(t => moveTargetIds.includes(t.id) ? { ...t, date: newDateKey } : t) }));
    setShowMoveModal(false);
    setSelectMode(false);
    setSelectedIds(new Set());
    setMoveTargetIds([]);
  }

  return (
    <div className="min-h-screen" style={{ background: theme.paper, fontFamily: '"Inter", system-ui, sans-serif' }}>
      <style>{FONT_IMPORT}</style>
      <div className="max-w-md mx-auto px-4 pt-6 pb-10">
        <div className="flex items-baseline justify-between mb-1">
          <h1 style={{ fontFamily: '"Source Serif 4", Georgia, serif', color: theme.ink }} className="text-2xl font-semibold">데일리플래너</h1>
          <div className="flex gap-4">
            <button onClick={() => setShowRoutineModal(true)} title="루틴 관리" style={{ color: theme.inkMuted }}><Repeat size={18} /></button>
            <button onClick={() => setShowCategoryModal(true)} title="카테고리 관리" style={{ color: theme.inkMuted }}><Tag size={18} /></button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p style={{ color: theme.inkMuted }} className="text-sm">날짜를 골라 할 일을 확인하고 정리하세요</p>
          <button onClick={() => supabase.auth.signOut()} className="text-xs" style={{ color: theme.inkMuted }}>로그아웃</button>
        </div>

        <DayPanel
          dateKey={selectedKey}
          todos={dayTodos}
          categoryMap={categoryMap}
          onAddClick={() => { setEditingTodo(null); setShowAdd(true); }}
          onToggle={toggleComplete}
          onEdit={(t) => { setEditingTodo(t); setShowAdd(true); }}
          onDelete={deleteTodo}
          onQuickDefer={quickDefer}
          onChooseDate={chooseDateForSingle}
          onPrevDay={() => shiftDay(-1)}
          onNextDay={() => shiftDay(1)}
          selectMode={selectMode}
          onEnterSelectMode={() => { setSelectMode(true); setSelectedIds(new Set()); }}
          onExitSelectMode={() => { setSelectMode(false); setSelectedIds(new Set()); }}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onOpenMove={openMoveForSelected}
          onDeferAllIncomplete={deferAllIncomplete}
        />

        <div className="mt-6">
          <MonthCalendar
            viewDate={viewDate}
            onPrev={() => setViewDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })}
            onNext={() => setViewDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })}
            onToday={() => { setViewDate(new Date()); setSelectedKey(toKey(new Date())); }}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            todosByDate={todosByDate}
            categoryMap={categoryMap}
          />
        </div>
      </div>

      {showAdd && (
        <AddSheet
          categories={data.categories}
          defaultCategoryId={data.categories[0]?.id ?? null}
          selectedDateKey={selectedKey}
          editingTodo={editingTodo}
          onClose={() => { setShowAdd(false); setEditingTodo(null); }}
          onSubmitOneTime={addOneTimeTodo}
          onSubmitRoutine={addRoutine}
          onSubmitEdit={updateTodoText}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          categories={data.categories}
          onAdd={addCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {showRoutineModal && (
        <RoutineModal
          routines={data.routines}
          categoryMap={categoryMap}
          onDelete={deleteRoutine}
          onClose={() => setShowRoutineModal(false)}
        />
      )}

      {showMoveModal && (
        <MoveModal
          initialDateKey={selectedKey}
          onConfirm={confirmMove}
          onClose={() => setShowMoveModal(false)}
        />
      )}
    </div>
  );
}
