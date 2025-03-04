
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import CustomDatePicker from "./CustomDatePicker";

const CropForm = ({ form, onSubmit, isEdit = false }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="plantationArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plantation Area (acres)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="Enter area in acres" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="growthStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growth Stage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select growth stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Seedling">Seedling</SelectItem>
                    <SelectItem value="Vegetative">Vegetative</SelectItem>
                    <SelectItem value="Flowering">Flowering</SelectItem>
                    <SelectItem value="Fruiting">Fruiting</SelectItem>
                    <SelectItem value="Harvesting">Harvesting</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastFertilizationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Fertilization Date</FormLabel>
                <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fertilizerUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fertilizer Used</FormLabel>
                <FormControl>
                  <Input placeholder="Enter fertilizer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nextFertilizationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Next Fertilization Date</FormLabel>
                <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastPesticideDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Pesticide Application</FormLabel>
                <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pesticideUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pesticide Used</FormLabel>
                <FormControl>
                  <Input placeholder="Enter pesticide name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="applicationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Application</FormLabel>
                <FormControl>
                  <Textarea placeholder="Explain why pesticide was applied" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="diseaseStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disease Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disease status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="Infected">Infected</SelectItem>
                    <SelectItem value="Treated">Treated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bunchesHarvested"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bunches Harvested</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="Number of bunches" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="submit">{isEdit ? "Update Crop" : "Add Crop"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CropForm;
