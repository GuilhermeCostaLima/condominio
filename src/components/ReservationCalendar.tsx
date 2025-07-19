import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Reservation {
  id: string;
  date: string;
  timeSlot: string;
  residentName: string;
  apartment: string;
  event: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  contact: string;
  cancellationReason?: string;
}

interface ReservationCalendarProps {
  reservations: Reservation[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  reservations,
  onDateSelect,
  selectedDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());

  const days = [];
  const current = new Date(startOfCalendar);
  
  while (current <= endOfMonth || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getDateReservations = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations.filter(r => r.date === dateStr && r.status !== 'cancelled');
  };

  const getDayStatus = (date: Date) => {
    const dateReservations = getDateReservations(date);
    if (dateReservations.length === 0) return 'available';
    if (dateReservations.some(r => r.status === 'confirmed')) return 'booked';
    return 'pending';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Calendário de Reservas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[120px] text-center font-medium">
              {currentDate.toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-available"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pending"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-booked"></div>
            <span>Reservado</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const status = getDayStatus(date);
            const dateStr = date.toISOString().split('T')[0];
            const reservationsCount = getDateReservations(date).length;
            const isSelected = selectedDate === dateStr;
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            
            return (
              <Button
                key={index}
                variant="ghost"
                className={`
                  h-12 p-1 relative flex flex-col items-center justify-center text-xs
                  ${!isCurrentMonth(date) ? 'text-muted-foreground opacity-40' : ''}
                  ${isToday(date) ? 'bg-accent' : ''}
                  ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                  ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}
                `}
                onClick={() => !isPast && onDateSelect(dateStr)}
                disabled={isPast}
              >
                <span className={isToday(date) ? 'font-bold' : ''}>{date.getDate()}</span>
                {reservationsCount > 0 && (
                  <div 
                    className={`
                      w-2 h-2 rounded-full mt-0.5
                      ${status === 'available' ? 'bg-available' : ''}
                      ${status === 'pending' ? 'bg-pending' : ''}
                      ${status === 'booked' ? 'bg-booked' : ''}
                    `}
                  />
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCalendar;