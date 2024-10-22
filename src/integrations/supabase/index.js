// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
  useGrandBernaDairy,
  useGrandBernaDairies,
  useAddGrandBernaDairy,
  useUpdateGrandBernaDairy,
  useDeleteGrandBernaDairy
} from './hooks/useGrandBernaDairies.js';
// Import hooks for KAJON Coffee Limited and Kyalima Farmers Limited when they are created
// import {
//   useKAJONCoffeeLimited,
//   useKAJONCoffeeLimiteds,
//   useAddKAJONCoffeeLimited,
//   useUpdateKAJONCoffeeLimited,
//   useDeleteKAJONCoffeeLimited
// } from './hooks/useKAJONCoffeeLimited.js';
// import {
//   useKyalimaFarmersLimited,
//   useKyalimaFarmersLimiteds,
//   useAddKyalimaFarmersLimited,
//   useUpdateKyalimaFarmersLimited,
//   useDeleteKyalimaFarmersLimited
// } from './hooks/useKyalimaFarmersLimited.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useGrandBernaDairy,
  useGrandBernaDairies,
  useAddGrandBernaDairy,
  useUpdateGrandBernaDairy,
  useDeleteGrandBernaDairy,
  // Export hooks for KAJON Coffee Limited and Kyalima Farmers Limited when they are created
  // useKAJONCoffeeLimited,
  // useKAJONCoffeeLimiteds,
  // useAddKAJONCoffeeLimited,
  // useUpdateKAJONCoffeeLimited,
  // useDeleteKAJONCoffeeLimited,
  // useKyalimaFarmersLimited,
  // useKyalimaFarmersLimiteds,
  // useAddKyalimaFarmersLimited,
  // useUpdateKyalimaFarmersLimited,
  // useDeleteKyalimaFarmersLimited
};