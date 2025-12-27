import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Settings,
  Shield,
  Users,
  Wrench,
  AlertTriangle,
  Edit,
  Trash,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore } from '@/store/appStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function EquipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { equipment, teams, users, requests } = useAppStore();
  
  const eq = equipment.find((e) => e.id === id);
  const defaultTab = searchParams.get('tab') || 'details';

  if (!eq) {
    return (
      <div className="min-h-screen">
        <Navbar title="Equipment Not Found" />
        <div className="p-6 text-center">
          <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Equipment not found</h2>
          <Button onClick={() => navigate('/equipment')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Equipment
          </Button>
        </div>
      </div>
    );
  }

  const team = teams.find((t) => t.id === eq.maintenanceTeamId);
  const defaultTechnician = users.find((u) => u.id === eq.defaultTechnicianId);
  const equipmentRequests = requests.filter((r) => r.equipmentId === eq.id);
  const openRequests = equipmentRequests.filter(
    (r) => r.status !== 'Repaired' && r.status !== 'Scrap'
  );

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
      <Navbar title="Equipment Details" />

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Back Button & Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/equipment')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Settings className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{eq.name}</h1>
                  <p className="text-muted-foreground font-mono">{eq.serialNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {eq.isScrapped && (
                <Badge variant="scrap" className="text-sm px-3 py-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Scrapped
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={defaultTab} className="space-y-4">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="maintenance" className="gap-2">
                Maintenance
                {openRequests.length > 0 && (
                  <Badge variant="warning" className="h-5 px-1.5">
                    {openRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{eq.department || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{eq.category || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location
                      </p>
                      <p className="font-medium">{eq.location || 'N/A'}</p>
                    </div>
                    {eq.assignedTo && (
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="font-medium">
                          {users.find((u) => u.id === eq.assignedTo)?.name || 'N/A'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Dates & Warranty */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Dates & Warranty
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Date</p>
                      <p className="font-medium">
                        {eq.purchaseDate
                          ? new Date(eq.purchaseDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Warranty Expiry
                      </p>
                      {eq.warrantyEnd ? (
                        <p
                          className={cn(
                            'font-medium',
                            new Date(eq.warrantyEnd) < new Date() && 'text-destructive'
                          )}
                        >
                          {new Date(eq.warrantyEnd).toLocaleDateString()}
                          {new Date(eq.warrantyEnd) < new Date() && ' (Expired)'}
                        </p>
                      ) : (
                        <p className="font-medium text-muted-foreground">No warranty</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Maintenance Team */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Maintenance Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-12 w-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: (team?.color || '#3B82F6') + '20' }}
                        >
                          <Wrench
                            className="h-6 w-6"
                            style={{ color: team?.color || '#3B82F6' }}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Maintenance Team</p>
                          <p className="font-semibold">{team?.name || 'Not assigned'}</p>
                          {team?.description && (
                            <p className="text-xs text-muted-foreground">{team.description}</p>
                          )}
                        </div>
                      </div>

                      {defaultTechnician && (
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center font-semibold text-primary">
                            {defaultTechnician.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Default Technician</p>
                            <p className="font-semibold">{defaultTechnician.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {defaultTechnician.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Maintenance Requests
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/requests?equipment=${eq.id}`)}
                  >
                    Create Request
                  </Button>
                </CardHeader>
                <CardContent>
                  {equipmentRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No maintenance requests for this equipment</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {equipmentRequests.map((request) => {
                        const technician = users.find((u) => u.id === request.technicianId);
                        return (
                          <div
                            key={request.id}
                            className={cn(
                              'flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30',
                              request.isOverdue && 'border-l-4 border-l-destructive'
                            )}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{request.subject}</p>
                                {request.isOverdue && (
                                  <Badge variant="destructive" className="text-xs">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{request.type}</span>
                                {technician && <span>• {technician.name}</span>}
                                <span>• {new Date(request.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge variant={getStatusBadge(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Activity history will be available soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
