import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const QualityScores = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};

export default QualityScores;