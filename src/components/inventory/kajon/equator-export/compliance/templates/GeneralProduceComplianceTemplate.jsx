
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const GeneralProduceComplianceTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-green-300 p-2"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-green-300 p-1"
        />
      );
    }
    
    return isMultiline ? (
      <p className="text-sm">{value}</p>
    ) : (
      <span>{value}</span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none">
      {/* Document Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <img 
            src="/combined-logo.png" 
            alt="KAJON Coffee Limited" 
            className="h-16 w-auto mb-2"
          />
          <h2 className="text-lg font-bold">KAJON Coffee Limited</h2>
          <p className="text-sm text-gray-600">Kanoni, Kazo District, Uganda</p>
          <p className="text-sm text-gray-600">6th floor, Arie Towers, Mackinnon Road, Nakasero</p>
          <p className="text-sm text-gray-600">Kampala, Uganda, 256</p>
          <p className="text-sm text-gray-600">Tel: +256 776 670680 / +256 757 757517</p>
          <p className="text-sm text-gray-600">Email: kajoncoffeelimited@gmail.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-green-800">GENERAL PRODUCE PHYTOSANITARY CERTIFICATE</h1>
          <p className="text-sm text-gray-600 mt-2">
            Certificate #: <EditableField field="documentNumber" defaultValue="KCL-GPC-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date Issued: <EditableField field="issueDate" defaultValue="2024-05-01" />
          </p>
          <p className="text-sm text-gray-600">
            Valid Until: <EditableField field="expiryDate" defaultValue="2024-12-31" />
          </p>
        </div>
      </div>

      {/* Exporter & Importer */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">EXPORTING ORGANIZATION:</h4>
            <p className="text-sm">KAJON Coffee Limited</p>
            <p className="text-sm">Kampala, Uganda</p>
            <p className="text-sm">Registration #: UG2023786541</p>
            <p className="text-sm">Export License: UG-EXP-23456</p>
          </div>
          <div>
            <h4 className="font-semibold">IMPORTING ORGANIZATION:</h4>
            <p className="text-sm">
              <EditableField field="importerName" defaultValue="Global Agricultural Imports Inc." />
            </p>
            <p className="text-sm">
              <EditableField field="importerAddress" defaultValue="123 Trade Avenue, New York, NY 10001, USA" />
            </p>
            <p className="text-sm">
              Registration #: <EditableField field="importerRegistration" defaultValue="US-IMP-789012" />
            </p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PRODUCT DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Commodity</th>
              <th className="border border-gray-300 p-2 text-left">Variety/Type</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (MT)</th>
              <th className="border border-gray-300 p-2 text-left">Origin Region</th>
              <th className="border border-gray-300 p-2 text-left">Harvest Period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="commodity1" defaultValue="Sesame Seeds" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="variety1" defaultValue="Hulled White" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="quantity1" defaultValue="25" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="origin1" defaultValue="Northern Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvest1" defaultValue="Jan-Mar 2024" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="commodity2" defaultValue="Soybeans" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="variety2" defaultValue="Non-GMO" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="quantity2" defaultValue="35" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="origin2" defaultValue="Eastern Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvest2" defaultValue="Feb-Apr 2024" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="commodity3" defaultValue="Maize" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="variety3" defaultValue="White Maize" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="quantity3" defaultValue="50" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="origin3" defaultValue="Central Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvest3" defaultValue="Mar-May 2024" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipment & Transport */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SHIPMENT & TRANSPORT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Shipment Reference:</p>
            <p className="text-sm"><EditableField field="shipmentRef" defaultValue="SHP-2024-001" /></p>
            
            <p className="font-semibold mt-2">Means of Transport:</p>
            <p className="text-sm"><EditableField field="transportMeans" defaultValue="Sea Freight" /></p>
            
            <p className="font-semibold mt-2">Container Numbers:</p>
            <p className="text-sm"><EditableField field="containerNumbers" defaultValue="MSCU1234567, MSCU7654321" /></p>
          </div>
          <div>
            <p className="font-semibold">Port of Loading:</p>
            <p className="text-sm"><EditableField field="loadingPort" defaultValue="Mombasa, Kenya" /></p>
            
            <p className="font-semibold mt-2">Final Destination:</p>
            <p className="text-sm"><EditableField field="destination" defaultValue="Port of New York, USA" /></p>
            
            <p className="font-semibold mt-2">Expected Arrival:</p>
            <p className="text-sm"><EditableField field="expectedArrival" defaultValue="2024-06-15" /></p>
          </div>
        </div>
      </div>

      {/* Treatment & Processing */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">TREATMENT & PROCESSING</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Treatment Type</th>
              <th className="border border-gray-300 p-2 text-left">Chemical/Method</th>
              <th className="border border-gray-300 p-2 text-left">Concentration</th>
              <th className="border border-gray-300 p-2 text-left">Date of Treatment</th>
              <th className="border border-gray-300 p-2 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="treatmentType1" defaultValue="Fumigation" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="chemical1" defaultValue="Phosphine" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="concentration1" defaultValue="2g/m³" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="treatmentDate1" defaultValue="2024-04-20" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="duration1" defaultValue="72 hours" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="treatmentType2" defaultValue="Heat Treatment" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="chemical2" defaultValue="Dry Heat" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="concentration2" defaultValue="60°C" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="treatmentDate2" defaultValue="2024-04-22" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="duration2" defaultValue="30 minutes" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Inspection & Testing */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">INSPECTION & TESTING</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="font-semibold">Inspection Details:</p>
          <p className="text-sm">
            <EditableField 
              field="inspectionDetails" 
              defaultValue="The consignment has been inspected according to appropriate procedures and is considered to be free from quarantine pests, and practically free from other injurious pests, and is considered to conform with the current phytosanitary requirements of the importing country." 
              isMultiline={true}
            />
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="font-semibold">Laboratory Tests Conducted:</p>
              <ul className="text-sm list-disc pl-4">
                <li><EditableField field="test1" defaultValue="Moisture Content Analysis" /></li>
                <li><EditableField field="test2" defaultValue="Foreign Matter Assessment" /></li>
                <li><EditableField field="test3" defaultValue="Microbiological Testing" /></li>
                <li><EditableField field="test4" defaultValue="Pesticide Residue Analysis" /></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Test Results:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Moisture: <EditableField field="moisture" defaultValue="Within acceptable limits (8-12%)" /></li>
                <li>Foreign Matter: <EditableField field="foreignMatter" defaultValue="Less than 1%" /></li>
                <li>Microbiological Status: <EditableField field="microbiological" defaultValue="Compliant with EU standards" /></li>
                <li>Pesticide Residues: <EditableField field="pesticide" defaultValue="Below MRL (Maximum Residue Levels)" /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Declarations */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">ADDITIONAL DECLARATIONS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-sm">
            <EditableField 
              field="additionalDeclarations" 
              defaultValue="This is to certify that the plants, plant products or other regulated articles described herein have been inspected and/or tested according to appropriate official procedures and are considered to be free from the quarantine pests specified by the importing country and to conform with the current phytosanitary requirements of the importing country, including those for regulated non-quarantine pests.

The products are free from:
1. Live insects, mites, and other pests
2. Soil and plant debris
3. Signs of disease or infection
4. Genetically modified organisms (GMO)

All products are sourced from areas free from specific quarantine pests of concern to the United States including Trogoderma granarium (Khapra Beetle)." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>

      {/* Authorized Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">CERTIFYING OFFICER</p>
          <p className="text-sm">Name: <EditableField field="certOfficerName" defaultValue="Dr. James Okello" /></p>
          <p className="text-sm mt-2">Position: <EditableField field="certOfficerPosition" defaultValue="Senior Plant Health Inspector" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">AUTHORIZED REPRESENTATIVE</p>
          <p className="text-sm">Name: <EditableField field="authRepName" defaultValue="John Mulumba" /></p>
          <p className="text-sm mt-2">Position: <EditableField field="authRepPosition" defaultValue="Export Compliance Manager" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
      </div>

      {/* Official Stamps */}
      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-gray-500">[Ministry of Agriculture Stamp]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Company Seal]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Plant Protection Authority]</p>
        </div>
      </div>

      {/* QR Code and Notes */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-xs text-gray-600 max-w-md">
          <p>This certificate is electronically verifiable and is valid without signature and stamp when presented with the corresponding QR code verification.</p>
          <p className="mt-1">Certificate issued in accordance with International Plant Protection Convention (IPPC) guidelines.</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Scan to verify</p>
          <div className="inline-block p-4 bg-gray-100 rounded-md">
            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-xs">QR Code</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralProduceComplianceTemplate;
