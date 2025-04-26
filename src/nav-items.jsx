
import { HomeIcon, Banknote } from "lucide-react";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Financial Ledger",
    to: "/financial-ledger",
    icon: <Banknote className="h-4 w-4" />,
  }
];
