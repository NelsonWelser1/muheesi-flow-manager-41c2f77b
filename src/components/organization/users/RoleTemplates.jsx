import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/components/ui/confirmation-dialog";
import { usePermissions } from "@/hooks/usePermissions";
import { CardLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState, EmptyState, PermissionDenied } from "@/components/ui/error-state";
import { roleTemplateSchema } from "@/utils/roleValidation";
import { 
  ArrowLeft,
  Package,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const RoleTemplates = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { confirm, Dialog } = useConfirmation();
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    role: '',
    defaultCompany: '',
    isActive: true
  });
  const [validationErrors, setValidationErrors] = useState({});

  const { data: templates, isLoading, error: templatesError, refetch } = useQuery({
    queryKey: ['role-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_templates')
        .select(`
          *,
          created_by_profile:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: companies } = useQuery({
    queryKey: ['companies-for-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('company')
        .not('company', 'is', null);

      if (error) throw error;
      return [...new Set(data.map(r => r.company))];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (templateData) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('role_templates')
        .insert({
          name: templateData.name,
          description: templateData.description,
          role: templateData.role,
          default_company: templateData.defaultCompany,
          is_active: templateData.isActive,
          created_by: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['role-templates']);
      toast({
        title: "Success",
        description: "Template created successfully"
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create template: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { error } = await supabase
        .from('role_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['role-templates']);
      toast({
        title: "Success",
        description: "Template updated successfully"
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update template: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (templateId) => {
      const { error } = await supabase
        .from('role_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['role-templates']);
      toast({
        title: "Success",
        description: "Template deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete template: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const applyTemplateMutation = useMutation({
    mutationFn: async ({ templateId, userId }) => {
      const template = templates.find(t => t.id === templateId);
      const { data: { user } } = await supabase.auth.getUser();

      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingRole) {
        await supabase
          .from('user_roles')
          .update({
            role: template.role,
            company: template.default_company,
            assigned_by: user.id
          })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: template.role,
            company: template.default_company,
            assigned_by: user.id
          });
      }

      // Log in audit
      await supabase
        .from('role_change_audit_log')
        .insert({
          changed_by: user.id,
          affected_user: userId,
          old_role: null,
          new_role: template.role,
          old_company: null,
          new_company: template.default_company,
          action_type: existingRole ? 'updated' : 'assigned',
          notes: `Applied template: ${template.name}`
        });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template applied successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to apply template: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      role: '',
      defaultCompany: '',
      isActive: true
    });
    setValidationErrors({});
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate input
    try {
      roleTemplateSchema.parse(formData);
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before continuing",
        variant: "destructive"
      });
      return;
    }

    // Role-company validation
    if (formData.role === 'sysadmin' && formData.defaultCompany !== 'All Companies') {
      setValidationErrors({ defaultCompany: "System admins must be assigned to 'All Companies'" });
      toast({
        title: "Invalid Configuration",
        description: "System admins must be assigned to 'All Companies'",
        variant: "destructive"
      });
      return;
    }

    if (formData.role !== 'sysadmin' && formData.defaultCompany === 'All Companies') {
      setValidationErrors({ defaultCompany: "Only system admins can be assigned to 'All Companies'" });
      toast({
        title: "Invalid Configuration",
        description: "Only system admins can be assigned to 'All Companies'",
        variant: "destructive"
      });
      return;
    }

    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate.id,
        name: formData.name,
        description: formData.description,
        role: formData.role,
        default_company: formData.defaultCompany,
        is_active: formData.isActive
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      role: template.role,
      defaultCompany: template.default_company || '',
      isActive: template.is_active
    });
    setValidationErrors({});
    setIsCreating(true);
  };

  const handleDelete = async (templateId, templateName) => {
    const confirmed = await confirm({
      title: "Delete Template",
      description: `Are you sure you want to delete the template "${templateName}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "destructive"
    });

    if (confirmed) {
      deleteMutation.mutate(templateId);
    }
  };

  // Permission check
  if (permissionsLoading || isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <CardLoadingSkeleton count={3} />
      </div>
    );
  }

  if (!permissions?.canManageUsers) {
    return (
      <div className="container mx-auto p-6">
        <PermissionDenied 
          message="You don't have permission to manage role templates"
          requiredRole="System Administrator or Manager"
        />
      </div>
    );
  }

  // Error state
  if (templatesError) {
    return (
      <div className="container mx-auto p-6">
        <ErrorState
          title="Failed to load templates"
          message={templatesError.message}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Dialog />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="h-8 w-8" />
              Role Templates
            </h1>
            <p className="text-muted-foreground mt-1">
              Create reusable role templates for quick assignment
            </p>
          </div>
        </div>
        <Button onClick={() => {
          resetForm();
          setIsCreating(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTemplate ? 'Edit' : 'Create'} Role Template</CardTitle>
            <CardDescription>Define a reusable role configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name *</Label>
                  <Input
                    placeholder="e.g., Standard Manager"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={validationErrors.name ? 'border-destructive' : ''}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger className={validationErrors.role ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sysadmin">System Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.role && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {validationErrors.role}
                    </p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Default Company *</Label>
                  <Select value={formData.defaultCompany} onValueChange={(value) => setFormData({...formData, defaultCompany: value})}>
                    <SelectTrigger className={validationErrors.defaultCompany ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Companies">All Companies</SelectItem>
                      {companies?.map((company) => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.defaultCompany && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {validationErrors.defaultCompany}
                    </p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe when this template should be used..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className={validationErrors.description ? 'border-destructive' : ''}
                  />
                  {validationErrors.description && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {validationErrors.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 col-span-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label>Active Template</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) 
                    ? 'Saving...' 
                    : `${editingTemplate ? 'Update' : 'Create'} Template`
                  }
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <Card key={template.id} className={!template.is_active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{template.role}</Badge>
                    {!template.is_active && (
                      <Badge variant="outline" className="bg-gray-50">Inactive</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id, template.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {template.description && (
                <p className="text-sm text-muted-foreground">{template.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Default Company</p>
                  <p className="font-medium">{template.default_company}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">
                    Created by {template.created_by_profile?.full_name || 'Unknown'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/users/bulk-role-assignment?template=${template.id}`)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}

        {templates?.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12">
              <EmptyState
                Icon={Package}
                title="No role templates yet"
                message="Create your first template to get started"
                actionLabel="Create Template"
                onAction={() => {
                  resetForm();
                  setIsCreating(true);
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleTemplates;
