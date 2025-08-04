import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Search, Filter, Plus, Edit, UserCheck, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

const ResidentsManagement: React.FC = () => {
  const [residents, setResidents] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newResident, setNewResident] = useState({
    display_name: '',
    apartment_number: '',
    role: 'resident' as 'admin' | 'resident'
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('apartment_number');

      if (error) throw error;
      setResidents(data || []);
    } catch (error) {
      console.error('Erro ao buscar moradores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de moradores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'resident') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setResidents(prev => prev.map(resident => 
        resident.user_id === userId ? { ...resident, role: newRole } : resident
      ));

      toast({
        title: "Sucesso",
        description: `Perfil atualizado para ${newRole === 'admin' ? 'Administrador' : 'Morador'}.`
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = 
      resident.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.apartment_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || resident.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge className="bg-primary text-primary-foreground">Administrador</Badge>;
    }
    return <Badge variant="secondary">Morador</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando moradores...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Gerenciamento de Moradores
              <Badge variant="secondary" className="ml-2">
                {filteredResidents.length} de {residents.length}
              </Badge>
            </CardTitle>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou apartamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="resident">Moradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredResidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum morador encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResidents.map((resident) => (
                <Card key={resident.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getRoleBadge(resident.role)}
                        <span className="text-sm text-muted-foreground">
                          Apartamento {resident.apartment_number}
                        </span>
                      </div>
                      
                      <div className="text-lg font-medium">
                        {resident.display_name || 'Nome não informado'}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Cadastrado em: {new Date(resident.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {resident.role === 'resident' ? (
                        <Button
                          size="sm"
                          onClick={() => handleRoleChange(resident.user_id, 'admin')}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Tornar Admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(resident.user_id, 'resident')}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Remover Admin
                        </Button>
                      )}
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

export default ResidentsManagement;