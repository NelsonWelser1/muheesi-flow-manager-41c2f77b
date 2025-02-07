import { 
  Milk, Factory, Snowflake, Beef, TrendingUp, 
  Truck, Users, FileSpreadsheet, Package 
} from "lucide-react";
import DairyCoolers from '../DairyCoolers';
import YogurtProcessing from '../YogurtProcessing';
import ColdRoomStock from '../ColdRoomStock';
import SlaughterhouseStock from '../SlaughterhouseStock';
import SalesMarketing from '../SalesMarketing';
import CheeseFactoryDashboard from '../cheese-factory/CheeseFactoryDashboard';
import PackagingLabeling from '../packaging/PackagingLabeling';
import LogisticsDashboard from '../logistics/LogisticsDashboard';
import PersonnelDashboard from '../personnel/PersonnelDashboard';
import ReportsDashboard from '../reports/ReportsDashboard';

export const dairySections = [
  { 
    id: 'coolers', 
    title: 'Reception & Milk Coolers', 
    icon: Milk, 
    component: DairyCoolers,
    group: 'Cheese Factory',
    notifications: 2,
    status: 'operational'
  },
  { 
    id: 'cheese', 
    title: 'Cheese Factory Operations', 
    icon: Factory, 
    component: CheeseFactoryDashboard,
    group: 'Cheese Factory',
    notifications: 1,
    status: 'maintenance'
  },
  { 
    id: 'yogurt', 
    title: 'Yogurt Processing', 
    icon: Factory, 
    component: YogurtProcessing,
    group: 'Cheese Factory',
    notifications: 0,
    status: 'operational'
  },
  { 
    id: 'coldroom', 
    title: 'Cold Room', 
    icon: Snowflake, 
    component: ColdRoomStock,
    group: 'Cheese Factory',
    notifications: 3,
    status: 'attention'
  },
  { 
    id: 'packaging', 
    title: 'Packaging & Labeling', 
    icon: Package, 
    component: PackagingLabeling,
    group: 'Cheese Factory',
    notifications: 0,
    status: 'operational'
  },
  { 
    id: 'sales', 
    title: 'Sales & Marketing', 
    icon: TrendingUp, 
    component: SalesMarketing,
    group: 'Operations',
    notifications: 1,
    status: 'operational'
  },
  { 
    id: 'logistics', 
    title: 'Logistics & Distribution', 
    icon: Truck, 
    component: LogisticsDashboard,
    group: 'Operations',
    notifications: 2,
    status: 'operational'
  },
  { 
    id: 'personnel', 
    title: 'Personnel Management', 
    icon: Users, 
    component: PersonnelDashboard,
    group: 'Operations',
    notifications: 1,
    status: 'operational'
  },
  { 
    id: 'reports', 
    title: 'Reports & Analytics', 
    icon: FileSpreadsheet, 
    component: ReportsDashboard,
    group: 'Operations',
    notifications: 0,
    status: 'operational'
  },
  { 
    id: 'slaughterhouse', 
    title: 'Slaughterhouse', 
    icon: Beef, 
    component: SlaughterhouseStock,
    group: 'Other Businesses',
    notifications: 0,
    status: 'operational'
  }
];
