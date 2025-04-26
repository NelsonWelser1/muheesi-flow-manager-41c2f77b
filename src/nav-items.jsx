
import { HomeIcon, DollarSign, Receipt } from "lucide-react";

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
    title: "Sales",
    to: "/sales",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Accounts",
    to: "/accounts",
    icon: <Receipt className="h-4 w-4" />,
  },
];
