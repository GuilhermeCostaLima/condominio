import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  FileText, 
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    {
      title: 'Reservas Hoje',
      value: '3',
      icon: Calendar,
      color: 'text-primary',
      trend: '+2 em relação a ontem'
    },
    {
      title: 'Moradores Ativos',
      value: '95',
      icon: Users,
      color: 'text-green-600',
      trend: '79% de ocupação'
    },
    {
      title: 'Avisos Pendentes',
      value: '2',
      icon: Bell,
      color: 'text-orange-600',
      trend: 'Necessita atenção'
    },
    {
      title: 'Documentos',
      value: '12',
      icon: FileText,
      color: 'text-blue-600',
      trend: 'Atualizados este mês'
    }
  ];

  const recentReservations = [
    {
      id: '1',
      resident: 'Maria Silva',
      apartment: 'Apto 101',
      date: '2024-01-15',
      time: '19:00-23:00',
      status: 'confirmed' as const
    },
    {
      id: '2',
      resident: 'João Santos',
      apartment: 'Apto 205',
      date: '2024-01-16',
      time: '14:00-18:00',
      status: 'pending' as const
    },
    {
      id: '3',
      resident: 'Ana Costa',
      apartment: 'Apto 312',
      date: '2024-01-17',
      time: '20:00-00:00',
      status: 'confirmed' as const
    }
  ];

  const notices = [
    {
      id: '1',
      title: 'Manutenção dos Elevadores',
      date: '2024-01-15',
      priority: 'high' as const,
      preview: 'Programada para o próximo sábado...'
    },
    {
      id: '2',
      title: 'Assembleia Geral Ordinária',
      date: '2024-01-20',
      priority: 'medium' as const,
      preview: 'Convocação para assembleia do dia 25/01...'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gestão do condomínio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Reservas Recentes</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('reservations')}
            >
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{reservation.resident}</p>
                      <span className="text-sm text-muted-foreground">• {reservation.apartment}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(reservation.date).toLocaleDateString('pt-BR')} • {reservation.time}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {reservation.status === 'confirmed' ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Confirmada</>
                    ) : (
                      <><Clock className="h-3 w-3 mr-1" /> Pendente</>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Avisos Recentes</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('notices')}
            >
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{notice.title}</h4>
                        {notice.priority === 'high' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notice.preview}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notice.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('reservations')}
            >
              <Calendar className="h-6 w-6" />
              <span>Nova Reserva</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('notices')}
            >
              <Bell className="h-6 w-6" />
              <span>Publicar Aviso</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('documents')}
            >
              <FileText className="h-6 w-6" />
              <span>Adicionar Documento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;