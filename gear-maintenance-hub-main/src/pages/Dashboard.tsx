import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { equipment, requests, teams, users } = useAppStore();

  const stats = {
    totalEquipment: equipment.filter((e) => !e.isScrapped).length,
    openRequests: requests.filter((r) => r.status !== 'Repaired' && r.status !== 'Scrap').length,
    overdueRequests: requests.filter((r) => r.isOverdue).length,
    completedThisMonth: requests.filter((r) => r.status === 'Repaired').length,
  };

  const statusCounts = {
    New: requests.filter((r) => r.status === 'New').length,
    'In Progress': requests.filter((r) => r.status === 'In Progress').length,
    Repaired: requests.filter((r) => r.status === 'Repaired').length,
    Scrap: requests.filter((r) => r.status === 'Scrap').length,
  };

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
      <Navbar title="Dashboard" />

      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome back, <span className="text-primary">GearGuard</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your maintenance operations today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Card className="card-hover border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Equipment
                </CardTitle>
                <Settings className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalEquipment}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active assets in system
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Open Requests
                </CardTitle>
                <Wrench className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.openRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting resolution
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-destructive/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overdue
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  {stats.overdueRequests}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-success/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
                <CheckCircle className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">
                  {stats.completedThisMonth}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Repairs this period
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Request Status Overview */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Request Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <div
                        key={status}
                        className={cn(
                          'rounded-xl p-4 text-center transition-all duration-200 hover:scale-105',
                          status === 'New' && 'bg-primary/10 border border-primary/20',
                          status === 'In Progress' && 'bg-accent/10 border border-accent/20',
                          status === 'Repaired' && 'bg-success/10 border border-success/20',
                          status === 'Scrap' && 'bg-destructive/10 border border-destructive/20'
                        )}
                      >
                        <div className="text-3xl font-bold mb-1">{count}</div>
                        <div className="text-sm text-muted-foreground">{status}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-2 flex-wrap">
                    <Link to="/requests">
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                        View All Requests →
                      </Badge>
                    </Link>
                    <Link to="/calendar">
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                        View Calendar →
                      </Badge>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Requests */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentRequests.map((request) => {
                    const eq = equipment.find((e) => e.id === request.equipmentId);
                    return (
                      <div
                        key={request.id}
                        className={cn(
                          'flex items-center justify-between rounded-lg p-3 bg-secondary/30 border border-border/30',
                          request.isOverdue && 'border-l-4 border-l-destructive'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {request.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {eq?.name || 'Unknown Equipment'}
                          </p>
                        </div>
                        <Badge variant={getStatusBadge(request.status)} className="ml-2 shrink-0">
                          {request.status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Teams Overview */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Teams Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {teams.map((team) => {
                    const teamRequests = requests.filter((r) => r.teamId === team.id);
                    const openCount = teamRequests.filter(
                      (r) => r.status !== 'Repaired' && r.status !== 'Scrap'
                    ).length;
                    const completedCount = teamRequests.filter(
                      (r) => r.status === 'Repaired'
                    ).length;
                    const members = users.filter((u) => team.members.includes(u.id));

                    return (
                      <div
                        key={team.id}
                        className="rounded-xl border border-border/50 p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: team.color + '20' }}
                          >
                            <Wrench className="h-5 w-5" style={{ color: team.color }} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{team.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {members.length} member{members.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="rounded-lg bg-background/50 p-2">
                            <div className="text-lg font-bold text-accent">{openCount}</div>
                            <div className="text-xs text-muted-foreground">Open</div>
                          </div>
                          <div className="rounded-lg bg-background/50 p-2">
                            <div className="text-lg font-bold text-success">{completedCount}</div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
