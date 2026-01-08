import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const roleSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(100),
  role_key: z.string().min(2, 'Role key must be at least 2 characters').max(50)
    .regex(/^[a-z_]+$/, 'Role key must be lowercase letters and underscores only'),
  description: z.string().max(500).optional(),
  tier: z.enum(['strategic', 'tactical', 'operational'])
});

const TIER_OPTIONS = [
  { value: 'strategic', label: 'Strategic', description: 'Executive and board-level roles' },
  { value: 'tactical', label: 'Tactical', description: 'Manager and supervisor roles' },
  { value: 'operational', label: 'Operational', description: 'Staff and operational roles' }
];

export const RoleForm = ({ 
  defaultValues, 
  onSubmit, 
  onCancel, 
  isLoading,
  isEditing = false 
}) => {
  const form = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      display_name: defaultValues?.display_name || '',
      role_key: defaultValues?.role_key || '',
      description: defaultValues?.description || '',
      tier: defaultValues?.tier || 'operational'
    }
  });

  // Auto-generate role_key from display_name if not editing
  const handleDisplayNameChange = (value, field) => {
    field.onChange(value);
    if (!isEditing) {
      const roleKey = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
      form.setValue('role_key', roleKey);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Marketing Coordinator" 
                  {...field}
                  onChange={(e) => handleDisplayNameChange(e.target.value, field)}
                />
              </FormControl>
              <FormDescription>
                The human-readable name shown in the UI
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Key</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., marketing_coordinator" 
                  {...field}
                  disabled={isEditing}
                />
              </FormControl>
              <FormDescription>
                Unique identifier (lowercase, underscores only)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIER_OPTIONS.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      <div className="flex flex-col">
                        <span>{tier.label}</span>
                        <span className="text-xs text-muted-foreground">{tier.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the responsibilities and access level for this role..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleForm;
