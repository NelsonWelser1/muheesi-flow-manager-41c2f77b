
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, RefreshCw } from "lucide-react";
import { format } from 'date-fns';

// Simulated market data - in a real app, this would come from an API
const MARKET_DATA = {
  lastUpdated: "2025-05-03T12:00:00Z",
  rates: [
    { 
      id: 1, 
      name: "Arabica (AA)", 
      market: "ICE NY", 
      currentPrice: 4.20, 
      previousPrice: 4.05, 
      change: "+3.7%", 
      trend: "up",
      forecast: "stable"
    },
    { 
      id: 2, 
      name: "Arabica (A)", 
      market: "ICE NY", 
      currentPrice: 3.80, 
      previousPrice: 3.65, 
      change: "+4.1%", 
      trend: "up",
      forecast: "up"
    },
    { 
      id: 3, 
      name: "Arabica (PB)", 
      market: "ICE NY", 
      currentPrice: 3.90, 
      previousPrice: 3.82, 
      change: "+2.1%", 
      trend: "up",
      forecast: "stable"
    },
    { 
      id: 4, 
      name: "Arabica (B)", 
      market: "ICE NY", 
      currentPrice: 3.40, 
      previousPrice: 3.35, 
      change: "+1.5%", 
      trend: "up",
      forecast: "stable"
    },
    { 
      id: 5, 
      name: "Arabica (Specialty)", 
      market: "Special", 
      currentPrice: 5.50, 
      previousPrice: 5.45, 
      change: "+0.9%", 
      trend: "up",
      forecast: "up"
    },
    { 
      id: 6, 
      name: "Robusta (Screen 18)", 
      market: "ICE EU", 
      currentPrice: 2.70, 
      previousPrice: 2.75, 
      change: "-1.8%", 
      trend: "down",
      forecast: "down"
    },
    { 
      id: 7, 
      name: "Robusta (Screen 15)", 
      market: "ICE EU", 
      currentPrice: 2.40, 
      previousPrice: 2.42, 
      change: "-0.8%", 
      trend: "down",
      forecast: "stable"
    },
    { 
      id: 8, 
      name: "Robusta (Screen 12)", 
      market: "ICE EU", 
      currentPrice: 2.20, 
      previousPrice: 2.15, 
      change: "+2.3%", 
      trend: "up",
      forecast: "stable"
    },
    { 
      id: 9, 
      name: "Robusta (FAQ)", 
      market: "ICE EU", 
      currentPrice: 2.00, 
      previousPrice: 1.95, 
      change: "+2.6%", 
      trend: "up",
      forecast: "stable"
    },
    { 
      id: 10, 
      name: "Organic Premium", 
      market: "Specialty", 
      currentPrice: 0.45, 
      previousPrice: 0.40, 
      change: "+12.5%", 
      trend: "up",
      forecast: "up"
    },
    { 
      id: 11, 
      name: "Fair Trade Premium", 
      market: "Specialty", 
      currentPrice: 0.35, 
      previousPrice: 0.35, 
      change: "0.0%", 
      trend: "stable",
      forecast: "stable"
    }
  ]
};

const MarketRatesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [marketData, setMarketData] = useState(MARKET_DATA);
  const [loading, setLoading] = useState(false);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    // In a real app, this would fetch new market data from an API
    setLoading(true);
    setTimeout(() => {
      setMarketData({
        ...marketData,
        lastUpdated: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
  };

  const filteredData = marketData.rates.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let valueA, valueB;
    
    // Handle different field types
    if (sortBy === 'currentPrice' || sortBy === 'previousPrice') {
      valueA = a[sortBy];
      valueB = b[sortBy];
    } else if (sortBy === 'change') {
      // Extract percentage value
      valueA = parseFloat(a[sortBy].replace('%', ''));
      valueB = parseFloat(b[sortBy].replace('%', ''));
    } else {
      valueA = String(a[sortBy]).toLowerCase();
      valueB = String(b[sortBy]).toLowerCase();
    }
    
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getForecastBadge = (forecast) => {
    const badgeClasses = {
      up: 'bg-green-100 text-green-800 border-green-300',
      down: 'bg-red-100 text-red-800 border-red-300',
      stable: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${badgeClasses[forecast]}`}>
        {forecast.charAt(0).toUpperCase() + forecast.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Current Market Rates</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="text-sm text-gray-500">
        Last Updated: {format(new Date(marketData.lastUpdated), 'PPpp')}
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search coffee type or market..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>
            All prices in USD per kilogram
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Coffee Type
                  {sortBy === 'name' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('market')}>
                <div className="flex items-center">
                  Market
                  {sortBy === 'market' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('currentPrice')}>
                <div className="flex items-center justify-end">
                  Current Price
                  {sortBy === 'currentPrice' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('previousPrice')}>
                <div className="flex items-center justify-end">
                  Previous
                  {sortBy === 'previousPrice' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('change')}>
                <div className="flex items-center justify-end">
                  Change
                  {sortBy === 'change' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort('forecast')}>
                <div className="flex items-center justify-center">
                  Forecast
                  {sortBy === 'forecast' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.market}</TableCell>
                <TableCell className="text-right font-medium">${item.currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">${item.previousPrice.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${getTrendColor(item.trend)}`}>
                  {item.change}
                </TableCell>
                <TableCell className="text-center">
                  {getForecastBadge(item.forecast)}
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="pt-4 text-sm text-gray-500">
        <p>These market rates are based on ICE Futures US (NY) for Arabica and ICE Futures Europe (EU) for Robusta. Premium rates are specialty market valuations.</p>
      </div>
    </div>
  );
};

export default MarketRatesTable;
