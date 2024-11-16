import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ImageAnalysis = ({ isKazo, selectedFarm }) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        // Simulate analysis - replace with actual API call
        setTimeout(() => {
          setAnalysis({
            health: "Good",
            issues: ["Minor leaf spots detected"],
            recommendations: ["Consider applying fungicide within next 7 days"]
          });
          toast({
            title: "Analysis Complete",
            description: "Plant health analysis has been completed successfully.",
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Plant Image</h3>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Picture</Label>
                  <Input 
                    id="picture" 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <Button className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {selectedImage && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Preview</h3>
                    <img 
                      src={selectedImage} 
                      alt="Plant preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {analysis && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Analysis Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="text-sm font-medium">Plant Health Status</h4>
                      <p className="text-2xl font-bold text-green-600">{analysis.health}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="text-sm font-medium">Detected Issues</h4>
                      <ul className="list-disc list-inside">
                        {analysis.issues.map((issue, index) => (
                          <li key={index} className="text-sm">{issue}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="text-sm font-medium">Recommendations</h4>
                      <ul className="list-disc list-inside">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageAnalysis;