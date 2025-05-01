
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, Check, ChevronsUpDown, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the form validation schema
const transactionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  bankAccount: z.string().min(1, "Bank account is required"),
  type: z.string().min(1, "Transaction type is required"),
  payee: z.string().min(1, "Payee is required"),
  reason: z.string().min(1, "Reason is required"),
  amount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive("Amount must be positive").min(1, "Amount is required")
  ),
});

// Predefined bank account options
const bankAccounts = [
  { label: "Primary Account", value: "Primary Account" },
  { label: "Business Savings", value: "Business Savings" },
  { label: "Capital Investment", value: "Capital Investment" },
  { label: "Cash", value: "Cash" },
];

const TransactionForm = ({ transaction, onSubmit, onCancel }) => {
  // Initialize the form with default values or existing transaction data
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? { ...transaction }
      : {
          date: new Date().toISOString().split("T")[0],
          bankAccount: "Primary Account",
          type: "income",
          payee: "",
          reason: "",
          amount: "",
        },
  });

  // Handle form submission
  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      amount: Number(data.amount),
    });
  };

  // Track if the dropdown is open
  const [open, setOpen] = React.useState(false);
  const [customAccount, setCustomAccount] = React.useState("");

  const bankAccountValue = form.watch("bankAccount");
  const isCustomAccount = !bankAccounts.find(acc => acc.value === bankAccountValue);

  return (
    <Card className="bg-white shadow-md border-t-4 border-[#8B5CF6]">
      <CardHeader>
        <CardTitle className="text-lg text-[#6E59A5]">
          {transaction ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Transaction Date"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Bank Account Field - Modified to support custom entries */}
            <FormField
              control={form.control}
              name="bankAccount"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Bank Account</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value || "Select account"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search account..." 
                          value={isCustomAccount ? customAccount : ""}
                          onValueChange={(value) => {
                            setCustomAccount(value);
                            if (value) {
                              form.setValue("bankAccount", value);
                            }
                          }}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <div className="px-2 py-1 text-sm">
                              No account found. Press Enter to create "{customAccount || "this account"}"
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {bankAccounts.map((account) => (
                              <CommandItem
                                key={account.value}
                                value={account.value}
                                onSelect={() => {
                                  form.setValue("bankAccount", account.value);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === account.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {account.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type Field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payee Field */}
            <FormField
              control={form.control}
              name="payee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payee / Payer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter payee or payer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reason / Description Field */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason / Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter transaction description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (UGX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[#8B5CF6] text-[#8B5CF6]"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#8B5CF6] hover:bg-[#7C4FF3] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {transaction ? "Update Transaction" : "Save Transaction"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
