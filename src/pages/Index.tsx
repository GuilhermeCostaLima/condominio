import React, { useState } from 'react';
import CondominiumLayout from '@/components/CondominiumLayout';
import Dashboard from '@/components/Dashboard';
import ReservationCalendar, { Reservation } from '@/components/ReservationCalendar';
import ReservationForm from '@/components/ReservationForm';
import ReservationList from '@/components/ReservationList';
import AdminPanel from '@/components/AdminPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const Index = () => {
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
      contact: '(11) 99999-9999'
    },
    {
      id: '2',
      date: '2024-01-16',
      timeSlot: '14:00-18:00',
      residentName: 'João Santos',
      apartment: 'Apto 205',
      event: 'Reunião de família',
      status: 'pending',
      contact: '(11) 88888-8888'
    },
    {
      id: '3',
      date: '2024-01-17',
      timeSlot: '20:00-00:00',
      residentName: 'Ana Costa',
      apartment: 'Apto 312',
      event: 'Festa de formatura',
      status: 'confirmed',
      contact: '(11) 77777-7777'
    }
  ]);

  const handleNewReservation = (reservation: Omit<Reservation, 'id' | 'status'>) => {
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

  const handleDeleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      
      case 'reservations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Sistema de Reservas</h2>
              <p className="text-muted-foreground">Gerencie as reservas do salão de festas</p>
            </div>

            {/* Informações do Salão */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Salão de Festas Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">Capacidade</h3>
                    <p className="text-sm text-muted-foreground">Até 80 pessoas</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">Localização</h3>
                    <p className="text-sm text-muted-foreground">Térreo do Edifício</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">Horários</h3>
                    <p className="text-sm text-muted-foreground">8h às 23h</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">Disponibilidade</h3>
                    <p className="text-sm text-muted-foreground">Todos os dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="new-reservation">Nova Reserva</TabsTrigger>
                <TabsTrigger value="my-reservations">Minhas Reservas</TabsTrigger>
                <TabsTrigger value="admin">Administração</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar">
                <ReservationCalendar
                  reservations={reservations}
                  onDateSelect={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </TabsContent>

              <TabsContent value="new-reservation">
                <ReservationForm
                  onReservationAdd={handleNewReservation}
                  selectedDate={selectedDate}
                  existingReservations={reservations}
                />
              </TabsContent>

              <TabsContent value="my-reservations">
                <ReservationList
                  reservations={reservations}
                  showUserReservationsOnly={true}
                />
              </TabsContent>

              <TabsContent value="admin">
                <AdminPanel
                  reservations={reservations}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        );
      
      case 'residents':
        return (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Moradores</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      
      case 'documents':
        return (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Documentos</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      
      case 'notices':
        return (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Avisos</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      
      case 'settings':
        return (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Configurações</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
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

export default Index;
