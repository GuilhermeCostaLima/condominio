import React, { useState } from 'react';
import CondominiumLayout from '@/components/CondominiumLayout';
import Dashboard from '@/components/Dashboard';
import ReservationCalendar from '@/components/ReservationCalendar';
import ReservationForm from '@/components/ReservationForm';
import ReservationList from '@/components/ReservationList';
import AdminPanel from '@/components/AdminPanel';
import { Reservation } from '@/components/ReservationCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { UserTypeProvider, useUserType } from '@/components/UserTypeProvider';

const IndexContent = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      date: '2024-01-15',
      timeSlot: '19:00-23:00',
      residentName: 'Maria Silva',
      apartment: 'Apto 101',
      event: 'Aniversário da Maria',
      status: 'confirmed',
      contact: '(11) 99999-9999',
      requestedAt: new Date().toISOString()
    },
    {
      id: '2',
      date: '2024-01-16',
      timeSlot: '14:00-18:00',
      residentName: 'João Santos',
      apartment: 'Apto 205',
      event: 'Reunião de família',
      status: 'pending',
      contact: '(11) 88888-8888',
      requestedAt: new Date().toISOString()
    },
    {
      id: '3',
      date: '2024-01-17',
      timeSlot: '20:00-00:00',
      residentName: 'Ana Costa',
      apartment: 'Apto 312',
      event: 'Festa de formatura',
      status: 'confirmed',
      contact: '(11) 77777-7777',
      requestedAt: new Date().toISOString()
    }
  ]);
  const { userType, currentUser } = useUserType();

  const handleNewReservation = (reservation: Omit<Reservation, 'id'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
      status: 'pending'
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const handleStatusChange = (id: string, status: Reservation['status'], reason?: string) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id ? { 
          ...reservation, 
          status,
          ...(status === 'cancelled' && reason ? { cancellationReason: reason } : {})
        } : reservation
      )
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;

        case 'reservations':
          if (userType === 'admin') {
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ReservationCalendar
                    reservations={reservations}
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                  <ReservationForm
                    selectedDate={selectedDate}
                    onReservationAdd={handleNewReservation}
                    existingReservations={reservations}
                  />
                </div>
                <div>
                  <AdminPanel
                    reservations={reservations}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>
            );
          } else {
            // Para moradores: apenas fazer reservas e ver suas próprias
            const userReservations = reservations.filter(r => r.residentName === currentUser);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ReservationCalendar
                    reservations={reservations}
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                  <ReservationForm
                    selectedDate={selectedDate}
                    onReservationAdd={handleNewReservation}
                    existingReservations={reservations}
                  />
                </div>
                <div>
                  <ReservationList 
                    reservations={userReservations}
                    showUserReservationsOnly={true}
                  />
                </div>
              </div>
            );
          }
      
      case 'residents':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-primary" />
                Moradores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      
      case 'documents':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-primary" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      
      case 'notices':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-primary" />
                Avisos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-primary" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <CondominiumLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </CondominiumLayout>
  );
};

const Index = () => {
  return (
    <UserTypeProvider>
      <IndexContent />
    </UserTypeProvider>
  );
};

export default Index;
