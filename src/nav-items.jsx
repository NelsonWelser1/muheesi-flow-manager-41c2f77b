
import { HomeIcon, Building2, Users, FileText, Settings, BarChart3 } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Organizations",
    to: "/organizations",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    title: "Company Policies",
    to: "/company-policies",
    icon: <FileText className="h-4 w-4" />,
  },
];
