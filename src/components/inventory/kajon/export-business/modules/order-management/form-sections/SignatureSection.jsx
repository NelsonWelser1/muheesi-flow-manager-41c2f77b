
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pen, Trash, RotateCcw } from "lucide-react";

const SignatureSection = ({ 
  initialData = {}, 
  onDataChange,
  editMode = true,
  bgColor = "#f0f9ff",
  variant = "signature" // "signature", "authorization", "approval", etc.
}) => {
  const [sectionTitle, setSectionTitle] = useState(
    initialData.sectionTitle || 
    (variant === "authorization" ? "AUTHORIZED BY" : 
     variant === "approval" ? "APPROVED BY" : "SIGNATURE")
  );
  
  const [signatureItems, setSignatureItems] = useState(initialData.signatureItems || [
    { 
      id: 1, 
      label: "Name",
      value: "",
      type: "text"
    },
    { 
      id: 2, 
      label: "Title",
      value: "",
      type: "text"
    },
    { 
      id: 3, 
      label: "Date",
      value: new Date().toISOString().split('T')[0],
      type: "date"
    },
    { 
      id: 4, 
      label: "Signature",
      value: "",
      type: "signature",
      signatureData: null
    }
  ]);

  // Canvas state for e-signature
  const [activeSignatureId, setActiveSignatureId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);

  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ 
        sectionTitle, 
        signatureItems 
      });
    }
  }, [sectionTitle, signatureItems, onDataChange]);

  // Initialize canvas when activeSignatureId changes
  useEffect(() => {
    if (activeSignatureId && canvasRef) {
      const canvas = canvasRef;
      const ctx = canvas.getContext('2d');
      
      // Set up the canvas
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      // Load existing signature if available
      const signatureItem = signatureItems.find(item => item.id === activeSignatureId);
      if (signatureItem && signatureItem.signatureData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = signatureItem.signatureData;
      } else {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeSignatureId, canvasRef, signatureItems]);

  // Add a new signature item
  const addSignatureItem = () => {
    const newId = signatureItems.length > 0 ? Math.max(...signatureItems.map(item => item.id)) + 1 : 1;
    setSignatureItems([...signatureItems, { 
      id: newId, 
      label: "New Field", 
      value: "",
      type: "text"
    }]);
  };

  // Update a signature item
  const updateSignatureItem = (id, field, value) => {
    setSignatureItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  // Remove a signature item
  const removeSignatureItem = (id) => {
    setSignatureItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Handle starting drawing
  const handleMouseDown = (e) => {
    if (!activeSignatureId) return;
    
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  
  // Handle drawing
  const handleMouseMove = (e) => {
    if (!isDrawing || !activeSignatureId) return;
    
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  
  // Handle ending drawing
  const handleMouseUp = () => {
    if (!isDrawing || !activeSignatureId) return;
    
    setIsDrawing(false);
    
    // Save the signature data
    const canvas = canvasRef;
    const signatureData = canvas.toDataURL();
    updateSignatureItem(activeSignatureId, 'signatureData', signatureData);
    updateSignatureItem(activeSignatureId, 'value', signatureData);
  };

  // Clear the signature
  const clearSignature = () => {
    if (!activeSignatureId || !canvasRef) return;
    
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateSignatureItem(activeSignatureId, 'signatureData', null);
    updateSignatureItem(activeSignatureId, 'value', '');
  };

  // Start signing
  const startSigning = (id) => {
    setActiveSignatureId(id);
  };

  // Cancel signing
  const cancelSigning = () => {
    setActiveSignatureId(null);
  };

  // Render signature field based on edit mode
  const renderSignatureField = (item) => {
    if (item.type !== 'signature') {
      return (
        <Input 
          type={item.type} 
          value={item.value || ''} 
          onChange={(e) => updateSignatureItem(item.id, 'value', e.target.value)}
          className="w-full p-2 border rounded"
        />
      );
    }

    // For signature type fields
    if (activeSignatureId === item.id) {
      return (
        <div className="relative border rounded p-1 bg-white">
          <canvas 
            ref={(ref) => setCanvasRef(ref)}
            width={300}
            height={100}
            className="border border-dashed border-gray-300 bg-white cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSignature}
              title="Clear"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelSigning}
              title="Cancel"
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={cancelSigning}
              title="Done"
            >
              Done
            </Button>
          </div>
        </div>
      );
    }

    if (item.signatureData) {
      return (
        <div className="relative">
          <img 
            src={item.signatureData} 
            alt="Signature" 
            className="max-h-[100px] border rounded p-1 bg-white"
          />
          {editMode && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => startSigning(item.id)}
              className="absolute top-0 right-0 bg-white"
            >
              <Pen className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    }

    return (
      <Button 
        variant="outline" 
        className="w-full h-[60px] border-dashed justify-start px-4 py-2"
        onClick={() => startSigning(item.id)}
      >
        <Pen className="h-4 w-4 mr-2" />
        Click to sign
      </Button>
    );
  };
  
  return (
    <div className="space-y-4">
      {editMode ? (
        <div className="flex items-center gap-2">
          <Input 
            className={`font-bold text-xl bg-[${bgColor}] px-4 py-2`}
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />
        </div>
      ) : (
        <h3 className="text-lg font-bold mb-2 text-blue-800">{sectionTitle}</h3>
      )}
      
      <div className={editMode ? "space-y-3" : "space-y-2"}>
        {editMode ? (
          <>
            {signatureItems.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <Input 
                      value={item.label}
                      onChange={(e) => updateSignatureItem(item.id, 'label', e.target.value)}
                      className="w-full text-sm font-medium"
                      placeholder="Field Label"
                    />
                    <div className="flex gap-1">
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSignatureItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {renderSignatureField(item)}
                </div>
              </div>
            ))}
            
            <Button 
              type="button" 
              onClick={addSignatureItem} 
              size="sm" 
              className="flex items-center gap-1 mt-2"
            >
              + Add Field
            </Button>
          </>
        ) : (
          <div className="space-y-2">
            {signatureItems.map((item) => (
              <div key={item.id} className="flex flex-col mb-4">
                <p className="text-sm font-medium">{item.label}:</p>
                {item.type === 'signature' && item.signatureData ? (
                  <img 
                    src={item.signatureData} 
                    alt="Signature" 
                    className="max-h-[70px] mt-1"
                  />
                ) : (
                  <p className="text-sm">{item.value || '________________________________'}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureSection;
