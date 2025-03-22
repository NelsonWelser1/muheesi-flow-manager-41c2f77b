
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera, PlusCircle, Leaf, Calendar, AlertCircle, Thermometer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const cropTypes = [
  { value: "coffee", label: "Coffee" },
  { value: "maize", label: "Maize" },
  { value: "beans", label: "Beans" }
];

const diseaseTypes = {
  coffee: ["Coffee Leaf Rust", "Coffee Berry Disease", "Brown Eye Spot", "Coffee Wilt"],
  maize: ["Maize Streak Virus", "Grey Leaf Spot", "Northern Corn Leaf Blight", "Common Rust"],
  beans: ["Bean Rust", "Angular Leaf Spot", "Anthracnose", "Common Bacterial Blight"]
};

const growthStages = {
  coffee: ["Seedling", "Vegetative", "Flowering", "Berry Development", "Ripening"],
  maize: ["Germination", "Vegetative", "Tasseling", "Silking", "Grain Fill", "Maturity"],
  beans: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"]
};

const sampleAnalysisResults = {
  coffee: {
    health: "Good",
    diseaseDetection: {
      detected: "Minor Coffee Leaf Rust",
      severity: "Low (5-10% leaf area)",
      location: "Lower canopy leaves"
    },
    growthStage: "Berry Development",
    nutritionStatus: {
      nitrogen: "Adequate",
      phosphorus: "Slightly deficient",
      potassium: "Adequate"
    },
    recommendations: [
      "Apply copper-based fungicide within the next 7 days",
      "Consider foliar application of phosphorus",
      "Monitor rainfall and irrigation to ensure adequate moisture during berry development"
    ]
  },
  maize: {
    health: "Moderate",
    diseaseDetection: {
      detected: "Early signs of Grey Leaf Spot",
      severity: "Low (3-8% leaf area)",
      location: "Lower leaves"
    },
    growthStage: "Vegetative",
    nutritionStatus: {
      nitrogen: "Deficient",
      phosphorus: "Adequate",
      potassium: "Adequate"
    },
    recommendations: [
      "Apply nitrogen fertilizer immediately",
      "Consider preventative fungicide application",
      "Ensure proper spacing for air circulation to reduce disease pressure"
    ]
  },
  beans: {
    health: "Excellent",
    diseaseDetection: {
      detected: "No significant disease detected",
      severity: "None",
      location: "N/A"
    },
    growthStage: "Flowering",
    nutritionStatus: {
      nitrogen: "Adequate",
      phosphorus: "Adequate",
      potassium: "Adequate"
    },
    recommendations: [
      "Maintain current management practices",
      "Ensure consistent water supply during pod formation",
      "Monitor for pod-feeding insects in the coming weeks"
    ]
  }
};

const ImageAnalysis = ({ isKazo, selectedFarm }) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCropType, setSelectedCropType] = useState("coffee");
  const [activeTab, setActiveTab] = useState("upload");
  const [historyImages, setHistoryImages] = useState([
    { id: 1, date: '2025-03-15', cropType: 'coffee', thumbnail: 'https://placehold.co/100x100/green/white?text=Coffee', health: 'Good' },
    { id: 2, date: '2025-03-10', cropType: 'maize', thumbnail: 'https://placehold.co/100x100/yellow/black?text=Maize', health: 'Moderate' },
    { id: 3, date: '2025-03-05', cropType: 'beans', thumbnail: 'https://placehold.co/100x100/brown/white?text=Beans', health: 'Excellent' }
  ]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate analysis completion
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysis(sampleAnalysisResults[selectedCropType]);
      
      toast({
        title: "Analysis Complete",
        description: `${selectedCropType.charAt(0).toUpperCase() + selectedCropType.slice(1)} plant health analysis has been completed successfully.`,
      });
      
      clearInterval(interval);
      setProgress(100);
    }, 3000);
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please upload or capture an image first",
        variant: "destructive",
      });
      return;
    }
    
    simulateAnalysis();
  };

  const handleHistoryItemClick = (item) => {
    setSelectedCropType(item.cropType);
    setSelectedImage(item.thumbnail);
    simulateAnalysis();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="upload">Image Upload</TabsTrigger>
              <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Upload Plant Image</h3>
                  
                  <div className="space-y-4">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select value={selectedCropType} onValueChange={setSelectedCropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map((crop) => (
                          <SelectItem key={crop.value} value={crop.value}>
                            {crop.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                  
                  {selectedImage && (
                    <Button 
                      onClick={handleAnalyze} 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Plant"}
                    </Button>
                  )}
                  
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Analyzing image...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedImage && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Preview</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={selectedImage} 
                          alt="Plant preview" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Ready to analyze {selectedCropType} plant image
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              {analysis ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="h-5 w-5 text-green-600" />
                          <h4 className="text-sm font-medium">Plant Health Status</h4>
                        </div>
                        <p className={`text-2xl font-bold ${
                          analysis.health === 'Excellent' ? 'text-green-600' : 
                          analysis.health === 'Good' ? 'text-green-500' : 
                          analysis.health === 'Moderate' ? 'text-amber-500' : 
                          'text-red-600'
                        }`}>{analysis.health}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <h4 className="text-sm font-medium">Growth Stage</h4>
                        </div>
                        <p className="text-xl font-semibold">{analysis.growthStage}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <h4 className="text-sm font-medium">Disease Detection</h4>
                        </div>
                        <p className="text-xl font-semibold">{analysis.diseaseDetection.detected}</p>
                        <p className="text-sm text-muted-foreground">Severity: {analysis.diseaseDetection.severity}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-3">Nutrition Status</h4>
                        <div className="space-y-2">
                          {Object.entries(analysis.nutritionStatus).map(([nutrient, status]) => (
                            <div key={nutrient} className="flex justify-between items-center">
                              <span className="capitalize">{nutrient}</span>
                              <span className={`font-medium ${
                                status === 'Adequate' ? 'text-green-600' : 
                                status === 'Slightly deficient' ? 'text-amber-500' : 
                                'text-red-600'
                              }`}>{status}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-3">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button 
                    onClick={() => setActiveTab("upload")} 
                    variant="outline" 
                    className="w-full"
                  >
                    Analyze Another Image
                  </Button>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">Upload and analyze an image to see results</p>
                  <Button 
                    onClick={() => setActiveTab("upload")} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Go to Upload
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Previous Analyses</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {historyImages.map((item) => (
                    <Card 
                      key={item.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <CardContent className="p-3">
                        <div className="aspect-square mb-2 overflow-hidden rounded-md">
                          <img 
                            src={item.thumbnail} 
                            alt={item.cropType} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium capitalize">{item.cropType}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.health === 'Excellent' ? 'bg-green-100 text-green-800' : 
                            item.health === 'Good' ? 'bg-green-50 text-green-700' : 
                            item.health === 'Moderate' ? 'bg-amber-50 text-amber-700' : 
                            'bg-red-50 text-red-700'
                          }`}>
                            {item.health}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                    <CardContent className="p-3 flex flex-col items-center justify-center h-full min-h-[200px]">
                      <PlusCircle className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-medium text-muted-foreground">Add New Analysis</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setActiveTab("upload")}
                      >
                        Upload Image
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageAnalysis;
