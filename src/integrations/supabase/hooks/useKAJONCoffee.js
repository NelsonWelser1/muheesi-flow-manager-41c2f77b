
// This file now serves as a placeholder for backward compatibility
// All coffee inventory functionality has been removed

console.warn('Coffee inventory functionality has been removed');

// Export empty functions for backward compatibility
export const fromSupabase = async () => {
  console.warn('Coffee inventory functionality has been removed');
  return [];
};

export const useKAJONCoffee = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { data: null, isLoading: false, error: null };
};

export const useKAJONCoffees = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { data: [], isLoading: false, error: null };
};

export const useCoffeeInventory = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { data: [], isLoading: false, error: null };
};

export const useCoffeeSalesRecords = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { data: [], isLoading: false, error: null };
};

export const useGetInventoryByLocation = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { data: [], isLoading: false, error: null };
};

export const useAddKAJONCoffee = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { mutateAsync: async () => {}, isLoading: false, error: null };
};

export const useUpdateKAJONCoffee = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { mutateAsync: async () => {}, isLoading: false, error: null };
};

export const useDeleteKAJONCoffee = () => {
  console.warn('Coffee inventory functionality has been removed');
  return { mutateAsync: async () => {}, isLoading: false, error: null };
};

// No schema refresh needed anymore
export const refreshCoffeeInventorySchema = () => {
  console.warn('Coffee inventory functionality has been removed');
};
