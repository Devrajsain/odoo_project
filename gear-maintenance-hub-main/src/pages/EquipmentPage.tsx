import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Settings,
  Filter,
  MoreHorizontal,
  Wrench,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore, Equipment } from '@/store/appStore';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function EquipmentPage() {
  const { equipment, teams, users, requests, addEquipment, deleteEquipment } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const departments = [...new Set(equipment.map((e) => e.department))];
  const categories = [...new Set(equipment.map((e) => e.category))];

  const filteredEquipment = equipment.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      filterDepartment === 'all' || e.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getEquipmentRequestCount = (equipmentId: string) => {
    return requests.filter(
      (r) => r.equipmentId === equipmentId && r.status !== 'Repaired' && r.status !== 'Scrap'
    ).length;
  };

  return (
    <div className="min-h-screen">
      <Navbar title="Equipment" />

      <div className="p-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment by name or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-40 bg-secondary/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="glow">
                  <Plus className="h-4 w-4" />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                <AddEquipmentForm
                  teams={teams}
                  users={users}
                  departments={departments}
                  categories={categories}
                  onSubmit={(data) => {
                    addEquipment(data);
                    setIsAddDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Equipment Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredEquipment.map((eq) => {
            const team = teams.find((t) => t.id === eq.maintenanceTeamId);
            const requestCount = getEquipmentRequestCount(eq.id);

            return (
              <motion.div key={eq.id} variants={itemVariants}>
                <Card
                  className={cn(
                    'card-hover cursor-pointer',
                    eq.isScrapped && 'opacity-60 border-destructive/30'
                  )}
                  onClick={() => navigate(`/equipment/${eq.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground leading-tight">
                            {eq.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono">
                            {eq.serialNumber}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="iconSm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/equipment/${eq.id}`);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEquipment(eq.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{eq.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Purchased: {new Date(eq.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <div className="flex gap-2">
                        <Badge variant="outline">{eq.department}</Badge>
                        {eq.isScrapped && (
                          <Badge variant="scrap">Scrapped</Badge>
                        )}
                      </div>

                      {/* Maintenance Smart Button */}
                      <Button
                        variant={requestCount > 0 ? 'warning' : 'outline'}
                        size="sm"
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/equipment/${eq.id}?tab=maintenance`);
                        }}
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        {requestCount > 0 && (
                          <span className="font-bold">{requestCount}</span>
                        )}
                        {requestCount === 0 && <span>Maintenance</span>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No equipment found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface AddEquipmentFormProps {
  teams: any[];
  users: any[];
  departments: string[];
  categories: string[];
  onSubmit: (data: Omit<Equipment, 'id' | 'isScrapped'>) => void;
}

function AddEquipmentForm({
  teams,
  users,
  departments,
  categories,
  onSubmit,
}: AddEquipmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    department: '',
    location: '',
    purchaseDate: '',
    warrantyEnd: '',
    maintenanceTeamId: '',
    defaultTechnicianId: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.serialNumber && formData.maintenanceTeamId) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="CNC Machine Pro"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serial">Serial Number *</Label>
          <Input
            id="serial"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="CNC-2024-001"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Production"
            list="departments"
          />
          <datalist id="departments">
            {departments.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Manufacturing"
            list="categories"
          />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Building A, Floor 2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyEnd">Warranty End</Label>
          <Input
            id="warrantyEnd"
            type="date"
            value={formData.warrantyEnd}
            onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Maintenance Team *</Label>
          <Select
            value={formData.maintenanceTeamId}
            onValueChange={(v) => setFormData({ ...formData, maintenanceTeamId: v })}
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
          <Label>Default Technician</Label>
          <Select
            value={formData.defaultTechnicianId}
            onValueChange={(v) => setFormData({ ...formData, defaultTechnicianId: v })}
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

      <Button type="submit" className="w-full" variant="glow">
        Add Equipment
      </Button>
    </form>
  );
}
