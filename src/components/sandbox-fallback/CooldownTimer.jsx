
import React, { useState, useEffect } from 'react';
import { Clock } from "lucide-react";

const CooldownTimer = ({ isInEditorUICooldown }) => {
  const [cooldownRemaining, setCooldownRemaining] = useState(null);
  
  // Calculate and update cooldown remaining time
  useEffect(() => {
    if (!isInEditorUICooldown()) {
      setCooldownRemaining(null);
      return;
    }
    
    const updateCooldownTimer = () => {
      // One hour in milliseconds
      const HOUR_MS = 60 * 60 * 1000;
      const lastReset = window.__MUHEESI_APP_STATE?.lastEditorUIInteractionTime || 
                         Date.now() - HOUR_MS;
      const elapsed = Date.now() - lastReset;
      const remaining = Math.max(0, HOUR_MS - elapsed);
      
      // Convert to minutes and seconds
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      
      setCooldownRemaining(`${minutes}m ${seconds}s`);
    };
    
    // Update immediately
    updateCooldownTimer();
    
    // Then update every second
    const timer = setInterval(updateCooldownTimer, 1000);
    return () => clearInterval(timer);
  }, [isInEditorUICooldown]);

  if (!isInEditorUICooldown()) return null;

  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
          <Clock className="h-6 w-6 text-amber-600" />
        </div>
      </div>
      <span className="block text-amber-600 mt-2">
        Editor UI interaction detected. Sandbox refresh blocked for: 
        <span className="font-bold ml-1">{cooldownRemaining}</span>
      </span>
      <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-800">
        Automatic refresh is blocked for {cooldownRemaining} to prevent infinite loading loops when interacting with the editor UI.
      </div>
    </>
  );
};

export default CooldownTimer;
