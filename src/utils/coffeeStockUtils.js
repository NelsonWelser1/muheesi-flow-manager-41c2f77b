
/* 
 * This file re-exports all coffee stock utilities from their respective modules
 * for backward compatibility with existing imports.
 */

// Re-export everything from the new utility files
export { fetchCoffeeStock, updateCoffeeStockStatus } from './coffee/coffeeStockCore';
export { calculateTotalInventoryValue, getCoffeeInventorySummary } from './coffee/coffeeAnalytics';
export { exportToCSV, exportToExcel, exportToPDF } from './coffee/coffeeExport';
