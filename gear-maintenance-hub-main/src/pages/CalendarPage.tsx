import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Plus, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore } from '@/store/appStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export default function CalendarPage() {
  const { requests, equipment, teams, users, addRequest } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Filter only preventive maintenance and scheduled requests
  const calendarEvents = useMemo(() => {
    return requests
      .filter((r) => r.scheduledDate || r.type === 'Preventive')
      .map((request) => {
        const eq = equipment.find((e) => e.id === request.equipmentId);
        const statusColors: Record<string, string> = {
          'New': '#3B82F6',
          'In Progress': '#F59E0B',
          'Repaired': '#10B981',
          'Scrap': '#EF4444',
        };

        return {
          id: request.id,
          title: request.subject,
          date: request.scheduledDate || request.createdAt,
          backgroundColor: statusColors[request.status],
          borderColor: statusColors[request.status],
          extendedProps: {
            request,
            equipment: eq,
          },
        };
      });
  }, [requests, equipment]);

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setIsAddDialogOpen(true);
  };

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'new' | 'progress' | 'repaired' | 'scrap'> = {
      'New': 'new',
      'In Progress': 'progress',
      'Repaired': 'repaired',
      'Scrap': 'scrap',
    };
    return variants[status] || 'new';
  };

  return (
    <div className="min-h-screen">
      <Navbar title="Maintenance Calendar" />

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Scheduled Maintenance</h2>
              <p className="text-muted-foreground">
                View and schedule preventive maintenance tasks
              </p>
            </div>
            <Button
              variant="glow"
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Schedule Maintenance
            </Button>
          </div>

          {/* Calendar */}
          <Card>
            <CardContent className="p-4">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek',
                }}
                height="auto"
                eventDisplay="block"
                eventClassNames="cursor-pointer rounded-md text-xs font-medium"
                dayMaxEvents={3}
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Status Legend</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">New</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-success" />
                  <span className="text-sm">Repaired</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="text-sm">Scrap</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Request Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Schedule Preventive Maintenance
            </DialogTitle>
          </DialogHeader>
          <ScheduleMaintenanceForm
            equipment={equipment}
            teams={teams}
            users={users}
            initialDate={selectedDate}
            onSubmit={(data) => {
              addRequest(data);
              setIsAddDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Maintenance Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.request.subject}</h3>
                {selectedEvent.request.description && (
                  <p className="text-muted-foreground mt-1">
                    {selectedEvent.request.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Badge variant={getStatusBadge(selectedEvent.request.status)}>
                  {selectedEvent.request.status}
                </Badge>
                <Badge variant="outline">{selectedEvent.request.type}</Badge>
                <Badge
                  variant={
                    selectedEvent.request.priority === 'high'
                      ? 'high'
                      : selectedEvent.request.priority === 'medium'
                      ? 'medium'
                      : 'low'
                  }
                >
                  {selectedEvent.request.priority} priority
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Equipment</p>
                  <p className="font-medium">
                    {selectedEvent.equipment?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <p className="font-medium">
                    {selectedEvent.request.scheduledDate
                      ? new Date(selectedEvent.request.scheduledDate).toLocaleDateString()
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ScheduleMaintenanceFormProps {
  equipment: any[];
  teams: any[];
  users: any[];
  initialDate: string;
  onSubmit: (data: any) => void;
}

function ScheduleMaintenanceForm({
  equipment,
  teams,
  users,
  initialDate,
  onSubmit,
}: ScheduleMaintenanceFormProps) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipmentId: '',
    teamId: '',
    technicianId: '',
    scheduledDate: initialDate,
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

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
    if (formData.subject && formData.equipmentId && formData.teamId && formData.scheduledDate) {
      onSubmit({
        ...formData,
        type: 'Preventive',
        status: 'New',
      });
    }
  };

  const activeEquipment = equipment.filter((e) => !e.isScrapped);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Subject *</Label>
        <Input
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="e.g., Monthly Calibration"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Maintenance details..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Equipment *</Label>
          <Select value={formData.equipmentId} onValueChange={handleEquipmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {activeEquipment.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>
                  {eq.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Scheduled Date *</Label>
          <Input
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Team *</Label>
          <Select
            value={formData.teamId}
            onValueChange={(v) => setFormData({ ...formData, teamId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
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
          <Label>Technician</Label>
          <Select
            value={formData.technicianId}
            onValueChange={(v) => setFormData({ ...formData, technicianId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
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

      <Button type="submit" className="w-full" variant="glow">
        Schedule Maintenance
      </Button>
    </form>
  );
}
