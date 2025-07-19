import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, Users, Settings } from 'lucide-react';
import ReservationCalendar, { Reservation } from '@/components/ReservationCalendar';
import ReservationForm from '@/components/ReservationForm';
import ReservationList from '@/components/ReservationList';
import AdminPanel from '@/components/AdminPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      date: '2024-01-25',
      timeSlot: '16:00 - 20:00',
      residentName: 'João Silva',
      apartment: '101',
      event: 'Aniversário de 30 anos',
      status: 'confirmed',
      contact: '(11) 99999-9999'
    },
    {
      id: '2',
      date: '2024-01-28',
      timeSlot: '20:00 - 00:00',
      residentName: 'Maria Santos',
      apartment: '205',
      event: 'Reunião de família',
      status: 'pending',
      contact: '(11) 88888-8888'
    },
    {
      id: '3',
      date: '2024-02-05',
      timeSlot: '12:00 - 16:00',
      residentName: 'Carlos Oliveira',
      apartment: '304',
      event: 'Confraternização',
      status: 'confirmed',
      contact: '(11) 77777-7777'
    }
  ]);

  const handleReservationAdd = (newReservation: Omit<Reservation, 'id'>) => {
    const reservation: Reservation = {
      ...newReservation,
      id: Date.now().toString()
    };
    setReservations(prev => [...prev, reservation]);
  };

  const handleStatusChange = (id: string, status: Reservation['status']) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id ? { ...reservation, status } : reservation
      )
    );
    
    const statusText = status === 'confirmed' ? 'aprovada' : 'recusada';
    toast({
      title: "Status Atualizado",
      description: `Reserva ${statusText} com sucesso.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sistema de Reservas</h1>
                <p className="text-sm text-muted-foreground">Salão de Festas - Condomínio</p>
              </div>
            </div>
            <Button
              variant={isAdminMode ? "default" : "outline"}
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {isAdminMode ? 'Sair do Admin' : 'Modo Admin'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isAdminMode ? (
          <AdminPanel
            reservations={reservations}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Minhas Reservas
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Informações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReservationCalendar
                  reservations={reservations}
                  onDateSelect={setSelectedDate}
                  selectedDate={selectedDate}
                />
                <ReservationForm
                  selectedDate={selectedDate}
                  onReservationAdd={handleReservationAdd}
                  existingReservations={reservations}
                />
              </div>
            </TabsContent>

            <TabsContent value="reservations" className="mt-6">
              <ReservationList
                reservations={reservations}
                onStatusChange={handleStatusChange}
                isAdmin={false}
              />
            </TabsContent>

            <TabsContent value="info" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Informações do Salão
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Capacidade</h4>
                      <p className="text-muted-foreground">Até 80 pessoas</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Equipamentos Inclusos</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Sistema de som</li>
                        <li>• Mesas e cadeiras</li>
                        <li>• Cozinha equipada</li>
                        <li>• Ar condicionado</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Horários Disponíveis</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Manhã: 08:00 - 12:00</li>
                        <li>• Tarde: 12:00 - 16:00</li>
                        <li>• Final da tarde: 16:00 - 20:00</li>
                        <li>• Noite: 20:00 - 00:00</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regras de Uso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Reservas</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Antecedência mínima: 7 dias</li>
                        <li>• Máximo 1 reserva por mês por apartamento</li>
                        <li>• Confirmação em até 48 horas</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Condições</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Limpeza obrigatória após o uso</li>
                        <li>• Não é permitido som alto após 22h</li>
                        <li>• Responsabilidade por danos</li>
                        <li>• Taxa de limpeza: R$ 100,00</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Contato</h4>
                      <p className="text-muted-foreground">
                        Administração: (11) 3333-3333<br />
                        WhatsApp: (11) 99999-0000
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
