import React from 'react';
import { UserCrown, Settings, Shield, AlertOctagon, UserGear, Warehouse, Users, Tractor } from 'lucide-react';

const OrganizationalChart = () => {
  return (
    <div className="space-y-8">
      {/* Strategic/Executive Management */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center text-blue-800">
          <UserCrown className="mr-2" /> Strategic/Executive Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center p-3 bg-white rounded-lg shadow">
            <UserCrown className="h-6 w-6 mr-2 text-blue-600" />
            <span>CEO - H.E Maj. Gen. Geoffrey Muheesi</span>
          </div>
          <div className="flex items-center p-3 bg-white rounded-lg shadow">
            <Settings className="h-6 w-6 mr-2 text-blue-600" />
            <span>System Administrator</span>
          </div>
          <div className="flex items-center p-3 bg-white rounded-lg shadow">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            <span>Compliance & Quality Control Officer</span>
          </div>
          <div className="flex items-center p-3 bg-white rounded-lg shadow">
            <AlertOctagon className="h-6 w-6 mr-2 text-blue-600" />
            <span>Risk Manager</span>
          </div>
        </div>
      </div>

      {/* Tactical/Departmental Management */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center text-green-800">
          <UserGear className="mr-2" /> Tactical/Departmental Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Human Resource Manager',
            'Operations Manager',
            'Procurement Manager',
            'Factory Manager',
            'Finance Manager',
            'Sales & Export Manager',
            'Logistics Manager',
            'Inventory Manager',
            'Marketing Manager',
            'IT Manager',
            'Product Development Manager'
          ].map((role, index) => (
            <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow">
              <UserGear className="h-6 w-6 mr-2 text-green-600" />
              <span>{role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Operational/Field Management */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center text-purple-800">
          <Users className="mr-2" /> Operational/Field Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-white rounded-lg shadow">
            <Warehouse className="h-6 w-6 mr-2 text-purple-600" />
            <span>Warehouse Supervisor</span>
          </div>
          <div className="flex items-center p-3 bg-white rounded-lg shadow">
            <Users className="h-6 w-6 mr-2 text-purple-600" />
            <span>Association Manager</span>
          </div>
          <div className="flex items-center p-3 bg-white rounded-lg shadow">
            <Tractor className="h-6 w-6 mr-2 text-purple-600" />
            <span>Farm Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalChart;