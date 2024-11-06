import { supabase } from './supabase';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth';

// Import all hooks
import {
    useKyalimaFarmer,
    useKyalimaFarmers,
    useAddKyalimaFarmer,
    useUpdateKyalimaFarmer,
    useDeleteKyalimaFarmer,
} from './hooks/useKyalimaFarmers';

import {
    useFreshecoFarming,
    useFreshecoFarmings,
    useAddFreshecoFarming,
    useUpdateFreshecoFarming,
    useDeleteFreshecoFarming,
} from './hooks/useFreshecoFarming';

import {
    useGrandBernaDairy,
    useGrandBernaDairies,
    useAddGrandBernaDairy,
    useUpdateGrandBernaDairy,
    useDeleteGrandBernaDairy,
} from './hooks/useGrandBernaDairies';

import {
    useDashboard,
    useDashboards,
    useAddDashboard,
    useUpdateDashboard,
    useDeleteDashboard,
} from './hooks/useDashboard';

import {
    useKAJONCoffee,
    useKAJONCoffees,
    useAddKAJONCoffee,
    useUpdateKAJONCoffee,
    useDeleteKAJONCoffee,
} from './hooks/useKAJONCoffee';

// Export everything individually
export {
    supabase,
    SupabaseAuthProvider,
    useSupabaseAuth,
    SupabaseAuthUI,
    // Kyalima Farmers
    useKyalimaFarmer,
    useKyalimaFarmers,
    useAddKyalimaFarmer,
    useUpdateKyalimaFarmer,
    useDeleteKyalimaFarmer,
    // Fresheco Farming
    useFreshecoFarming,
    useFreshecoFarmings,
    useAddFreshecoFarming,
    useUpdateFreshecoFarming,
    useDeleteFreshecoFarming,
    // Grand Berna Dairies
    useGrandBernaDairy,
    useGrandBernaDairies,
    useAddGrandBernaDairy,
    useUpdateGrandBernaDairy,
    useDeleteGrandBernaDairy,
    // Dashboard
    useDashboard,
    useDashboards,
    useAddDashboard,
    useUpdateDashboard,
    useDeleteDashboard,
    // KAJON Coffee
    useKAJONCoffee,
    useKAJONCoffees,
    useAddKAJONCoffee,
    useUpdateKAJONCoffee,
    useDeleteKAJONCoffee,
};