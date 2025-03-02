
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CatalogBasicInfoSection = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="catalog_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catalog Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter catalog name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select 
              defaultValue={field.value} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center">
                    <span>Draft</span>
                    <Badge variant="secondary" className="ml-2">Draft</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="published">
                  <div className="flex items-center">
                    <span>Published</span>
                    <Badge variant="success" className="ml-2">Published</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="expired">
                  <div className="flex items-center">
                    <span>Expired</span>
                    <Badge variant="destructive" className="ml-2">Expired</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="effective_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Effective Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expiry_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expiry Date (Optional)</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="catalog_description"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Catalog Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter catalog description"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CatalogBasicInfoSection;
