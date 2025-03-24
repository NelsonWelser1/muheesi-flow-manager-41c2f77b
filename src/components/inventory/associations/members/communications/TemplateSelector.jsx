
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { Search, Filter, Plus, Eye } from "lucide-react";
import { communicationTemplates, fillTemplate } from '@/utils/communicationTemplates';
import { Badge } from "@/components/ui/badge";

const TemplateSelector = ({ onSelectTemplate, onApplyTemplate, selectedTemplate, templateVariables, onVariableChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState(communicationTemplates);
  const [previewContent, setPreviewContent] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const filtered = communicationTemplates.filter(
        template => 
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(communicationTemplates);
    }
  }, [searchTerm]);

  const handleTemplateClick = (templateId) => {
    onSelectTemplate(templateId);
    setShowPreview(false);
  };
  
  const template = selectedTemplate ? 
    communicationTemplates.find(t => t.id === selectedTemplate) : 
    null;

  const handlePreviewClick = () => {
    if (template) {
      const filledTemplate = fillTemplate(selectedTemplate, templateVariables || {});
      if (filledTemplate) {
        setPreviewSubject(filledTemplate.subject);
        setPreviewContent(filledTemplate.message);
        setShowPreview(true);
      }
    }
  };
  
  // Helper function to get badge variant based on template type
  const getTemplateBadgeVariant = (type) => {
    switch(type?.toLowerCase()) {
      case 'sms': return 'success';
      case 'whatsapp': return 'info';
      case 'email': return 'secondary';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates by name, description or type..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="ml-2">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="ml-2">
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-colors hover:border-primary ${selectedTemplate === template.id ? 'border-2 border-primary' : 'border'}`}
              onClick={() => handleTemplateClick(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium truncate">{template.name}</h5>
                  <Badge variant={getTemplateBadgeVariant(template.type)}>
                    {template.type?.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  Variables: {template.variables.length}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-muted-foreground">
            No templates found matching your search criteria
          </div>
        )}
      </div>
      
      {template && !showPreview && (
        <div className="mt-6 p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Template Variables</h4>
            <Button 
              type="button" 
              variant="outline"
              onClick={handlePreviewClick}
              className="flex items-center"
              disabled={!selectedTemplate}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Fill in the variables to customize your template:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {template.variables.map((variable) => (
              <div key={variable} className="space-y-2">
                <Label htmlFor={variable}>{formatVariableName(variable)}</Label>
                <Input
                  id={variable}
                  placeholder={`Enter ${formatVariableName(variable)}`}
                  value={templateVariables[variable] || ''}
                  onChange={(e) => onVariableChange(variable, e.target.value)}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button 
              type="button" 
              onClick={onApplyTemplate}
              className="w-full md:w-auto"
            >
              Apply Template
            </Button>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="mt-6 p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Preview</h4>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="flex items-center"
            >
              Back to Variables
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={previewSubject} readOnly className="bg-muted" />
            </div>
            
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                value={previewContent} 
                readOnly 
                className="bg-muted min-h-[150px]" 
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Edit Variables
              </Button>
              <Button 
                type="button" 
                onClick={onApplyTemplate}
              >
                Apply Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format variable names
const formatVariableName = (variable) => {
  return variable
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default TemplateSelector;
