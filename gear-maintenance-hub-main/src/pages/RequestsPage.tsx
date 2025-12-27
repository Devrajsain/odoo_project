import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Plus,
  AlertTriangle,
  Clock,
  User,
  Filter,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore, MaintenanceRequest, RequestStatus } from '@/store/appStore';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const STATUSES: RequestStatus[] = ['New', 'In Progress', 'Repaired', 'Scrap'];

const statusColors = {
  'New': 'border-t-primary bg-primary/5',
  'In Progress': 'border-t-accent bg-accent/5',
  'Repaired': 'border-t-success bg-success/5',
  'Scrap': 'border-t-destructive bg-destructive/5',
};

export default function RequestsPage() {
  const { requests, equipment, teams, users, updateRequestStatus, addRequest } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesTeam = filterTeam === 'all' || r.teamId === filterTeam;
      const matchesType = filterType === 'all' || r.type === filterType;
      return matchesTeam && matchesType;
    });
  }, [requests, filterTeam, filterType]);

  const groupedRequests = useMemo(() => {
    const groups: Record<RequestStatus, MaintenanceRequest[]> = {
      'New': [],
      'In Progress': [],
      'Repaired': [],
      'Scrap': [],
    };
    
    filteredRequests.forEach((request) => {
      groups[request.status].push(request);
    });
    
    return groups;
  }, [filteredRequests]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as RequestStatus;
    
    updateRequestStatus(draggableId, newStatus);
  };

  return (
    <div className="min-h-screen">
      <Navbar title="Maintenance Requests" />

      <div className="p-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-1">
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="w-40 bg-secondary/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-secondary/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Preventive">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="glow">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
              </DialogHeader>
              <AddRequestForm
                equipment={equipment}
                teams={teams}
                users={users}
                onSubmit={(data) => {
                  addRequest(data);
                  setIsAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="flex flex-col">
                <div
                  className={cn(
                    'rounded-t-xl border-t-4 p-4',
                    statusColors[status]
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{status}</h3>
                    <Badge variant="outline" className="font-mono">
                      {groupedRequests[status].length}
                    </Badge>
                  </div>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'flex-1 min-h-[400px] rounded-b-xl border border-t-0 border-border/50 bg-secondary/20 p-2 space-y-2 transition-colors',
                        snapshot.isDraggingOver && 'bg-primary/5 border-primary/30'
                      )}
                    >
                      {groupedRequests[status].map((request, index) => (
                        <Draggable
                          key={request.id}
                          draggableId={request.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <RequestCard
                              request={request}
                              equipment={equipment}
                              users={users}
                              teams={teams}
                              provided={provided}
                              isDragging={snapshot.isDragging}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

interface RequestCardProps {
  request: MaintenanceRequest;
  equipment: any[];
  users: any[];
  teams: any[];
  provided: any;
  isDragging: boolean;
}

function RequestCard({
  request,
  equipment,
  users,
  teams,
  provided,
  isDragging,
}: RequestCardProps) {
  const eq = equipment.find((e) => e.id === request.equipmentId);
  const technician = users.find((u) => u.id === request.technicianId);
  const team = teams.find((t) => t.id === request.teamId);

  const priorityVariant: Record<string, 'high' | 'medium' | 'low'> = {
    high: 'high',
    medium: 'medium',
    low: 'low',
  };

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'rounded-lg border bg-card p-3 cursor-grab active:cursor-grabbing transition-all',
        isDragging && 'shadow-elevated rotate-2 scale-105',
        request.isOverdue && 'border-l-4 border-l-destructive'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-tight truncate">
            {request.subject}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {eq?.name || 'Unknown Equipment'}
          </p>
        </div>
        {request.isOverdue && (
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 ml-2" />
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <Badge
          variant={request.type === 'Preventive' ? 'outline' : 'secondary'}
          className="text-[10px] px-1.5"
        >
          {request.type}
        </Badge>
        <Badge variant={priorityVariant[request.priority]} className="text-[10px] px-1.5">
          {request.priority}
        </Badge>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        {technician ? (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[8px] bg-primary/20 text-primary">
                {technician.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              {technician.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>Unassigned</span>
          </div>
        )}

        {request.scheduledDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(request.scheduledDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface AddRequestFormProps {
  equipment: any[];
  teams: any[];
  users: any[];
  onSubmit: (data: any) => void;
}

function AddRequestForm({ equipment, teams, users, onSubmit }: AddRequestFormProps) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'Corrective' as 'Corrective' | 'Preventive',
    equipmentId: '',
    teamId: '',
    technicianId: '',
    scheduledDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // Auto-fill logic when equipment is selected
  const handleEquipmentChange = (equipmentId: string) => {
    const eq = equipment.find((e) => e.id === equipmentId);
    if (eq) {
      setFormData({
        ...formData,
        equipmentId,
        teamId: eq.maintenanceTeamId || '',
        technicianId: eq.defaultTechnicianId || '',
      });
    } else {
      setFormData({ ...formData, equipmentId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subject && formData.equipmentId && formData.teamId) {
      onSubmit({
        ...formData,
        status: 'New',
      });
    }
  };

  const activeEquipment = equipment.filter((e) => !e.isScrapped);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="What is the issue?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Provide more details..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Request Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(v: 'Corrective' | 'Preventive') =>
              setFormData({ ...formData, type: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corrective">Corrective (Breakdown)</SelectItem>
              <SelectItem value="Preventive">Preventive (Scheduled)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority *</Label>
          <Select
            value={formData.priority}
            onValueChange={(v: 'low' | 'medium' | 'high') =>
              setFormData({ ...formData, priority: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Equipment *</Label>
        <Select value={formData.equipmentId} onValueChange={handleEquipmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select equipment" />
          </SelectTrigger>
          <SelectContent>
            {activeEquipment.map((eq) => (
              <SelectItem key={eq.id} value={eq.id}>
                {eq.name} ({eq.serialNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Maintenance Team *</Label>
          <Select
            value={formData.teamId}
            onValueChange={(v) => setFormData({ ...formData, teamId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Assign Technician</Label>
          <Select
            value={formData.technicianId}
            onValueChange={(v) => setFormData({ ...formData, technicianId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              {users
                .filter((u) => u.role === 'technician')
                .map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.type === 'Preventive' && (
        <div className="space-y-2">
          <Label>Scheduled Date</Label>
          <Input
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          />
        </div>
      )}

      <Button type="submit" className="w-full" variant="glow">
        Create Request
      </Button>
    </form>
  );
}
