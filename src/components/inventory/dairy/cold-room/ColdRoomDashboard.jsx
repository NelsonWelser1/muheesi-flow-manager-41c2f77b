
import React from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import ColdRoomHeader from './components/ColdRoomHeader';
import ColdRoomTabs from './components/ColdRoomTabs';

const ColdRoomDashboard = () => {
  const { session } = useSupabaseAuth();
  const user = session?.user;

  return (
    <div className="space-y-4 p-4">
      <ColdRoomHeader />
      <ColdRoomTabs userId={user?.id} username={user?.email} />
    </div>
  );
};

export default ColdRoomDashboard;

