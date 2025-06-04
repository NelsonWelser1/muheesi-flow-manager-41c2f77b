
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Globe, Target } from 'lucide-react';

const MarketAnalysis = () => {
  const marketTrends = [
    {
      market: "European Union",
      growth: "+15.2%",
      demand: "High",
      pricePoint: "$7.20/kg",
      opportunity: "Premium organic blends"
    },
    {
      market: "North America", 
      growth: "+8.7%",
      demand: "Stable",
      pricePoint: "$6.85/kg",
      opportunity: "Specialty single-origin"
    },
    {
      market: "Asia-Pacific",
      growth: "+22.4%",
      demand: "Very High",
      pricePoint: "$6.95/kg",
      opportunity: "Instant coffee products"
    },
    {
      market: "Middle East",
      growth: "+12.1%",
      demand: "Medium",
      pricePoint: "$6.50/kg",
      opportunity: "Traditional blends"
    }
  ];

  const competitorAnalysis = [
    { competitor: "Global Coffee Corp", marketShare: "18%", strength: "Distribution", weakness: "Price" },
    { competitor: "Premium Exports Ltd", marketShare: "15%", strength: "Quality", weakness: "Capacity" },
    { competitor: "East African Traders", marketShare: "12%", strength: "Origin", weakness: "Marketing" },
    { competitor: "Specialty Coffee Co.", marketShare: "10%", strength: "Branding", weakness: "Scale" }
  ];

  const pricingAnalysis = [
    { grade: "AA Premium", ourPrice: 7.20, marketAvg: 7.35, competitive: true },
    { grade: "A Grade", ourPrice: 6.85, marketAvg: 6.75, competitive: false },
    { grade: "AB Standard", ourPrice: 6.50, marketAvg: 6.60, competitive: true },
    { grade: "B Grade", ourPrice: 5.95, marketAvg: 6.10, competitive: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Market Analysis & Intelligence</h3>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Market Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Market Trends Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketTrends.map((trend, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{trend.market}</h4>
                  <span className="text-green-600 font-semibold">{trend.growth}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Demand Level</p>
                    <p className="font-medium">{trend.demand}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price Point</p>
                    <p className="font-medium">{trend.pricePoint}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground text-sm">Opportunity</p>
                  <p className="font-medium text-blue-600">{trend.opportunity}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitor Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitorAnalysis.map((comp, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{comp.competitor}</h4>
                  <span className="text-lg font-bold text-blue-600">{comp.marketShare}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Strength</p>
                    <p className="font-medium text-green-600">{comp.strength}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weakness</p>
                    <p className="font-medium text-red-600">{comp.weakness}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competitive Pricing Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingAnalysis.map((price, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{price.grade}</h4>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-sm text-muted-foreground">Our Price</p>
                  <p className="font-semibold">${price.ourPrice}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-sm text-muted-foreground">Market Avg</p>
                  <p className="font-semibold">${price.marketAvg}</p>
                </div>
                <div className="flex-1 text-center">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    price.competitive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {price.competitive ? 'Competitive' : 'Above Market'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Analysis Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Trend Analysis
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              Market Research
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Price Monitoring
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Globe className="h-6 w-6 mb-2" />
              Opportunity Scanner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
