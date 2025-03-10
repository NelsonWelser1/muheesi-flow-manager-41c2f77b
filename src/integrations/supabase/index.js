
import { supabase } from './supabase';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth';

// Import all hooks
import {
    useGrandBernaDairy,
    useFactoryOperations,
    useColdRoomManagement,
    useDairySalesRecords,
} from './hooks/useGrandBernaDairies';

import {
    useFreshecoFarming,
    useFreshecoFarmings,
    useAddFreshecoFarming,
    useUpdateFreshecoFarming,
    useDeleteFreshecoFarming,
} from './hooks/useFreshecoFarming';

import {
    useKAJONCoffee,
    useKAJONCoffees,
    useAddKAJONCoffee,
    useUpdateKAJONCoffee,
    useDeleteKAJONCoffee,
} from './hooks/useKAJONCoffee';

import {
    useDashboard,
    useDashboards,
    useAddDashboard,
    useUpdateDashboard,
    useDeleteDashboard,
} from './hooks/useDashboard';

import { useSalesOrders } from './hooks/useSalesOrders';

// Import individual sales hooks
import { useFetchSalesOrders } from './hooks/sales/useFetchSalesOrders';
import { useCreateSalesOrder } from './hooks/sales/useCreateSalesOrder';
import { useSalesOrderDetails } from './hooks/sales/useSalesOrderDetails';
import { useUpdateSalesOrder } from './hooks/sales/useUpdateSalesOrder';
import { useDeleteSalesOrder } from './hooks/sales/useDeleteSalesOrder';
import { salesOrderUtils } from './hooks/sales/useSalesOrderUtils';

// Export everything individually
export {
    supabase,
    SupabaseAuthProvider,
    useSupabaseAuth,
    SupabaseAuthUI,
    // Grand Berna Dairies
    useGrandBernaDairy,
    useFactoryOperations,
    useColdRoomManagement,
    useDairySalesRecords,
    // Fresheco Farming
    useFreshecoFarming,
    useFreshecoFarmings,
    useAddFreshecoFarming,
    useUpdateFreshecoFarming,
    useDeleteFreshecoFarming,
    // KAJON Coffee
    useKAJONCoffee,
    useKAJONCoffees,
    useAddKAJONCoffee,
    useUpdateKAJONCoffee,
    useDeleteKAJONCoffee,
    // Dashboard
    useDashboard,
    useDashboards,
    useAddDashboard,
    useUpdateDashboard,
    useDeleteDashboard,
    // Sales Orders - Main combined hook
    useSalesOrders,
    // Individual Sales Order hooks
    useFetchSalesOrders,
    useCreateSalesOrder,
    useSalesOrderDetails,
    useUpdateSalesOrder,
    useDeleteSalesOrder,
    salesOrderUtils,
};
