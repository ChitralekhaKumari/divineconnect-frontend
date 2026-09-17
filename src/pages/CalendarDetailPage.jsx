import { useParams } from 'react-router-dom';
import SpiritualCalendar from '../components/SpiritualCalendar';
import IndianCalendarView from '../components/IndianCalendarView';
import RegionalCalendarView from '../components/RegionalCalendarView';
import { CALENDAR_TYPES } from '../data/calendarTypes';

export default function CalendarDetailPage() {
  const { type } = useParams();
  const isKnown = CALENDAR_TYPES.some(c => c.slug === type);

  if (!isKnown) return <SpiritualCalendar calendarType={null} />;
  if (type === 'indian') return <IndianCalendarView calendarType={type} />;
  if (type === 'hindu') return <SpiritualCalendar calendarType={type} />;
  return <RegionalCalendarView calendarType={type} />;
}
