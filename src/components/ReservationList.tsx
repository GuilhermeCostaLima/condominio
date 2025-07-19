import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Building, Phone, FileText, Search, Filter } from 'lucide-react';
import { Reservation } from './ReservationCalendar';

interface ReservationListProps {
  reservations: Reservation[];
  onStatusChange: (id: string, status: Reservation['status']) => void;
  isAdmin?: boolean;
}

const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  onStatusChange,
  isAdmin = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.event.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;

    const today = new Date();
    const reservationDate = new Date(reservation.date + 'T00:00:00');
    
    let matchesDate = true;
    if (dateFilter === 'upcoming') {
      matchesDate = reservationDate >= today;
    } else if (dateFilter === 'past') {
      matchesDate = reservationDate < today;
    } else if (dateFilter === 'thisWeek') {
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      matchesDate = reservationDate >= today && reservationDate <= weekFromNow;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedReservations = filteredReservations.sort((a, b) => {
    const dateA = new Date(a.date + 'T00:00:00');
    const dateB = new Date(b.date + 'T00:00:00');
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Reservas
          <Badge variant="secondary" className="ml-auto">
            {filteredReservations.length} de {reservations.length}
          </Badge>
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, apartamento ou evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Datas</SelectItem>
              <SelectItem value="upcoming">Próximas</SelectItem>
              <SelectItem value="thisWeek">Esta Semana</SelectItem>
              <SelectItem value="past">Passadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {sortedReservations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma reserva encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusText(reservation.status)}
                      </Badge>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(reservation.date)}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {reservation.timeSlot}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{reservation.residentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>Apto {reservation.apartment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.event}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.contact}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isAdmin && reservation.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onStatusChange(reservation.id, 'confirmed')}
                        className="bg-success hover:bg-success/90"
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onStatusChange(reservation.id, 'cancelled')}
                      >
                        Recusar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationList;