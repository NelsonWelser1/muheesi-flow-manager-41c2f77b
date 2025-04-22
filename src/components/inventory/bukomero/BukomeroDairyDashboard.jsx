
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./modules/Overview";
import { Production } from "./modules/Production";
import { QualityControl } from "./modules/QualityControl";
import { Distribution } from "./modules/Distribution";
import { Sales } from "./modules/Sales";
import { Financials } from "./modules/Financials";
import LedgerTab from "./LedgerTab";

const TABS = [
  { label: "Ledger", value: "ledger" },
  { label: "Overview", value: "overview" },
  { label: "Production", value: "production" },
  { label: "Quality Control", value: "quality-control" },
  { label: "Distribution", value: "distribution" },
  { label: "Sales", value: "sales" },
  { label: "Financials", value: "financials" },
];

const BukomeroDairyDashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case "ledger":
        return <LedgerTab />;
      case "overview":
        return <Overview />;
      case "production":
        return <Production />;
      case "quality-control":
        return <QualityControl />;
      case "distribution":
        return <Distribution />;
      case "sales":
        return <Sales />;
      case "financials":
        return <Financials />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${
              activeTab === tab.value ? "border-purple-600 bg-white" : "border-transparent bg-gray-50"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BukomeroDairyDashboard;
