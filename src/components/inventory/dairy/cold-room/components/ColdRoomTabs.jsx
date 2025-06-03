
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoodsReceiptForm from '../GoodsReceiptForm';
import GoodsIssueForm from '../GoodsIssueForm';
import MovementTracking from '../MovementTracking';
import RealTimeMonitoring from '../RealTimeMonitoring';
import InventorySummary from '../InventorySummary';

const ColdRoomTabs = ({ userId, username }) => {
  return (
    <Tabs defaultValue="goods-receipt" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="goods-receipt">Goods Receipt</TabsTrigger>
        <TabsTrigger value="goods-issue">Goods Issue</TabsTrigger>
        <TabsTrigger value="movement">Movement Tracking</TabsTrigger>
        <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
        <TabsTrigger value="inventory">All Inventory Records</TabsTrigger>
      </TabsList>

      <TabsContent value="goods-receipt">
        <Card>
          <CardHeader>
            <CardTitle>Cold Room Goods Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <GoodsReceiptForm userId={userId} username={username} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="goods-issue">
        <Card>
          <CardHeader>
            <CardTitle>Cold Room Goods Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <GoodsIssueForm userId={userId} username={username} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="movement">
        <Card>
          <CardHeader>
            <CardTitle>Movement Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <MovementTracking />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring">
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <RealTimeMonitoring />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="inventory">
        <Card>
          <CardHeader>
            <CardTitle>All Inventory Records</CardTitle>
          </CardHeader>
          <CardContent>
            <InventorySummary />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ColdRoomTabs;
