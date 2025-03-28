
import React from 'react';
import { format } from 'date-fns';
import { Check, Award, Sprout, CalendarRange, Package, FileText, Clipboard, Globe, ShieldCheck } from 'lucide-react';

const GeneralProduceComplianceTemplate = ({ data = {}, editMode = false, onDataChange }) => {
  const handleChange = (field, value) => {
    if (editMode && onDataChange) {
      onDataChange(field, value);
    }
  };
  
  const renderEditableField = (fieldName, value, placeholder, type = "text") => {
    return editMode ? (
      <input
        type={type}
        className="editable-field w-full p-1 border-b border-dashed"
        value={value || ""}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <div className="py-1">{value || placeholder}</div>
    );
  };
  
  const renderEditableSelect = (fieldName, value, options, placeholder) => {
    return editMode ? (
      <select
        className="editable-field w-full p-1 border-b border-dashed"
        value={value || ""}
        onChange={(e) => handleChange(fieldName, e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <div className="py-1">{value || placeholder}</div>
    );
  };
  
  // Default data
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const expiryDate = format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd');
  
  // Template data with defaults
  const {
    documentNumber = `GEN-CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    issueDate = currentDate,
    expiryDate: expiry = expiryDate,
    produceType = "",
    produceVariety = "",
    originCountry = "Uganda",
    growingRegion = "",
    harvestSeason = "",
    certificationStandards = "",
    batchNumber = `BATCH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    exportDestination = "",
    exporterName = "KAJON Limited",
    exporterAddress = "Plot 123, Kampala Industrial Area, Uganda",
    packagingType = "",
    quantity = "",
    authorizedBy = "",
    notes = "",
  } = data;

  return (
    <div className="bg-white p-6 max-w-4xl mx-auto">
      {/* Edit mode indicator */}
      {editMode && (
        <div className="edit-mode-indicator">
          EDIT MODE - Fields with dashed borders can be edited
        </div>
      )}
      
      {/* Header with logo and title */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <img 
            src="/combined-logo.png" 
            alt="KAJON Limited" 
            className="h-16 w-auto" 
          />
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGRICULTURAL PRODUCE CERTIFICATE</h1>
            <p className="text-gray-600">Export Quality & Standards Compliance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold flex items-center gap-1">
            <FileText size={16} />
            Document #: {renderEditableField("documentNumber", documentNumber, "Auto-generated")}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Issue Date:</span> {renderEditableField("issueDate", issueDate, "Select date", "date")}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Expiry Date:</span> {renderEditableField("expiryDate", expiry, "Select date", "date")}
          </p>
        </div>
      </div>
      
      {/* Produce Details Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-green-50 p-2 border-l-4 border-green-500 mb-3 flex items-center">
          <Sprout size={18} className="mr-2" /> Produce Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Produce Type:</p>
            {renderEditableSelect("produceType", produceType, [
              "Grains",
              "Pulses",
              "Oilseeds",
              "Cotton",
              "Cocoa",
              "Vanilla",
              "Tea",
              "Spices",
              "Other"
            ], "Select produce type")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Variety/Grade:</p>
            {renderEditableField("produceVariety", produceVariety, "Enter variety or grade")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Country of Origin:</p>
            {renderEditableField("originCountry", originCountry, "Enter origin country")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Growing Region:</p>
            {renderEditableField("growingRegion", growingRegion, "Enter growing region")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Harvest Season:</p>
            {renderEditableField("harvestSeason", harvestSeason, "Enter harvest season/period")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Batch Number:</p>
            {renderEditableField("batchNumber", batchNumber, "Enter batch number")}
          </div>
        </div>
      </div>
      
      {/* Export & Packaging Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-green-50 p-2 border-l-4 border-green-500 mb-3 flex items-center">
          <Globe size={18} className="mr-2" /> Export & Packaging Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Export Destination:</p>
            {renderEditableField("exportDestination", exportDestination, "Enter destination country")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Packaging Type:</p>
            {renderEditableSelect("packagingType", packagingType, [
              "Jute Bags",
              "Poly Bags",
              "Sisal Bags",
              "Bulk Containers",
              "Cardboard Boxes",
              "GrainPro Bags",
              "Vacuum Sealed",
              "Other"
            ], "Select packaging type")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Quantity:</p>
            {renderEditableField("quantity", quantity, "Enter quantity and unit")}
          </div>
        </div>
      </div>
      
      {/* Certification Standards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-green-50 p-2 border-l-4 border-green-500 mb-3 flex items-center">
          <ShieldCheck size={18} className="mr-2" /> Certification & Compliance
        </h2>
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Standards & Compliance:</p>
          {renderEditableSelect("certificationStandards", certificationStandards, [
            "Organic - USDA",
            "Organic - EU",
            "Global G.A.P.",
            "Fair Trade",
            "Rainforest Alliance",
            "BRC",
            "ISO 22000",
            "HACCP Compliant",
            "Multiple Standards"
          ], "Select applicable standards")}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border border-gray-400 flex items-center justify-center">
              {(produceType && produceVariety) ? <Check size={12} className="text-green-600" /> : null}
            </div>
            <span className="text-sm">Quality Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border border-gray-400 flex items-center justify-center">
              {(batchNumber && originCountry) ? <Check size={12} className="text-green-600" /> : null}
            </div>
            <span className="text-sm">Traceability Requirements</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border border-gray-400 flex items-center justify-center">
              {(certificationStandards) ? <Check size={12} className="text-green-600" /> : null}
            </div>
            <span className="text-sm">Certification Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border border-gray-400 flex items-center justify-center">
              {(exportDestination && packagingType) ? <Check size={12} className="text-green-600" /> : null}
            </div>
            <span className="text-sm">Export Requirements</span>
          </div>
        </div>
      </div>
      
      {/* Exporter Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-green-50 p-2 border-l-4 border-green-500 mb-3 flex items-center">
          <Package size={18} className="mr-2" /> Exporter Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Exporter Name:</p>
            {renderEditableField("exporterName", exporterName, "Enter exporter name")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Exporter Address:</p>
            {renderEditableField("exporterAddress", exporterAddress, "Enter exporter address")}
          </div>
        </div>
      </div>
      
      {/* Additional Notes */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-green-50 p-2 border-l-4 border-green-500 mb-3 flex items-center">
          <Clipboard size={18} className="mr-2" /> Additional Information
        </h2>
        <div>
          <p className="text-sm text-gray-600 font-medium">Notes:</p>
          {editMode ? (
            <textarea
              className="editable-field w-full p-1 border border-dashed"
              value={notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Enter any additional notes or comments"
              rows={3}
            />
          ) : (
            <div className="py-1">{notes || "No additional notes."}</div>
          )}
        </div>
      </div>
      
      {/* Signatures Section */}
      <div className="mt-8 border-t pt-4">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-600 font-medium">Authorized by:</p>
            {renderEditableField("authorizedBy", authorizedBy, "Enter name of authorized person")}
            <div className="mt-8 border-t border-gray-400 pt-1">
              <p className="text-sm text-gray-600">Authorized Signature</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <img 
                src="/combined-logo.png" 
                alt="Company Seal" 
                className="h-16 w-auto inline-block opacity-30" 
              />
            </div>
            <div className="mt-8 border-t border-gray-400 pt-1">
              <p className="text-sm text-gray-600">Official Stamp</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
        <p>This certificate is valid only when signed by an authorized representative of KAJON Limited.</p>
        <p>Document generated on {format(new Date(), 'MMMM dd, yyyy')} | Valid until {format(new Date(expiry || expiryDate), 'MMMM dd, yyyy')}</p>
      </div>
    </div>
  );
};

export default GeneralProduceComplianceTemplate;
