
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrderInformation = () => {
  return (
    <div className="space-y-4">
      <Input 
        className="text-xl font-bold bg-[#fff3e0] px-4 py-2"
        defaultValue="ORDER INFORMATION" 
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Input className="font-bold" defaultValue="PRODUCT NAME" />
            </TableHead>
            <TableHead>
              <Input className="font-bold" defaultValue="ITEM #" />
            </TableHead>
            <TableHead>
              <Input className="font-bold" defaultValue="PRICE" />
            </TableHead>
            <TableHead>
              <Input className="font-bold" defaultValue="QTY" />
            </TableHead>
            <TableHead>
              <Input className="font-bold" defaultValue="SIZE" />
            </TableHead>
            <TableHead>
              <Input className="font-bold" defaultValue="GRADE" />
            </TableHead>
            <TableHead>
              <Input className="font-bold" defaultValue="TOTAL" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Input placeholder="Product name" />
            </TableCell>
            <TableCell>
              <Input placeholder="Item #" />
            </TableCell>
            <TableCell>
              <Input type="number" placeholder="0.00" />
            </TableCell>
            <TableCell>
              <Input type="number" placeholder="0" />
            </TableCell>
            <TableCell>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>$0.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderInformation;
