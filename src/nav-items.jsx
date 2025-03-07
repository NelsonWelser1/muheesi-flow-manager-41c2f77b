
import { HomeIcon, Factory, DollarSign, Receipt, Package } from "lucide-react";
import Index from "./pages/Index.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Smart Production",
    to: "/manage-inventory/smart-production",
    icon: <Factory className="h-4 w-4" />,
  },
  {
    title: "Sales",
    to: "/sales",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Accounts",
    to: "/accounts",
    icon: <Receipt className="h-4 w-4" />,
  },
  {
    title: "Inventory",
    to: "/inventory",
    icon: <Package className="h-4 w-4" />,
  },
];
