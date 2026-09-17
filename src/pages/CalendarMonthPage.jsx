import { useParams, Navigate } from 'react-router-dom';
import RegionalCalendarMonth from '../components/RegionalCalendarMonth';
import { CALENDAR_TYPES } from '../data/calendarTypes';

export default function CalendarMonthPage() {
  const { type, year, month } = useParams();
  const isKnown = CALENDAR_TYPES.some(c => c.slug === type) && type !== 'indian' && type !== 'hindu';
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);

  if (!isKnown || isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    return <Navigate to={`/calendar/${type}`} replace />;
  }

  return <RegionalCalendarMonth calendarType={type} year={y} month={m} />;
}
