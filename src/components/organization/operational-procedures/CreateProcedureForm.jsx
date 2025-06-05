
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  Plus,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CreateProcedureForm = ({ procedure, onClose, onSave }) => {
  const { toast } = useToast();
  const isEditing = !!procedure;
  
  const [formData, setFormData] = useState({
    title: procedure?.title || '',
    description: procedure?.description || '',
    company: procedure?.company || 'Grand Berna Dairies',
    department: procedure?.department || '',
    priority: procedure?.priority || 'medium',
    status: procedure?.status || 'draft',
    category: procedure?.category || 'operational',
    steps: procedure?.steps || [''],
    requirements: procedure?.requirements || [''],
    documents: procedure?.documents || [],
    reviewPeriod: procedure?.reviewPeriod || '6',
    approvers: procedure?.approvers || ['']
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: isEditing ? "Procedure Updated" : "Procedure Created",
      description: `${formData.title} has been ${isEditing ? 'updated' : 'created'} successfully.`
    });
    
    onSave(formData);
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update' : 'Create'} Procedure
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {formData.title}
            </CardTitle>
            <div className="flex gap-2">
              <Badge>{formData.status}</Badge>
              <Badge variant="outline">{formData.priority} priority</Badge>
              <Badge variant="outline">{formData.company}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{formData.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Procedure Steps</h4>
              <ol className="list-decimal list-inside space-y-2">
                {formData.steps.filter(step => step.trim()).map((step, index) => (
                  <li key={index} className="text-muted-foreground">{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <ul className="list-disc list-inside space-y-1">
                {formData.requirements.filter(req => req.trim()).map((requirement, index) => (
                  <li key={index} className="text-muted-foreground">{requirement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Approvers</h4>
              <div className="flex flex-wrap gap-2">
                {formData.approvers.filter(app => app.trim()).map((approver, index) => (
                  <Badge key={index} variant="outline">{approver}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {isEditing ? 'Edit Procedure' : 'Create New Procedure'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update the operational procedure' : 'Create a new operational procedure for your company'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update' : 'Create'} Procedure
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter procedure title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the purpose and scope of this procedure"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <select
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Grand Berna Dairies">Grand Berna Dairies</option>
                    <option value="KAJON Coffee">KAJON Coffee</option>
                    <option value="Kyalima Farmers">Kyalima Farmers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Quality Control, Production"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Procedure Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-sm font-medium text-muted-foreground mt-3 min-w-[30px]">
                    {index + 1}.
                  </span>
                  <textarea
                    value={step}
                    onChange={(e) => handleArrayFieldChange('steps', index, e.target.value)}
                    className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe this step in detail"
                    rows={2}
                  />
                  {formData.steps.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('steps', index)}
                      className="mt-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayField('steps')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements & Prerequisites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                    className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a requirement or prerequisite"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('requirements', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayField('requirements')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Period (months)</label>
                <select
                  value={formData.reviewPeriod}
                  onChange={(e) => handleInputChange('reviewPeriod', e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approvers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.approvers.map((approver, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={approver}
                    onChange={(e) => handleArrayFieldChange('approvers', index, e.target.value)}
                    className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Approver name or role"
                  />
                  {formData.approvers.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('approvers', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayField('approvers')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Approver
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload supporting documents
                </p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProcedureForm;
