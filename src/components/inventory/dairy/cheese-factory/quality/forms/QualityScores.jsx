import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QualityScores = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">Quality Scores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="textureScore">Texture Score (1-10)</Label>
          <Input
            id="textureScore"
            type="number"
            min="1"
            max="10"
            value={formData.textureScore}
            onChange={(e) => setFormData({ ...formData, textureScore: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="flavorScore">Flavor Score (1-10)</Label>
          <Input
            id="flavorScore"
            type="number"
            min="1"
            max="10"
            value={formData.flavorScore}
            onChange={(e) => setFormData({ ...formData, flavorScore: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textureType">Texture Type</Label>
          <Select
            value={formData.textureType}
            onValueChange={(value) => setFormData({ ...formData, textureType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select texture type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smooth">Smooth</SelectItem>
              <SelectItem value="crumbly">Crumbly</SelectItem>
              <SelectItem value="creamy">Creamy</SelectItem>
              <SelectItem value="firm">Firm</SelectItem>
              <SelectItem value="elastic">Elastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="flavorProfile">Flavor Profile</Label>
          <Select
            value={formData.flavorProfile}
            onValueChange={(value) => setFormData({ ...formData, flavorProfile: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flavor profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="sharp">Sharp</SelectItem>
              <SelectItem value="tangy">Tangy</SelectItem>
              <SelectItem value="nutty">Nutty</SelectItem>
              <SelectItem value="salty">Salty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default QualityScores;