
import { useEmployeeDossiers } from './useEmployeeDossiers';

// This is a backward compatibility wrapper around our new hook
export const useDossierData = (searchQuery = '') => {
  return useEmployeeDossiers(searchQuery);
};
