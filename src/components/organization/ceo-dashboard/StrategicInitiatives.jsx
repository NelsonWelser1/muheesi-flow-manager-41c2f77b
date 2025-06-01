
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Calendar, Users, DollarSign, TrendingUp, Plus } from 'lucide-react';

const StrategicInitiatives = ({ selectedCompany }) => {
  const strategicData = {
    initiatives: [
      {
        id: 1,
        title: 'Digital Transformation Program',
        description: 'Implement ERP system across all companies',
        status: 'in-progress',
        progress: 65,
        budget: 500000,
        spent: 325000,
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        owner: 'CTO',
        companies: ['all'],
        milestones: [
          { name: 'Requirements Analysis', status: 'completed' },
          { name: 'System Selection', status: 'completed' },
          { name: 'Implementation Phase 1', status: 'in-progress' },
          { name: 'Training & Rollout', status: 'pending' }
        ]
      },
      {
        id: 2,
        title: 'Coffee Export Market Expansion',
        description: 'Enter European and Asian markets',
        status: 'on-track',
        progress: 45,
        budget: 750000,
        spent: 280000,
        startDate: '2024-03-01',
        endDate: '2025-06-30',
        owner: 'Export Manager',
        companies: ['KAJON Coffee Limited'],
        milestones: [
          { name: 'Market Research', status: 'completed' },
          { name: 'Certification & Compliance', status: 'in-progress' },
          { name: 'Partner Identification', status: 'in-progress' },
          { name: 'First Shipments', status: 'pending' }
        ]
      },
      {
        id: 3,
        title: 'Sustainability & Organic Certification',
        description: 'Achieve organic certification for all farming operations',
        status: 'at-risk',
        progress: 30,
        budget: 200000,
        spent: 85000,
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        owner: 'Quality Manager',
        companies: ['Kyalima Farmers Limited', 'Grand Berna Dairies'],
        milestones: [
          { name: 'Gap Analysis', status: 'completed' },
          { name: 'Process Changes', status: 'in-progress' },
          { name: 'Documentation', status: 'pending' },
          { name: 'Certification Audit', status: 'pending' }
        ]
      },
      {
        id: 4,
        title: 'Dairy Production Capacity Expansion',
        description: 'Increase production capacity by 40%',
        status: 'planning',
        progress: 15,
        budget: 1200000,
        spent: 150000,
        startDate: '2024-06-01',
        endDate: '2025-12-31',
        owner: 'Operations Director',
        companies: ['Grand Berna Dairies'],
        milestones: [
          { name: 'Feasibility Study', status: 'in-progress' },
          { name: 'Equipment Procurement', status: 'pending' },
          { name: 'Installation & Testing', status: 'pending' },
          { name: 'Production Ramp-up', status: 'pending' }
        ]
      }
    ],
    goals: [
      {
        category: 'Financial',
        targets: [
          { metric: 'Revenue Growth', target: '25%', current: '18%', status: 'on-track' },
          { metric: 'Profit Margin', target: '20%', current: '18.5%', status: 'on-track' },
          { metric: 'Market Share', target: '30%', current: '23%', status: 'behind' }
        ]
      },
      {
        category: 'Operational',
        targets: [
          { metric: 'Production Efficiency', target: '95%', current: '87%', status: 'behind' },
          { metric: 'Quality Score', target: '98%', current: '96%', status: 'on-track' },
          { metric: 'Customer Satisfaction', target: '4.5/5', current: '4.2/5', status: 'on-track' }
        ]
      },
      {
        category: 'Innovation',
        targets: [
          { metric: 'New Product Lines', target: '3', current: '2', status: 'on-track' },
          { metric: 'R&D Investment', target: '8%', current: '7.3%', status: 'on-track' },
          { metric: 'Digital Adoption', target: '90%', current: '65%', status: 'behind' }
        ]
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'on-track': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      case 'at-risk': return 'bg-orange-500 text-white';
      case 'planning': return 'bg-gray-500 text-white';
      case 'behind': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '⏳';
      default: return '○';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Strategic Initiatives */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Strategic Initiatives</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Initiative
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategicData.initiatives.map((initiative) => (
          <Card key={initiative.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{initiative.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {initiative.description}
                  </p>
                </div>
                <Badge className={getStatusColor(initiative.status)}>
                  {initiative.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{initiative.progress}%</span>
                </div>
                <Progress value={initiative.progress} />
              </div>

              {/* Budget */}
              <div className="flex justify-between text-sm">
                <span>Budget Utilization</span>
                <span>
                  {formatCurrency(initiative.spent)} / {formatCurrency(initiative.budget)}
                </span>
              </div>
              <Progress value={(initiative.spent / initiative.budget) * 100} />

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(initiative.startDate).toLocaleDateString()}
                </div>
                <div>→</div>
                <div>{new Date(initiative.endDate).toLocaleDateString()}</div>
              </div>

              {/* Owner & Companies */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {initiative.owner}
                </div>
                <div className="text-muted-foreground">
                  {initiative.companies.join(', ')}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="text-sm font-medium mb-2">Key Milestones</h4>
                <div className="space-y-1">
                  {initiative.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <span className="mr-2">{getMilestoneIcon(milestone.status)}</span>
                      <span className={milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                        {milestone.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategic Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Strategic Goals & Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategicData.goals.map((category, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-3 flex items-center">
                  {category.category === 'Financial' && <DollarSign className="h-4 w-4 mr-1" />}
                  {category.category === 'Operational' && <Target className="h-4 w-4 mr-1" />}
                  {category.category === 'Innovation' && <TrendingUp className="h-4 w-4 mr-1" />}
                  {category.category}
                </h4>
                <div className="space-y-3">
                  {category.targets.map((target, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{target.metric}</span>
                        <Badge className={getStatusColor(target.status)} variant="outline">
                          {target.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Current: {target.current}</span>
                        <span>Target: {target.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicInitiatives;
