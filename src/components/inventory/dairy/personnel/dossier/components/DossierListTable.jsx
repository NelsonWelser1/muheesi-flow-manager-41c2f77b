
import React from 'react';
import StatusBadge from './StatusBadge';
import PerformanceRating from './PerformanceRating';
import DossierActionButtons from './DossierActionButtons';

const DossierListTable = ({ 
  paginatedDossiers, 
  onView, 
  onUpload, 
  onSchedule, 
  onDelete, 
  isDeleting 
}) => {
  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="whitespace-nowrap">
            <th className="font-medium p-3 text-left whitespace-nowrap min-w-32">Employee ID</th>
            <th className="font-medium p-3 text-left hidden md:table-cell whitespace-nowrap min-w-32">Job Title</th>
            <th className="font-medium p-3 text-left hidden md:table-cell whitespace-nowrap min-w-32">Department</th>
            <th className="font-medium p-3 text-left hidden lg:table-cell whitespace-nowrap min-w-24">Status</th>
            <th className="font-medium p-3 text-left hidden lg:table-cell whitespace-nowrap min-w-32">Performance</th>
            <th className="font-medium p-3 text-left hidden lg:table-cell whitespace-nowrap min-w-40">Created At</th>
            <th className="font-medium p-3 text-center whitespace-nowrap min-w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDossiers.map((dossier) => (
            <tr key={dossier.id} className="border-t hover:bg-muted/50 whitespace-nowrap">
              <td className="p-3 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{dossier.employee_id}</td>
              <td className="p-3 hidden md:table-cell whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{dossier.job_title || '-'}</td>
              <td className="p-3 hidden md:table-cell whitespace-nowrap overflow-hidden text-ellipsis max-w-32">{dossier.department || '-'}</td>
              <td className="p-3 hidden lg:table-cell whitespace-nowrap">
                <StatusBadge status={dossier.status} />
              </td>
              <td className="p-3 hidden lg:table-cell whitespace-nowrap">
                <PerformanceRating rating={dossier.performance_rating} />
              </td>
              <td className="p-3 hidden lg:table-cell whitespace-nowrap overflow-hidden text-ellipsis max-w-40">
                {dossier.created_at ? new Date(dossier.created_at).toLocaleDateString() : '-'}
              </td>
              <td className="p-3 whitespace-nowrap">
                <DossierActionButtons
                  dossier={dossier}
                  onView={onView}
                  onUpload={onUpload}
                  onSchedule={onSchedule}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DossierListTable;
