import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Bell, Search, Filter, Plus, Calendar, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent' | 'maintenance';
  isActive: boolean;
  publishedAt: string;
  publishedBy: string;
  expiresAt?: string;
}

const NoticesManagement: React.FC = () => {
  const [notices] = useState<Notice[]>([
    {
      id: '1',
      title: 'Manutenção no Elevador',
      content: 'O elevador social passará por manutenção preventiva na próxima sexta-feira das 8h às 17h.',
      type: 'maintenance',
      isActive: true,
      publishedAt: '2024-01-15T08:00:00Z',
      publishedBy: 'Síndico',
      expiresAt: '2024-01-26T23:59:59Z'
    },
    {
      id: '2',
      title: 'Nova Política de Uso da Piscina',
      content: 'Informamos sobre as novas regras de uso da área de lazer. Consulte o regulamento atualizado.',
      type: 'info',
      isActive: true,
      publishedAt: '2024-01-10T10:00:00Z',
      publishedBy: 'Administração'
    },
    {
      id: '3',
      title: 'URGENTE: Problema no Sistema de Água',
      content: 'Devido a um problema técnico, o fornecimento de água será interrompido hoje das 14h às 18h.',
      type: 'urgent',
      isActive: false,
      publishedAt: '2024-01-08T12:00:00Z',
      publishedBy: 'Síndico',
      expiresAt: '2024-01-08T23:59:59Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'info' as Notice['type'],
    isActive: true,
    expiresAt: ''
  });

  const getTypeBadge = (type: Notice['type']) => {
    const typeConfig = {
      info: { label: 'Informativo', icon: Info, color: 'bg-blue-500 text-white' },
      warning: { label: 'Aviso', icon: AlertTriangle, color: 'bg-yellow-500 text-black' },
      urgent: { label: 'Urgente', icon: AlertTriangle, color: 'bg-red-500 text-white' },
      maintenance: { label: 'Manutenção', icon: CheckCircle, color: 'bg-purple-500 text-white' }
    };

    const config = typeConfig[type];
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || notice.type === typeFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && notice.isActive) ||
      (statusFilter === 'inactive' && !notice.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  const handleAddNotice = () => {
    // Aqui seria implementada a lógica de adicionar aviso
    console.log('Adicionando aviso:', newNotice);
    setIsAddDialogOpen(false);
    setNewNotice({ title: '', content: '', type: 'info', isActive: true, expiresAt: '' });
  };

  const toggleNoticeStatus = (noticeId: string) => {
    // Aqui seria implementada a lógica de ativar/desativar aviso
    console.log('Alterando status do aviso:', noticeId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Gerenciamento de Avisos
              <Badge variant="secondary" className="ml-2">
                {filteredNotices.length} de {notices.length}
              </Badge>
            </CardTitle>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Publicar Aviso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Publicar Novo Aviso</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Digite o título do aviso"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea
                      id="content"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Digite o conteúdo do aviso"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={newNotice.type} onValueChange={(value: Notice['type']) => setNewNotice(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Informativo</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="expiresAt">Data de Expiração (Opcional)</Label>
                    <Input
                      id="expiresAt"
                      type="date"
                      value={newNotice.expiresAt}
                      onChange={(e) => setNewNotice(prev => ({ ...prev, expiresAt: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={newNotice.isActive}
                      onCheckedChange={(checked) => setNewNotice(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Publicar imediatamente</Label>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddNotice}>
                      Publicar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar avisos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                <SelectItem value="info">Informativo</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredNotices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum aviso encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <Card key={notice.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(notice.type)}
                        <Badge variant={notice.isActive ? "default" : "secondary"}>
                          {notice.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(notice.publishedAt)}
                        </span>
                      </div>
                      
                      <div className="text-lg font-medium">
                        {notice.title}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {notice.content}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Publicado por: {notice.publishedBy}
                        {notice.expiresAt && (
                          <span className="ml-4">
                            Expira em: {formatDateTime(notice.expiresAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleNoticeStatus(notice.id)}
                      >
                        {notice.isActive ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoticesManagement;