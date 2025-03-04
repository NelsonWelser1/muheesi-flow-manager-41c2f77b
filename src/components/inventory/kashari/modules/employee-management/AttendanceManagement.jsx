
import React from 'react';
import { useAttendanceData } from './hooks/useAttendanceData';
import ClockInOutCard from './components/ClockInOutCard';
import AttendanceSummaryCard from './components/AttendanceSummaryCard';
import AttendanceRecordsTable from './components/AttendanceRecordsTable';

const AttendanceManagement = () => {
  const {
    employees,
    attendanceRecords,
    isLoadingAttendance,
    clockInfo,
    setClockInfo,
    handleClockInOut
  } = useAttendanceData();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ClockInOutCard 
          employees={employees}
          clockInfo={clockInfo}
          setClockInfo={setClockInfo}
          handleClockInOut={handleClockInOut}
        />
        
        <AttendanceSummaryCard 
          attendanceRecords={attendanceRecords} 
        />
      </div>

      <AttendanceRecordsTable 
        attendanceRecords={attendanceRecords}
        isLoadingAttendance={isLoadingAttendance}
      />
    </div>
  );
};

export default AttendanceManagement;
