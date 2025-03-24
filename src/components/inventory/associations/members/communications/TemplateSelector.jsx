
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { communicationTemplates } from '@/utils/communicationTemplates';

const TemplateSelector = ({ onSelectTemplate, onApplyTemplate, selectedTemplate, templateVariables, onVariableChange }) => {
  const handleTemplateClick = (templateId) => {
    onSelectTemplate(templateId);
  };
  
  const template = selectedTemplate ? 
    communicationTemplates.find(t => t.id === selectedTemplate) : 
    null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {communicationTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-colors hover:border-primary ${selectedTemplate === template.id ? 'border-2 border-primary' : ''}`}
            onClick={() => handleTemplateClick(template.id)}
          >
            <CardContent className="p-4">
              <h5 className="font-medium">{template.name}</h5>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              <div className="mt-2">
                <Badge type={template.type} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {template && (
        <div className="mt-6 p-4 border rounded-md space-y-4">
          <h4 className="font-medium">Template Variables</h4>
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

// Badge component for template types
const Badge = ({ type }) => {
  const getTypeBadgeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'sms': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'whatsapp': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'email': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeBadgeColor(type)}`}>
      {type?.toUpperCase()}
    </span>
  );
};

export default TemplateSelector;
