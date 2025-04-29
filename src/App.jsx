
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import KashariFarmLayout from "./layouts/KashariFarmLayout";
import KashariDairyLayout from "./layouts/KashariDairyLayout";
import Dashboard from "./components/dashboard/Dashboard";
import DairyOverview from "./components/inventory/kashari/modules/dairy/DairyOverview";
import DairyProduction from "./components/inventory/kashari/modules/dairy/DairyProduction";
import DairyReports from "./components/inventory/kashari/modules/dairy/DairyReports";
import DairyEquipment from "./components/inventory/kashari/modules/dairy/DairyEquipment";
import QualityControl from "./components/inventory/kashari/modules/dairy/QualityControl";
import HealthRecordsView from "./components/inventory/kashari/modules/dairy/sections/HealthRecordsView";
import GrowthMetricsView from "./components/inventory/kashari/modules/dairy/sections/GrowthMetricsView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        
        {/* Kashari Farm Routes */}
        <Route path="manage-inventory/kashari-farm" element={<KashariFarmLayout />}>
          <Route path="dairy" element={<KashariDairyLayout />}>
            <Route index element={<DairyOverview />} />
            <Route path="production" element={<DairyProduction />} />
            <Route path="reports" element={<DairyReports />} />
            <Route path="health" element={<HealthRecordsView />} />
            <Route path="growth-metrics" element={<GrowthMetricsView />} />
            <Route path="quality" element={<QualityControl />} />
            <Route path="equipment" element={<DairyEquipment />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
