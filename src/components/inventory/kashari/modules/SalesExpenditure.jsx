
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INITIAL_SALES = [
  { id: 1, product: "Bananas (Ripe)", quantity: 40, unitPrice: 6500, customer: "Nakumatt Supermarket", date: "2025-04-07" },
  { id: 2, product: "Bananas (Green)", quantity: 30, unitPrice: 5000, customer: "Carrefour Uganda", date: "2025-04-03" },
  { id: 3, product: "Bananas (Ripe)", quantity: 50, unitPrice: 6500, customer: "Fresh Foods Market", date: "2025-04-01" },
];

const SalesExpenditure = () => {
  const [sales, setSales] = useState(INITIAL_SALES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    unitPrice: "",
    customer: "",
  });

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    setForm({ product: "", quantity: "", unitPrice: "", customer: "" });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.product || !form.quantity || !form.unitPrice || !form.customer) return;
    setSales([
      {
        id: Date.now(),
        product: form.product,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        customer: form.customer,
        date: new Date().toISOString().split("T")[0],
      },
      ...sales,
    ]);
    handleCloseForm();
  };

  // Calculate totals for the ledger rows
  const openingBalance = 0;
  let runningBalance = openingBalance;
  const ledgerRows = [...sales]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => {
      runningBalance += item.quantity * item.unitPrice;
      return { ...item, runningBalance: runningBalance };
    });
  const totalQuantity = sales.reduce((acc, s) => acc + Number(s.quantity), 0);
  const totalAmount = sales.reduce((acc, s) => acc + (Number(s.quantity) * Number(s.unitPrice)), 0);
  const closingBalance = openingBalance + totalAmount;

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2 text-[#6E59A5]">Sales Expenditure Tracker</h1>
      <div>
        {!showForm && (
          <Button 
            variant="default"
            onClick={handleOpenForm}
            className="bg-[#8B5CF6] text-white hover:bg-[#7E69AB]"
          >
            Add Sale
          </Button>
        )}
      </div>
      {showForm && (
        <Card className="my-4 bg-[#F1F0FB] border-[#9B87F5] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#8B5CF6]">Add Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              <div>
                <Label htmlFor="product" className="text-[#1A1F2C]">Product</Label>
                <Input
                  id="product"
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  required
                  className="bg-[#fff] border-[#9B87F5]"
                  placeholder="eg. Bananas (Ripe)"
                />
              </div>
              <div>
                <Label htmlFor="quantity" className="text-[#1A1F2C]">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="bg-[#fff] border-[#9B87F5]"
                  placeholder="eg. 35"
                />
              </div>
              <div>
                <Label htmlFor="unitPrice" className="text-[#1A1F2C]">Unit Price (UGX)</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  min="0"
                  value={form.unitPrice}
                  onChange={handleChange}
                  required
                  className="bg-[#fff] border-[#9B87F5]"
                  placeholder="eg. 6000"
                />
              </div>
              <div>
                <Label htmlFor="customer" className="text-[#1A1F2C]">Customer</Label>
                <Input
                  id="customer"
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  required
                  className="bg-[#fff] border-[#9B87F5]"
                  placeholder="eg. Nakumatt"
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
                <Button type="submit" className="bg-[#9B87F5] text-[#fff] hover:bg-[#7E69AB]">
                  Save Sale
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="border-[#9B87F5] text-[#9B87F5] hover:bg-[#F2FCE2]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-xl">
        <CardContent className="overflow-x-auto pt-6">
          <table className="min-w-full border-collapse bg-white rounded-md">
            <thead>
              <tr>
                <th className="p-2 border-b font-bold text-[#7E69AB] bg-[#E5DEFF]">Date</th>
                <th className="p-2 border-b font-bold text-[#7E69AB] bg-[#E5DEFF]">Product</th>
                <th className="p-2 border-b font-bold text-[#7E69AB] bg-[#E5DEFF]">Quantity</th>
                <th className="p-2 border-b font-bold text-[#7E69AB] bg-[#E5DEFF]">Unit Price</th>
                <th className="p-2 border-b font-bold text-[#7E69AB] bg-[#E5DEFF]">Customer</th>
                <th className="p-2 border-b font-bold text-[#7E69AB] bg-[#E5DEFF]">Amount</th>
                <th className="p-2 border-b font-bold text-[#7E69AB] bg-[#E5DEFF]">Running Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="font-semibold text-[#8E9196]">Opening Balance</td>
                <td className="font-semibold text-[#403E43]">UGX {openingBalance.toLocaleString()}</td>
              </tr>
              {ledgerRows.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.product}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">UGX {item.unitPrice.toLocaleString()}</td>
                  <td className="p-2">{item.customer}</td>
                  <td className="p-2 text-[#0EA5E9] font-semibold">
                    UGX {(item.quantity * item.unitPrice).toLocaleString()}
                  </td>
                  <td className="p-2 text-[#221F26] font-bold">
                    UGX {item.runningBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="font-bold text-right text-[#403E43]">Total</td>
                <td className="font-bold text-[#6E59A5]">{totalQuantity}</td>
                <td className="font-bold">&mdash;</td>
                <td className="font-bold">&mdash;</td>
                <td className="font-bold text-[#0EA5E9]">UGX {totalAmount.toLocaleString()}</td>
                <td />
              </tr>
              <tr>
                <td colSpan={6} className="font-bold text-[#8E9196]">Closing Balance</td>
                <td className="font-bold text-[#8B5CF6]">UGX {closingBalance.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesExpenditure;

