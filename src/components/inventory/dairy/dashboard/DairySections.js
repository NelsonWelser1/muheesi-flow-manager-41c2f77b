import { 
  Milk, Factory, Snowflake, Beef, TrendingUp, 
  Truck, Users, FileSpreadsheet 
} from "lucide-react";
import DairyCoolers from '../DairyCoolers';
import FactoryStock from '../FactoryStock';
import ColdRoomStock from '../ColdRoomStock';
import SlaughterhouseStock from '../SlaughterhouseStock';
import SalesMarketing from '../SalesMarketing';
import CheeseFactoryDashboard from '../cheese-factory/CheeseFactoryDashboard';
import LogisticsDashboard from '../logistics/LogisticsDashboard';
import PersonnelDashboard from '../personnel/PersonnelDashboard';
import ReportsDashboard from '../reports/ReportsDashboard';

export const dairySections = [
  { 
    id: 'coolers', 
    title: 'Dairy Coolers', 
    icon: Milk, 
    component: DairyCoolers,
    notifications: 2,
    status: 'operational'
  },
  { 
    id: 'cheese', 
    title: 'Cheese Factory Operations', 
    icon: Factory, 
    component: CheeseFactoryDashboard,
    notifications: 1,
    status: 'maintenance'
  },
  { 
    id: 'factory', 
    title: 'Factory Stock', 
    icon: Factory, 
    component: FactoryStock,
    notifications: 0,
    status: 'operational'
  },
  { 
    id: 'coldroom', 
    title: 'Cold Room', 
    icon: Snowflake, 
    component: ColdRoomStock,
    notifications: 3,
    status: 'attention'
  },
  { 
    id: 'slaughterhouse', 
    title: 'Slaughterhouse', 
    icon: Beef, 
    component: SlaughterhouseStock,
    notifications: 0,
    status: 'operational'
  },
  { 
    id: 'sales', 
    title: 'Sales & Marketing', 
    icon: TrendingUp, 
    component: SalesMarketing,
    notifications: 1,
    status: 'operational'
  },
  { 
    id: 'logistics', 
    title: 'Logistics & Distribution', 
    icon: Truck, 
    component: LogisticsDashboard,
    notifications: 2,
    status: 'operational'
  },
  { 
    id: 'personnel', 
    title: 'Personnel Management', 
    icon: Users, 
    component: PersonnelDashboard,
    notifications: 1,
    status: 'operational'
  },
  { 
    id: 'reports', 
    title: 'Reports & Analytics', 
    icon: FileSpreadsheet, 
    component: ReportsDashboard,
    notifications: 0,
    status: 'operational'
  }
];