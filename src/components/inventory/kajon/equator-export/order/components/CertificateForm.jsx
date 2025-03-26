
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';

const CertificateForm = ({ onBack }) => {
  // State for selected certificate type
  const [certificateType, setCertificateType] = useState('coo');
  
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Certificate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Certificate Type Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Certificate Type</h3>
          <Select defaultValue={certificateType} onValueChange={setCertificateType}>
            <SelectTrigger id="certificate-type">
              <SelectValue placeholder="Select certificate type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coo">Certificate of Origin</SelectItem>
              <SelectItem value="phyto">Phytosanitary Certificate</SelectItem>
              <SelectItem value="quality">Quality Control Certificate</SelectItem>
              <SelectItem value="ico">ICO Certificate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shipment Reference Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipment Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search shipments..." />
            </div>
            <Select defaultValue="dn-2024-001">
              <SelectTrigger id="shipment">
                <SelectValue placeholder="Select shipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dn-2024-001">DN-2024-001 - Starbucks Corp.</SelectItem>
                <SelectItem value="dn-2024-002">DN-2024-002 - Dunkin Donuts</SelectItem>
                <SelectItem value="dn-2024-004">DN-2024-004 - Blue Bottle Coffee</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Load Shipment Data</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certificate Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Certificate Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="certificate-number">Certificate Number</Label>
              <Input id="certificate-number" placeholder={
                certificateType === 'coo' 
                  ? 'COO-2024-005' 
                  : certificateType === 'phyto' 
                  ? 'PHY-2024-005' 
                  : certificateType === 'quality' 
                  ? 'QCC-2024-005' 
                  : 'ICO-2024-005'
              } />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Issue Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="date" type="date" defaultValue={today} className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issuing-authority">Issuing Authority</Label>
              <Input 
                id="issuing-authority" 
                placeholder="Enter issuing authority" 
                defaultValue={
                  certificateType === 'coo' 
                    ? 'Uganda Export Promotion Board' 
                    : certificateType === 'phyto' 
                    ? 'Ministry of Agriculture' 
                    : certificateType === 'quality' 
                    ? 'Uganda Coffee Development Authority' 
                    : 'International Coffee Organization'
                } 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="draft">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exporter/Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Exporter/Customer Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="exporter">Exporter</Label>
              <Input id="exporter" placeholder="Enter exporter name" defaultValue="KAJON Coffee Limited" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer/Consignee</Label>
              <Input id="customer" placeholder="Enter customer name" defaultValue="Starbucks Corp." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select destination country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="it">Italy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination-address">Destination Address</Label>
              <Textarea 
                id="destination-address" 
                placeholder="Enter destination address" 
                defaultValue="1912 Pike Place, Seattle, WA 98101, USA"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-description">Product Description</Label>
              <Textarea 
                id="product-description" 
                placeholder="Enter product description" 
                defaultValue="Arabica Coffee Beans (AA Grade)"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hs-code">HS Code</Label>
              <Input id="hs-code" placeholder="Enter HS code" defaultValue="0901.11.00" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" min="0" defaultValue="10" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select defaultValue="mt">
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mt">Metric Tons (MT)</SelectItem>
                  <SelectItem value="kg">Kilograms (KG)</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="packaging">Packaging</Label>
              <Input id="packaging" placeholder="Enter packaging details" defaultValue="400 jute bags, 25kg each" />
            </div>
          </div>
        </div>

        {/* Certificate Specific Fields */}
        {certificateType === 'coo' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Certificate of Origin Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin-criteria">Origin Criteria</Label>
                <Input id="origin-criteria" placeholder="Enter origin criteria" defaultValue="Wholly obtained" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trade-agreement">Trade Agreement</Label>
                <Input id="trade-agreement" placeholder="Enter trade agreement" defaultValue="AGOA" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="origin-declaration">Origin Declaration</Label>
              <Textarea 
                id="origin-declaration" 
                placeholder="Enter origin declaration" 
                defaultValue="The undersigned hereby declares that the above details and statements are correct and that all the goods were produced in Uganda."
                rows={3}
              />
            </div>
          </div>
        )}

        {certificateType === 'phyto' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Phytosanitary Certificate Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Input id="treatment" placeholder="Enter treatment details" defaultValue="Fumigation with Methyl Bromide" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="treatment-date">Treatment Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="treatment-date" type="date" className="pl-10" defaultValue={format(new Date(new Date().setDate(new Date().getDate() - 5)), 'yyyy-MM-dd')} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phyto-declaration">Phytosanitary Declaration</Label>
              <Textarea 
                id="phyto-declaration" 
                placeholder="Enter phytosanitary declaration" 
                defaultValue="This is to certify that the plants, plant products or other regulated articles described herein have been inspected and/or tested according to appropriate official procedures and are considered to be free from the quarantine pests specified by the importing country and to conform with the current phytosanitary requirements of the importing country."
                rows={4}
              />
            </div>
          </div>
        )}

        {certificateType === 'quality' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quality Certificate Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input id="grade" placeholder="Enter grade" defaultValue="AA" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture Content (%)</Label>
                <Input id="moisture" type="number" min="0" max="100" step="0.1" defaultValue="10.5" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defects">Defects (%)</Label>
                <Input id="defects" type="number" min="0" max="100" step="0.1" defaultValue="2.3" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="screen-size">Screen Size</Label>
                <Input id="screen-size" placeholder="Enter screen size" defaultValue="18+" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="density">Density (g/L)</Label>
                <Input id="density" type="number" min="0" step="0.1" defaultValue="700.5" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cupping-notes">Cupping Notes</Label>
              <Textarea 
                id="cupping-notes" 
                placeholder="Enter cupping notes" 
                defaultValue="Bright acidity, medium body, notes of caramel, chocolate, and citrus. Clean finish with a pleasant aftertaste."
                rows={3}
              />
            </div>
          </div>
        )}

        {certificateType === 'ico' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">ICO Certificate Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ico-code">ICO Country Code</Label>
                <Input id="ico-code" placeholder="Enter ICO country code" defaultValue="UG" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ico-member">ICO Member Number</Label>
                <Input id="ico-member" placeholder="Enter ICO member number" defaultValue="123456" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coffee-type">Coffee Type</Label>
                <Select defaultValue="arabica">
                  <SelectTrigger id="coffee-type">
                    <SelectValue placeholder="Select coffee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arabica">Arabica</SelectItem>
                    <SelectItem value="robusta">Robusta</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="processing">Processing Method</Label>
                <Select defaultValue="washed">
                  <SelectTrigger id="processing">
                    <SelectValue placeholder="Select processing method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="washed">Washed/Wet</SelectItem>
                    <SelectItem value="natural">Natural/Dry</SelectItem>
                    <SelectItem value="honey">Honey/Pulped Natural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ico-validity">Validity Period</Label>
              <Input id="ico-validity" placeholder="Enter validity period" defaultValue="9 months from date of issue" />
            </div>
          </div>
        )}

        {/* Shipping Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipping Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="port-loading">Port of Loading</Label>
              <Input id="port-loading" placeholder="Enter port of loading" defaultValue="Mombasa, Kenya" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port-discharge">Port of Discharge</Label>
              <Input id="port-discharge" placeholder="Enter port of discharge" defaultValue="Seattle, USA" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vessel">Vessel/Flight Name</Label>
              <Input id="vessel" placeholder="Enter vessel or flight name" defaultValue="Maersk Sealand" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bill-lading">Bill of Lading/AWB No.</Label>
              <Input id="bill-lading" placeholder="Enter bill of lading or AWB number" defaultValue="MSK123456789" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shipping-marks">Shipping Marks</Label>
              <Input id="shipping-marks" placeholder="Enter shipping marks" defaultValue="KAJON 2024/001-400" />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-2">
          <Label htmlFor="additional-info">Additional Information</Label>
          <Textarea id="additional-info" placeholder="Enter any additional information" rows={3} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>Cancel</Button>
          <div className="space-x-2">
            <Button variant="outline">Save as Draft</Button>
            <Button>Create Certificate</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateForm;
