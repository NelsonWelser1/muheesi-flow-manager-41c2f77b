
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
import { useDeliveryNotes } from './hooks/sales/useDeliveryNotes';
import { useCustomerInvoices } from './hooks/sales/useCustomerInvoices';

// Import individual invoice hooks
import { useFetchInvoices } from './hooks/sales/invoices/useFetchInvoices';
import { useCreateInvoice } from './hooks/sales/invoices/useCreateInvoice';
import { useUpdateInvoice } from './hooks/sales/invoices/useUpdateInvoice';
import { useDeleteInvoice } from './hooks/sales/invoices/useDeleteInvoice';

// Import accounting hooks
import { useBillsExpenses } from './hooks/accounting/useBillsExpenses';
import { usePaymentsReceipts } from './hooks/accounting/payments/usePaymentsReceipts';

// Import association hooks
import { useAssociationMembers } from '@/hooks/useAssociationMembers';
import { useAssociationForm } from '@/hooks/useAssociationForm';
import { useCertifications } from './hooks/associations/useCertifications';

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
    // Delivery Notes
    useDeliveryNotes,
    // Customer Invoices - Main combined hook
    useCustomerInvoices,
    // Individual Invoice hooks
    useFetchInvoices,
    useCreateInvoice,
    useUpdateInvoice,
    useDeleteInvoice,
    // Accounting hooks
    useBillsExpenses,
    usePaymentsReceipts,
    // Association hooks
    useAssociationForm,
    useAssociationMembers,
    useCertifications,
};
