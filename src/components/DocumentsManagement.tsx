import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Search, Filter, Plus, Download, Eye, Calendar } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  category: 'regulamento' | 'ata' | 'comunicado' | 'financeiro' | 'outros';
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
}

const DocumentsManagement: React.FC = () => {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      title: 'Regulamento Interno do Condomínio',
      description: 'Normas e regras de convivência do condomínio',
      category: 'regulamento',
      uploadedAt: '2024-01-15T10:00:00Z',
      uploadedBy: 'Admin Sistema',
      fileSize: '2.3 MB'
    },
    {
      id: '2',
      title: 'Ata da Assembleia - Janeiro 2024',
      description: 'Registro da assembleia geral ordinária de janeiro',
      category: 'ata',
      uploadedAt: '2024-01-20T14:30:00Z',
      uploadedBy: 'Síndico',
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      title: 'Demonstrativo Financeiro - Dezembro 2023',
      description: 'Relatório de receitas e despesas do condomínio',
      category: 'financeiro',
      uploadedAt: '2024-01-05T09:15:00Z',
      uploadedBy: 'Administradora',
      fileSize: '895 KB'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    category: 'comunicado' as Document['category']
  });

  const getCategoryBadge = (category: Document['category']) => {
    const categoryConfig = {
      regulamento: { label: 'Regulamento', color: 'bg-blue-500 text-white' },
      ata: { label: 'Ata', color: 'bg-green-500 text-white' },
      comunicado: { label: 'Comunicado', color: 'bg-yellow-500 text-black' },
      financeiro: { label: 'Financeiro', color: 'bg-purple-500 text-white' },
      outros: { label: 'Outros', color: 'bg-gray-500 text-white' }
    };

    const config = categoryConfig[category];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleAddDocument = () => {
    // Aqui seria implementada a lógica de upload
    console.log('Adicionando documento:', newDocument);
    setIsAddDialogOpen(false);
    setNewDocument({ title: '', description: '', category: 'comunicado' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Gerenciamento de Documentos
              <Badge variant="secondary" className="ml-2">
                {filteredDocuments.length} de {documents.length}
              </Badge>
            </CardTitle>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Documento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Documento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newDocument.title}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Digite o título do documento"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newDocument.description}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Digite uma breve descrição"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={newDocument.category} onValueChange={(value: Document['category']) => setNewDocument(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regulamento">Regulamento</SelectItem>
                        <SelectItem value="ata">Ata</SelectItem>
                        <SelectItem value="comunicado">Comunicado</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddDocument}>
                      Adicionar
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
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="regulamento">Regulamento</SelectItem>
                <SelectItem value="ata">Ata</SelectItem>
                <SelectItem value="comunicado">Comunicado</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getCategoryBadge(document.category)}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(document.uploadedAt)}
                        </span>
                      </div>
                      
                      <div className="text-lg font-medium">
                        {document.title}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {document.description}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Enviado por: {document.uploadedBy} • {document.fileSize}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
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

export default DocumentsManagement;