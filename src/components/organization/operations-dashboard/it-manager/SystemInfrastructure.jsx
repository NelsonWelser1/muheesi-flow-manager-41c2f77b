
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, HardDrive, Cpu, MemoryStick } from 'lucide-react';

const SystemInfrastructure = () => {
  const servers = [
    {
      name: "Production Server 01",
      status: "running",
      cpu: "78%",
      memory: "84%",
      disk: "67%",
      uptime: "45 days"
    },
    {
      name: "Database Server",
      status: "running",
      cpu: "45%",
      memory: "72%",
      disk: "89%",
      uptime: "32 days"
    },
    {
      name: "Backup Server",
      status: "maintenance",
      cpu: "12%",
      memory: "28%",
      disk: "45%",
      uptime: "2 hours"
    },
    {
      name: "Web Server 02",
      status: "running",
      cpu: "62%",
      memory: "56%",
      disk: "34%",
      uptime: "28 days"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUsageColor = (percentage) => {
    const num = parseInt(percentage);
    if (num >= 90) return 'text-red-600';
    if (num >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Server className="h-5 w-5" />
        <h3 className="text-xl font-semibold">System Infrastructure</h3>
      </div>

      <div className="grid gap-4">
        {servers.map((server, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{server.name}</CardTitle>
                <Badge className={getStatusColor(server.status)}>
                  {server.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className={`font-medium ${getUsageColor(server.cpu)}`}>
                      {server.cpu}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Memory</p>
                    <p className={`font-medium ${getUsageColor(server.memory)}`}>
                      {server.memory}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Disk</p>
                    <p className={`font-medium ${getUsageColor(server.disk)}`}>
                      {server.disk}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="font-medium">{server.uptime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{server.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Servers</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Virtual Machines</span>
                <span className="font-medium">34</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Capacity</span>
                <span className="font-medium">45TB</span>
              </div>
              <div className="flex justify-between">
                <span>Network Devices</span>
                <span className="font-medium">28</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average CPU</span>
                <span className="font-medium text-yellow-600">61%</span>
              </div>
              <div className="flex justify-between">
                <span>Average Memory</span>
                <span className="font-medium text-yellow-600">68%</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Used</span>
                <span className="font-medium text-green-600">58%</span>
              </div>
              <div className="flex justify-between">
                <span>Network Load</span>
                <span className="font-medium text-green-600">42%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Healthy Systems</span>
                <span className="font-medium text-green-600">89%</span>
              </div>
              <div className="flex justify-between">
                <span>Warning States</span>
                <span className="font-medium text-yellow-600">8%</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Issues</span>
                <span className="font-medium text-red-600">3%</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance Mode</span>
                <span className="font-medium text-blue-600">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemInfrastructure;
