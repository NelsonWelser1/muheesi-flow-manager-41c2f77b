import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <TabsTrigger value="inventory">Inventory Summary</TabsTrigger>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cold Room Goods Issue</CardTitle>
            <Button variant="outline" size="sm">
              Access
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">Recent Issues</h3>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">Pending Issues</h3>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">Total Quantity Issued</h3>
                  <p className="text-2xl font-bold">0 kg</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Goods Issue Preview</h3>
                <p className="text-gray-500 text-center py-8">No goods issues recorded yet</p>
              </div>
            </div>
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
            <CardTitle>Inventory Summary</CardTitle>
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
