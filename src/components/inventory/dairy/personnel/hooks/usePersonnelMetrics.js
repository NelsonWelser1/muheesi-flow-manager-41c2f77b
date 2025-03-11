
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

export const usePersonnelMetrics = () => {
  // Fetch employee count
  const { data: employeeCount = 0 } = useQuery({
    queryKey: ['employeeCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('personnel_employee_records')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Fetch average performance
  const { data: avgPerformance = 0 } = useQuery({
    queryKey: ['avgPerformance'],
    queryFn: async () => {
      const { data } = await supabase
        .from('personnel_employee_records')
        .select('performance_rating');
      if (!data?.length) return 0;
      const avg = data.reduce((acc, curr) => acc + curr.performance_rating, 0) / data.length;
      return Number(avg.toFixed(1));
    }
  });

  // Fetch active recruitments
  const { data: activeRecruitments = 0 } = useQuery({
    queryKey: ['activeRecruitments'],
    queryFn: async () => {
      const { count } = await supabase
        .from('personnel_recruitment_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      return count || 0;
    }
  });

  // Fetch on shift count
  const { data: onShiftCount = 0 } = useQuery({
    queryKey: ['onShiftCount'],
    queryFn: async () => {
      const now = new Date();
      const { count } = await supabase
        .from('personnel_employee_records')
        .select('*', { count: 'exact', head: true })
        .lte('shift_start', now.toISOString())
        .gte('shift_end', now.toISOString());
      return count || 0;
    }
  });

  // Fetch hours worked
  const { data: hoursWorked = 0 } = useQuery({
    queryKey: ['hoursWorked'],
    queryFn: async () => {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const { data } = await supabase
        .from('personnel_employee_records')
        .select('shift_start, shift_end')
        .gte('shift_start', startOfWeek.toISOString());
      
      if (!data?.length) return 0;
      const hours = data.reduce((acc, curr) => {
        const start = new Date(curr.shift_start);
        const end = new Date(curr.shift_end);
        return acc + (end - start) / (1000 * 60 * 60);
      }, 0);
      return Math.round(hours);
    }
  });

  // Fetch pending reviews
  const { data: pendingReviews = 0 } = useQuery({
    queryKey: ['pendingReviews'],
    queryFn: async () => {
      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
      const { count } = await supabase
        .from('personnel_employee_records')
        .select('*', { count: 'exact', head: true })
        .lte('review_date_time', endOfWeek.toISOString());
      return count || 0;
    }
  });

  // Fetch current shift
  const { data: currentShift = [] } = useQuery({
    queryKey: ['currentShift'],
    queryFn: async () => {
      const now = new Date();
      const { data } = await supabase
        .from('personnel_employee_records')
        .select('employee_id, job_title, shift_start, shift_end')
        .lte('shift_start', now.toISOString())
        .gte('shift_end', now.toISOString())
        .order('shift_start', { ascending: true });
      return data || [];
    }
  });

  return {
    employeeCount,
    avgPerformance,
    activeRecruitments,
    onShiftCount,
    hoursWorked,
    pendingReviews,
    currentShift
  };
};
