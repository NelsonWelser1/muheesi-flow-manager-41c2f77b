
export type DairySection = 'herdManagement' | 'milkProduction' | 'analytics';
export type DairyTab = 'inventory' | 'health' | 'growth' | 'quality' | 'production' | 'financial' | 'trends';

export interface DairyContextType {
  activeSection: DairySection;
  setActiveSection: (section: DairySection) => void;
  activeTab: DairyTab;
  setActiveTab: (tab: DairyTab) => void;
}
