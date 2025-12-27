import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore } from '@/store/appStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ReportsPage() {
  const { requests, equipment, teams } = useAppStore();

  // Requests by Team
  const requestsByTeam = teams.map((team) => {
    const teamRequests = requests.filter((r) => r.teamId === team.id);
    return {
      name: team.name,
      total: teamRequests.length,
      open: teamRequests.filter((r) => r.status === 'New' || r.status === 'In Progress').length,
      completed: teamRequests.filter((r) => r.status === 'Repaired').length,
    };
  });

  // Requests by Status
  const requestsByStatus = [
    { name: 'New', value: requests.filter((r) => r.status === 'New').length, color: '#3B82F6' },
    { name: 'In Progress', value: requests.filter((r) => r.status === 'In Progress').length, color: '#F59E0B' },
    { name: 'Repaired', value: requests.filter((r) => r.status === 'Repaired').length, color: '#10B981' },
    { name: 'Scrap', value: requests.filter((r) => r.status === 'Scrap').length, color: '#EF4444' },
  ];

  // Requests by Equipment Category
  const categories = [...new Set(equipment.map((e) => e.category))];
  const requestsByCategory = categories.map((category) => {
    const categoryEquipment = equipment.filter((e) => e.category === category);
    const categoryRequests = requests.filter((r) =>
      categoryEquipment.some((e) => e.id === r.equipmentId)
    );
    return {
      name: category,
      value: categoryRequests.length,
    };
  });

  // Request Types
  const requestsByType = [
    { name: 'Corrective', value: requests.filter((r) => r.type === 'Corrective').length, color: '#EF4444' },
    { name: 'Preventive', value: requests.filter((r) => r.type === 'Preventive').length, color: '#3B82F6' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar title="Reports & Analytics" />

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Maintenance Analytics</h2>
            <p className="text-muted-foreground">
              Insights and metrics for your maintenance operations
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Requests by Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Requests by Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={requestsByTeam}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="open" fill="#F59E0B" name="Open" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Requests by Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Requests by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={requestsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {requestsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Requests by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Requests by Equipment Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={requestsByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" name="Requests" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Request Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Corrective vs Preventive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={requestsByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {requestsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <div className="text-3xl font-bold">{requests.length}</div>
                  <div className="text-sm text-muted-foreground">Total Requests</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <div className="text-3xl font-bold">{equipment.length}</div>
                  <div className="text-sm text-muted-foreground">Total Equipment</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <div className="text-3xl font-bold">{teams.length}</div>
                  <div className="text-sm text-muted-foreground">Active Teams</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <div className="text-3xl font-bold text-success">
                    {requests.length > 0
                      ? Math.round(
                          (requests.filter((r) => r.status === 'Repaired').length / requests.length) * 100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
