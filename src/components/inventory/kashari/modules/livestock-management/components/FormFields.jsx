
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const AnimalIdField = ({ control }) => (
  <FormField
    control={control}
    name="animal_id"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Animal ID</FormLabel>
        <FormControl>
          <Input placeholder="Enter animal ID" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const SpeciesField = ({ control }) => (
  <FormField
    control={control}
    name="species"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Species</FormLabel>
        <Select 
          onValueChange={field.onChange} 
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a species" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Cow">Cow</SelectItem>
            <SelectItem value="Goat">Goat</SelectItem>
            <SelectItem value="Chicken">Chicken</SelectItem>
            <SelectItem value="Sheep">Sheep</SelectItem>
            <SelectItem value="Pig">Pig</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const BreedField = ({ control }) => (
  <FormField
    control={control}
    name="breed"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Breed</FormLabel>
        <FormControl>
          <Input placeholder="Enter breed" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const AgeField = ({ control }) => (
  <FormField
    control={control}
    name="age"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Age (in months)</FormLabel>
        <FormControl>
          <Input placeholder="Enter age in months" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const HealthStatusField = ({ control }) => (
  <FormField
    control={control}
    name="health_status"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Health Status</FormLabel>
        <Select 
          onValueChange={field.onChange} 
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select health status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Healthy">Healthy</SelectItem>
            <SelectItem value="Sick">Sick</SelectItem>
            <SelectItem value="Under Treatment">Under Treatment</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const NotesField = ({ control }) => (
  <FormField
    control={control}
    name="notes"
    render={({ field }) => (
      <FormItem className="md:col-span-2">
        <FormLabel>Notes (Optional)</FormLabel>
        <FormControl>
          <Textarea 
            placeholder="Enter any additional notes" 
            className="min-h-[80px]" 
            {...field} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
