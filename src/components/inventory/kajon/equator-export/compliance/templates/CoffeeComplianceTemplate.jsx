
import React from 'react';
import { format } from 'date-fns';
import { Check, Award, Coffee, CalendarRange, Package, FileText, Clipboard } from 'lucide-react';

const CoffeeComplianceTemplate = ({ data = {}, editMode = false, onDataChange }) => {
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
    documentNumber = `COF-CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    issueDate = currentDate,
    expiryDate: expiry = expiryDate,
    coffeeType = "",
    originCountry = "Uganda",
    processingMethod = "",
    grade = "",
    certificationStandards = "",
    batchNumber = `BATCH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    exportDestination = "",
    exporterName = "KAJON Coffee Limited",
    exporterAddress = "Plot 123, Kampala Industrial Area, Uganda",
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
            alt="KAJON Coffee" 
            className="h-16 w-auto" 
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">CERTIFICATE OF COMPLIANCE</h1>
            <p className="text-gray-600">Coffee Export Quality & Standards</p>
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
      
      {/* Coffee Details Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-blue-50 p-2 border-l-4 border-blue-500 mb-3 flex items-center">
          <Coffee size={18} className="mr-2" /> Coffee Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Coffee Type:</p>
            {renderEditableSelect("coffeeType", coffeeType, [
              "Arabica - Typica",
              "Arabica - Bourbon",
              "Arabica - Geisha",
              "Arabica - SL28",
              "Robusta - Fine",
              "Robusta - Premium",
              "Robusta - Standard",
              "Robusta - Ungraded"
            ], "Select coffee type")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Country of Origin:</p>
            {renderEditableField("originCountry", originCountry, "Enter origin country")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Processing Method:</p>
            {renderEditableSelect("processingMethod", processingMethod, [
              "Washed", 
              "Natural", 
              "Honey", 
              "Pulped Natural", 
              "Wet Hulled", 
              "Other"
            ], "Select processing method")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Grade:</p>
            {renderEditableSelect("grade", grade, [
              "AA", 
              "A", 
              "B", 
              "C", 
              "PB", 
              "E", 
              "F", 
              "AB", 
              "1", 
              "2", 
              "3", 
              "Standard", 
              "Premium"
            ], "Select grade")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Batch Number:</p>
            {renderEditableField("batchNumber", batchNumber, "Enter batch number")}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Export Destination:</p>
            {renderEditableField("exportDestination", exportDestination, "Enter destination country")}
          </div>
        </div>
      </div>
      
      {/* Certification Standards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-blue-50 p-2 border-l-4 border-blue-500 mb-3 flex items-center">
          <Award size={18} className="mr-2" /> Certification Standards
        </h2>
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Standards & Compliance:</p>
          {renderEditableSelect("certificationStandards", certificationStandards, [
            "Organic - USDA",
            "Organic - EU",
            "Rainforest Alliance",
            "Fair Trade",
            "UTZ Certified",
            "4C",
            "Bird Friendly",
            "C.A.F.E. Practices",
            "Multiple Standards"
          ], "Select applicable standards")}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border border-gray-400 flex items-center justify-center">
              {(coffeeType && processingMethod && grade) ? <Check size={12} className="text-green-600" /> : null}
            </div>
            <span className="text-sm">Quality Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border border-gray-400 flex items-center justify-center">
              {(batchNumber) ? <Check size={12} className="text-green-600" /> : null}
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
              {(exportDestination) ? <Check size={12} className="text-green-600" /> : null}
            </div>
            <span className="text-sm">Export Requirements</span>
          </div>
        </div>
      </div>
      
      {/* Exporter Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-blue-50 p-2 border-l-4 border-blue-500 mb-3 flex items-center">
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
        <h2 className="text-lg font-semibold bg-blue-50 p-2 border-l-4 border-blue-500 mb-3 flex items-center">
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
        <p>This certificate is valid only when signed by an authorized representative of KAJON Coffee Limited.</p>
        <p>Document generated on {format(new Date(), 'MMMM dd, yyyy')} | Valid until {format(new Date(expiry || expiryDate), 'MMMM dd, yyyy')}</p>
      </div>
    </div>
  );
};

export default CoffeeComplianceTemplate;
