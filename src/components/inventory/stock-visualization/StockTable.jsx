
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, TrendingDown } from 'lucide-react';

const StockTable = ({ data, onViewDetails }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const getStatusColor = (health) => {
    switch (health) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('name')}
            >
              Name {sortConfig.key === 'name' && (
                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('type')}
            >
              Type {sortConfig.key === 'type' && (
                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('location')}
            >
              Location {sortConfig.key === 'location' && (
                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right"
              onClick={() => handleSort('current_stock')}
            >
              Stock Level {sortConfig.key === 'current_stock' && (
                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('health')}
            >
              Status {sortConfig.key === 'health' && (
                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('updated_at')}
            >
              Last Updated {sortConfig.key === 'updated_at' && (
                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>{item.current_stock}/{item.max_capacity}</span>
                  {item.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3 text-green-600" /> : 
                    item.trend === 'down' ? 
                    <TrendingDown className="h-3 w-3 text-red-600" /> : 
                    null
                  }
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.health)}>
                  {item.health === 'good' ? 'Healthy' : item.health === 'warning' ? 'Low' : 'Critical'}
                </Badge>
              </TableCell>
              <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDetails(item)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
