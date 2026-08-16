// All time display uses Bangladesh Standard Time (UTC+6, Asia/Dhaka)
const TZ = 'Asia/Dhaka';

export const formatBDDateTime = (ts) => {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('en-BD', {
      timeZone: TZ,
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  } catch { return '—'; }
};

export const formatBDDate = (ts) => {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleDateString('en-BD', {
      timeZone: TZ,
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return '—'; }
};

export const formatBDTime = (ts) => {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleTimeString('en-BD', {
      timeZone: TZ,
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  } catch { return '—'; }
};

// Short: "15 Jan, 10:30 AM"
export const formatBDShort = (ts) => {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('en-BD', {
      timeZone: TZ,
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  } catch { return '—'; }
};

// Date only: "15 Jan 2024"
export const formatBDDateLong = (ts) => {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleDateString('en-BD', {
      timeZone: TZ,
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch { return '—'; }
};

// Weekday: "Monday, 15 Jan"
export const formatBDWeekday = (ts) => {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleDateString('en-BD', {
      timeZone: TZ,
      weekday: 'long', day: 'numeric', month: 'short'
    });
  } catch { return '—'; }
};

// For use in PDF/text generation
export const nowBD = () =>
  new Date().toLocaleString('en-BD', {
    timeZone: TZ,
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
