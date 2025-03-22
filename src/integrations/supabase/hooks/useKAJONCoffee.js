
// Re-export all coffee hooks from their respective files
import { fromSupabase, refreshCoffeeInventorySchema } from '../utils/supabaseUtils';
import { 
    useKAJONCoffee as useKAJONCoffeeQuery,
    useKAJONCoffees,
    useCoffeeInventory,
    useCoffeeSalesRecords,
    useGetInventoryByLocation
} from './coffee/useCoffeeQueries';

import {
    useAddKAJONCoffee,
    useUpdateKAJONCoffee,
    useDeleteKAJONCoffee
} from './coffee/useCoffeeMutations';

// For backward compatibility, we'll re-export everything
export {
    fromSupabase,
    useKAJONCoffeeQuery as useKAJONCoffee,
    useKAJONCoffees,
    useCoffeeInventory,
    useCoffeeSalesRecords,
    useAddKAJONCoffee,
    useUpdateKAJONCoffee,
    useDeleteKAJONCoffee,
    useGetInventoryByLocation
};

// Ensure the schema is refreshed when this module is loaded
refreshCoffeeInventorySchema();
