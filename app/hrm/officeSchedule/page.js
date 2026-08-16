"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Calendar,
  Plus,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Check,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Save,
  Info,
  Briefcase,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("employeeToken") ||
    localStorage.getItem("token")
  );
}
function getRole() {
  if (typeof window === "undefined") return null;
  try {
    const ad = localStorage.getItem("adminData");
    if (ad) return JSON.parse(ad).role;
    const ed = localStorage.getItem("employeeData");
    if (ed) return JSON.parse(ed).role;
  } catch (_) {}
  return null;
}
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

function DayToggle({ days, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {days.map((day) => {
        const on = selected.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() =>
              onChange(
                on ? selected.filter((d) => d !== day) : [...selected, day],
              )
            }
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              on
                ? "bg-[#113F67] text-white border-[#113F67]"
                : "bg-white text-gray-500 border-gray-300 hover:border-[#113F67] hover:text-[#113F67]"
            }`}
          >
            {day.slice(0, 3)}
          </button>
        );
      })}
    </div>
  );
}

export default function OfficeSchedulePage() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Weekend config
  const [currentDays, setCurrentDays] = useState(["Friday", "Saturday"]);

  // Calendar
  const _now = new Date();
  const [calMonth, setCalMonth] = useState(_now.getMonth() + 1);
  const [calYear, setCalYear] = useState(_now.getFullYear());
  const [calHolidays, setCalHolidays] = useState([]);
  const [calLoading, setCalLoading] = useState(false);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [weekendEditDays, setWeekendEditDays] = useState([
    "Friday",
    "Saturday",
  ]);
  const [savingWeekend, setSavingWeekend] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); // { day, dayName, isWeekend, holiday }
  const [addingHoliday, setAddingHoliday] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [holidayForm, setHolidayForm] = useState({
    title: "",
    type: "GOVT",
    endDate: "",
  });

  const years = useMemo(() => {
    const list = [];
    for (let y = 2024; y <= new Date().getFullYear() + 1; y++) list.push(y);
    return list;
  }, []);

  useEffect(() => {
    const role = getRole();
    setIsAdmin(role === "admin" || role === "superAdmin");
    fetchSchedule();
  }, []);

  useEffect(() => {
    fetchCalHolidays(calYear);
  }, [calYear]);

  // ── API calls ──────────────────────────────────────────────────────────────

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`${API}/weekly-off`, { headers: authHeaders() });
      const data = await res.json();
      const days = data?.weeklyOffDays || ["Friday", "Saturday"];
      setCurrentDays(days);
      setWeekendEditDays(days);
    } catch {
      toast.error("Failed to load schedule");
    }
  };

  const fetchCalHolidays = async (year) => {
    setCalLoading(true);
    try {
      const res = await fetch(`${API}/holiday?year=${year}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setCalHolidays(Array.isArray(data?.holidays) ? data.holidays : []);
    } catch {
    } finally {
      setCalLoading(false);
    }
  };

  const saveWeekendDays = async () => {
    setSavingWeekend(true);
    try {
      const res = await fetch(`${API}/updateWeekly-off`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ weeklyOffDays: weekendEditDays }),
      });
      if (res.ok) {
        toast.success("Weekend days saved");
        setCurrentDays(weekendEditDays);
      } else toast.error("Failed to save");
    } catch {
      toast.error("Network error");
    } finally {
      setSavingWeekend(false);
    }
  };

  const handleAddHoliday = async () => {
    if (!selectedCell || !holidayForm.title.trim()) {
      toast.error("Enter holiday name");
      return;
    }
    setEditSaving(true);
    const start = new Date(calYear, calMonth - 1, selectedCell.day);
    const end = holidayForm.endDate
      ? new Date(holidayForm.endDate + "T00:00:00")
      : start;
    const dates = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }

    let added = 0;
    for (const d of dates) {
      try {
        const res = await fetch(`${API}/addHoliday`, {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({
            title: holidayForm.title.trim(),
            date: d.toISOString(),
            type: holidayForm.type,
            year: d.getFullYear(),
          }),
        });
        if (res.ok) added++;
      } catch {}
    }

    if (added > 0) {
      toast.success(`${added} holiday${added > 1 ? "s" : ""} added`);
      await fetchCalHolidays(calYear);
      setAddingHoliday(false);
      setHolidayForm({ title: "", type: "GOVT", endDate: "" });
      setSelectedCell(null);
    } else {
      toast.error("Failed to add holiday");
    }
    setEditSaving(false);
  };

  const handleDeleteHoliday = async (id) => {
    setEditSaving(true);
    try {
      const res = await fetch(`${API}/deleteHoliday/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        toast.success("Holiday removed");
        await fetchCalHolidays(calYear);
        setSelectedCell(null);
      } else toast.error("Failed to remove");
    } catch {
      toast.error("Network error");
    } finally {
      setEditSaving(false);
    }
  };

  const handleMakeWorkingDay = async () => {
    if (!selectedCell) return;
    const newOff = currentDays.filter((d) => d !== selectedCell.dayName);
    const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(selectedCell.day).padStart(2, "0")}`;
    setEditSaving(true);
    try {
      const res = await fetch(`${API}/override`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: dateStr,
          endDate: dateStr,
          weeklyOffDays: newOff,
        }),
      });
      if (res.ok) {
        toast.success("Marked as working day for this date");
        setSelectedCell(null);
      } else toast.error("Failed to override");
    } catch {
      toast.error("Network error");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Calendar computation ───────────────────────────────────────────────────

  const calCells = useMemo(() => {
    const firstDow = new Date(calYear, calMonth - 1, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dayName = DAYS[(firstDow + d - 1) % 7];
      const isWeekend = currentDays.includes(dayName);
      const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const holiday =
        calHolidays.find((h) => (h.date || "").split("T")[0] === dateStr) ||
        null;
      cells.push({ day: d, dayName, isWeekend, holiday });
    }
    return cells;
  }, [calMonth, calYear, currentDays, calHolidays]);

  const calStats = useMemo(() => {
    const days = calCells.filter(Boolean);
    const weekends = days.filter((d) => d.isWeekend).length;
    const publicHolidays = days.filter((d) => d.holiday && !d.isWeekend).length;
    return {
      totalDays: days.length,
      weekends,
      publicHolidays,
      working: days.length - weekends - publicHolidays,
    };
  }, [calCells]);

  const monthHolidayList = useMemo(() => {
    const prefix = `${calYear}-${String(calMonth).padStart(2, "0")}`;
    return calHolidays.filter((h) =>
      (h.date || "").split("T")[0].startsWith(prefix),
    );
  }, [calHolidays, calMonth, calYear]);

  const prevMonth = () => {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  const todayDay = _now.getDate();
  const todayMonth = _now.getMonth() + 1;
  const todayYear = _now.getFullYear();

  const handleCellClick = (cell) => {
    if (!editMode || !isAdmin) return;
    setSelectedCell(cell);
    setAddingHoliday(false);
    setHolidayForm({ title: "", type: "GOVT", endDate: "" });
  };

  const closeDayPanel = () => {
    setSelectedCell(null);
    setAddingHoliday(false);
  };

  // Day-of-month formatted string
  const cellDateLabel = (cell) => {
    if (!cell) return "";
    return `${cell.dayName}, ${cell.day} ${MONTHS[calMonth - 1]} ${calYear}`;
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center">
              <Calendar size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Office Schedule
              </h1>
              <p className="text-xs text-gray-500">
                Weekends, holidays and working days
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              fetchSchedule();
              fetchCalHolidays(calYear);
            }}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* ── Calendar Card ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Calendar top bar */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#113F67]" />
              <div>
                <h2 className="font-semibold text-gray-800">
                  Monthly Calendar
                </h2>
                <p className="text-xs text-gray-500">
                  {editMode
                    ? "Click any day to edit it"
                    : "Weekends and holidays at a glance"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Month nav */}
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                <ChevronLeft size={15} />
              </button>
              <select
                value={calMonth}
                onChange={(e) => setCalMonth(Number(e.target.value))}
                className="text-sm font-medium border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#113F67]"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={calYear}
                onChange={(e) => setCalYear(Number(e.target.value))}
                className="text-sm font-medium border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#113F67]"
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                <ChevronRight size={15} />
              </button>

              {/* Edit / Done */}
              {isAdmin && !editMode && (
                <button
                  onClick={() => {
                    setEditMode(true);
                    setSelectedCell(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#113F67] border border-[#113F67] px-3 py-1.5 rounded-lg hover:bg-[#113F67]/5 transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
              )}
              {editMode && (
                <button
                  onClick={() => {
                    setEditMode(false);
                    closeDayPanel();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#113F67] px-3 py-1.5 rounded-lg hover:bg-[#0d3254] transition-colors"
                >
                  <Check size={13} /> Done
                </button>
              )}
            </div>
          </div>

          {/* ── [Edit mode] Weekend config bar ── */}
          {editMode && (
            <div className="px-5 py-3 bg-[#113F67]/5 border-b border-[#113F67]/10 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-[#113F67] shrink-0">
                Weekend Days:
              </span>
              <DayToggle
                days={DAYS}
                selected={weekendEditDays}
                onChange={setWeekendEditDays}
              />
              <button
                onClick={saveWeekendDays}
                disabled={savingWeekend}
                className="flex items-center gap-1 text-xs bg-[#113F67] text-white px-2.5 py-1.5 rounded-lg disabled:opacity-60 hover:bg-[#0d3254] transition-colors shrink-0"
              >
                {savingWeekend ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                Save
              </button>
            </div>
          )}

          <div className="p-4 sm:p-5">
            {/* ── Stats strip ── */}
            <div className="grid grid-cols-4 gap-1 md:gap-2  mb-5">
              <div className="bg-gray-50 rounded-xl p-1 md:p-3 text-center border border-gray-100">
                <p className="text-xl md:text-2xl font-bold text-gray-700">
                  {calStats.totalDays}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  Total Days
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-1 md:p-3 text-center border border-blue-100">
                <p className="text-xl md:text-2xl font-bold text-[#113F67]">
                  {calStats.weekends}
                </p>
                <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5">
                  Weekends
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-1 md:p-3 text-center border border-red-100">
                <p className="text-xl md:text-2xl font-bold text-red-600">
                  {calStats.publicHolidays}
                </p>
                <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">
                  Holidays
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-1 md:p-3 text-center border border-green-100">
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {calStats.working}
                </p>
                <p className="text-[10px] sm:text-xs text-green-600 mt-0.5">
                  Working Days
                </p>
              </div>
            </div>

            {calLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-[#113F67]" />
              </div>
            ) : (
              <>
                {/* Day-of-week header */}
                <div className="grid grid-cols-7 mb-1">
                  {DOW_SHORT.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[10px] sm:text-xs font-semibold text-gray-400 py-1.5 uppercase tracking-wide"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* ── Calendar Grid ── */}
                <div className="grid grid-cols-7 gap-1">
                  {calCells.map((cell, i) => {
                    if (!cell)
                      return (
                        <div key={`e-${i}`} className="min-h-13 sm:min-h-16" />
                      );

                    const { day, isWeekend, holiday } = cell;
                    const isToday =
                      calMonth === todayMonth &&
                      calYear === todayYear &&
                      day === todayDay;
                    const isBoth = isWeekend && !!holiday;
                    const isSelected = editMode && selectedCell?.day === day;

                    let cellBg = "bg-white border-gray-100";
                    if (isSelected)
                      cellBg = "bg-[#113F67]/10 border-[#113F67]/40";
                    else if (isBoth) cellBg = "bg-orange-50 border-orange-200";
                    else if (holiday) cellBg = "bg-red-50 border-red-100";
                    else if (isWeekend) cellBg = "bg-blue-50 border-blue-100";

                    const numColor = isToday
                      ? ""
                      : isBoth
                        ? "text-orange-700"
                        : holiday
                          ? "text-red-700"
                          : isWeekend
                            ? "text-[#113F67]"
                            : "text-gray-700";

                    return (
                      <div
                        key={`d-${day}`}
                        onClick={() => handleCellClick(cell)}
                        className={`relative rounded-lg border p-1 sm:p-1.5 min-h-13 sm:min-h-16 flex flex-col items-center transition-all
                          ${cellBg}
                          ${editMode && isAdmin ? "cursor-pointer hover:ring-2 hover:ring-[#113F67]/30" : ""}
                          ${isSelected ? "ring-2 ring-[#113F67]/50" : ""}
                        `}
                      >
                        <div
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                            isToday ? "bg-[#113F67] text-white" : numColor
                          }`}
                        >
                          {day}
                        </div>

                        {holiday && (
                          <span className="text-[8px] sm:text-[9px] leading-tight text-center mt-0.5 font-medium text-red-600 w-full px-0.5 line-clamp-2">
                            {holiday.title}
                          </span>
                        )}
                        {isWeekend && !holiday && (
                          <span className="text-[8px] text-[#113F67]/40 font-medium mt-0.5">
                            Off
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ── [Edit mode] Selected Day Panel ── */}
                {editMode && selectedCell && (
                  <div className="mt-4 rounded-xl border border-[#113F67]/20 bg-[#113F67]/5 overflow-hidden">
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#113F67]/10 border-b border-[#113F67]/20">
                      <div>
                        <p className="text-sm font-semibold text-[#113F67]">
                          {cellDateLabel(selectedCell)}
                        </p>
                        <p className="text-xs text-[#113F67]/70 mt-0.5">
                          {selectedCell.holiday
                            ? `Public Holiday — ${selectedCell.holiday.title}`
                            : selectedCell.isWeekend
                              ? "Weekend (day off)"
                              : "Working Day"}
                        </p>
                      </div>
                      <button
                        onClick={closeDayPanel}
                        className="p-1.5 rounded-lg hover:bg-[#113F67]/10 text-[#113F67]"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="p-4">
                      {/* Action buttons row */}
                      {!addingHoliday && (
                        <div className="flex flex-wrap gap-2 mb-0">
                          {/* Add Holiday */}
                          <button
                            onClick={() => setAddingHoliday(true)}
                            className="flex items-center gap-1.5 text-xs font-medium bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Plus size={12} /> Add Holiday
                          </button>

                          {/* Delete existing holiday */}
                          {selectedCell.holiday && (
                            <button
                              onClick={() =>
                                handleDeleteHoliday(selectedCell.holiday._id)
                              }
                              disabled={editSaving}
                              className="flex items-center gap-1.5 text-xs font-medium bg-white border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
                            >
                              {editSaving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                              Remove Holiday
                            </button>
                          )}

                          {/* Make working day (for weekends) */}
                          {selectedCell.isWeekend && (
                            <button
                              onClick={handleMakeWorkingDay}
                              disabled={editSaving}
                              className="flex items-center gap-1.5 text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                            >
                              {editSaving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Briefcase size={12} />
                              )}
                              Make Working Day (this date only)
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── Add Holiday Form ── */}
                      {addingHoliday && (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Add Holiday — {selectedCell.day}{" "}
                            {MONTHS[calMonth - 1]} {calYear}
                          </p>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1 font-medium">
                                Holiday Name *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Eid ul-Fitr"
                                value={holidayForm.title}
                                onChange={(e) =>
                                  setHolidayForm((f) => ({
                                    ...f,
                                    title: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                                autoFocus
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1 font-medium">
                                Type
                              </label>
                              <select
                                value={holidayForm.type}
                                onChange={(e) =>
                                  setHolidayForm((f) => ({
                                    ...f,
                                    type: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                              >
                                <option value="GOVT">Government Holiday</option>
                                <option value="COMPANY">Company Holiday</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1 font-medium">
                              End Date{" "}
                              <span className="text-gray-400 font-normal">
                                (leave empty for single day)
                              </span>
                            </label>
                            <input
                              type="date"
                              value={holidayForm.endDate}
                              min={`${calYear}-${String(calMonth).padStart(2, "0")}-${String(selectedCell.day).padStart(2, "0")}`}
                              onChange={(e) =>
                                setHolidayForm((f) => ({
                                  ...f,
                                  endDate: e.target.value,
                                }))
                              }
                              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                            />
                            {holidayForm.endDate && (
                              <p className="text-xs text-blue-600 mt-1">
                                Will add holidays from {selectedCell.day}{" "}
                                {MONTHS[calMonth - 1]} to{" "}
                                {new Date(holidayForm.endDate).getUTCDate()}{" "}
                                {
                                  MONTHS[
                                    new Date(holidayForm.endDate).getUTCMonth()
                                  ]
                                }
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={handleAddHoliday}
                              disabled={editSaving || !holidayForm.title.trim()}
                              className="flex items-center gap-1.5 text-xs font-medium bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
                            >
                              {editSaving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Check size={12} />
                              )}
                              Save Holiday
                            </button>
                            <button
                              onClick={() => setAddingHoliday(false)}
                              className="text-xs font-medium border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Legend ── */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3.5 h-3.5 rounded bg-blue-50 border border-blue-200 shrink-0" />{" "}
                    Weekend
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3.5 h-3.5 rounded bg-red-50 border border-red-200 shrink-0" />{" "}
                    Public Holiday
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3.5 h-3.5 rounded bg-orange-50 border border-orange-200 shrink-0" />{" "}
                    Holiday on Weekend
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-6 h-6 rounded-full bg-[#113F67] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                      {todayDay}
                    </span>{" "}
                    Today
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3.5 h-3.5 rounded bg-white border border-gray-200 shrink-0" />{" "}
                    Working Day
                  </span>
                </div>

                {/* ── Holiday pill list ── */}
                {monthHolidayList.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Holidays in {MONTHS[calMonth - 1]} {calYear}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {monthHolidayList.map((h) => {
                        const hd = new Date(h.date);
                        const dayNum = hd.getUTCDate();
                        const dayName = DAYS[hd.getUTCDay()];
                        const isWknd = currentDays.includes(dayName);
                        return (
                          <div
                            key={h._id}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border group ${
                              isWknd
                                ? "bg-orange-50 border-orange-200 text-orange-700"
                                : "bg-red-50 border-red-200 text-red-700"
                            }`}
                          >
                            <span className="font-bold">{dayNum}</span>
                            <span>{h.title}</span>
                            {isWknd && (
                              <span className="text-[10px] opacity-60">
                                (weekend)
                              </span>
                            )}
                            {isAdmin && editMode && (
                              <button
                                onClick={() => handleDeleteHoliday(h._id)}
                                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-current hover:text-red-900"
                              >
                                <X size={11} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Info note ── */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-700 space-y-1">
              <p className="font-semibold text-sm text-blue-800">
                How off days affect attendance and payroll
              </p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-1">
                <span className="flex items-start gap-1">
                  <Check size={11} className="mt-0.5 shrink-0 text-blue-500" />{" "}
                  Weekend days are auto-marked — no clock-in needed
                </span>
                <span className="flex items-start gap-1">
                  <Check size={11} className="mt-0.5 shrink-0 text-blue-500" />{" "}
                  Off days are not counted as absent — no salary cut
                </span>
                <span className="flex items-start gap-1">
                  <Check size={11} className="mt-0.5 shrink-0 text-blue-500" />{" "}
                  "Make Working Day" overrides a weekend for that date only
                </span>
                <span className="flex items-start gap-1">
                  <Check size={11} className="mt-0.5 shrink-0 text-blue-500" />{" "}
                  Add GOVT holidays for national days, COMPANY for internal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
