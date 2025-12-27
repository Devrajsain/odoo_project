import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Wrench, MoreHorizontal, User, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore } from '@/store/appStore';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TEAM_COLORS = [
  '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#EC4899', '#06B6D4'
];

export default function TeamsPage() {
  const { teams, users, requests, addTeam, deleteTeam } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar title="Maintenance Teams" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Teams</h2>
            <p className="text-muted-foreground">
              Manage your maintenance teams and technicians
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="glow">
                <Plus className="h-4 w-4" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <AddTeamForm
                onSubmit={(data) => {
                  addTeam(data);
                  setIsAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Teams Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {teams.map((team) => {
            const teamMembers = users.filter((u) => team.members.includes(u.id));
            const teamRequests = requests.filter((r) => r.teamId === team.id);
            const openRequests = teamRequests.filter(
              (r) => r.status !== 'Repaired' && r.status !== 'Scrap'
            );
            const completedRequests = teamRequests.filter((r) => r.status === 'Repaired');

            return (
              <motion.div key={team.id} variants={itemVariants}>
                <Card className="card-hover h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: team.color + '20' }}
                        >
                          <Wrench className="h-6 w-6" style={{ color: team.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          {team.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {team.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="iconSm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Team
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteTeam(team.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <div className="text-xl font-bold">{teamMembers.length}</div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      <div className="rounded-lg bg-accent/10 p-2">
                        <div className="text-xl font-bold text-accent">{openRequests.length}</div>
                        <div className="text-xs text-muted-foreground">Open</div>
                      </div>
                      <div className="rounded-lg bg-success/10 p-2">
                        <div className="text-xl font-bold text-success">{completedRequests.length}</div>
                        <div className="text-xs text-muted-foreground">Done</div>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Team Members
                      </p>
                      {teamMembers.length > 0 ? (
                        <div className="space-y-2">
                          {teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                  {member.name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{member.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {member.email}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs capitalize">
                                {member.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          No members assigned
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first maintenance team to get started
            </p>
            <Button variant="glow" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Team
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface AddTeamFormProps {
  onSubmit: (data: { name: string; description?: string; members: string[]; color: string }) => void;
}

function AddTeamForm({ onSubmit }: AddTeamFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: TEAM_COLORS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      onSubmit({
        ...formData,
        members: [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Team Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Mechanics"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What does this team do?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Team Color</Label>
        <div className="flex gap-2 flex-wrap">
          {TEAM_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`h-8 w-8 rounded-lg transition-all ${
                formData.color === color
                  ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" variant="glow">
        Create Team
      </Button>
    </form>
  );
}
