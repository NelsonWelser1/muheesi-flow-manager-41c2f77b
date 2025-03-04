
import React from 'react';
import { Button } from "@/components/ui/button";

const DebugActions = ({ onReset, isInEditorUICooldown, cooldownRemaining }) => {
  return (
    <div className="pt-4 border-t">
      <p className="text-xs text-gray-500 mb-2">Debug actions:</p>
      <div className="flex space-x-2">
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isInEditorUICooldown()}
        >
          Hard Refresh
          {isInEditorUICooldown() && (
            <span className="ml-1 text-xs text-amber-600">(Locked)</span>
          )}
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Reset Sandbox State
        </Button>
      </div>
    </div>
  );
};

export default DebugActions;
