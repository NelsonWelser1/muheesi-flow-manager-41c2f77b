
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
            alt="KAJON Limited" 
            className="h-16 w-auto mb-2"
          />
          <h2 className="text-lg font-bold">KAJON Limited</h2>
          <p className="text-sm text-gray-600">Kanoni, Kazo District, Uganda</p>
          <p className="text-sm text-gray-600">6th floor, Arie Towers, Mackinnon Road, Nakasero</p>
          <p className="text-sm text-gray-600">Kampala, Uganda, 256</p>
          <p className="text-sm text-gray-600">Tel: +256 776 670680 / +256 757 757517</p>
          <p className="text-sm text-gray-600">Email: kajonlimited@gmail.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-green-800">AGRICULTURAL PRODUCE CERTIFICATE</h1>
          <p className="text-sm text-gray-600 mt-2">
            Certificate #: <EditableField field="documentNumber" defaultValue="KL-GPC-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date Issued: <EditableField field="issueDate" defaultValue="2024-05-01" />
          </p>
          <p className="text-sm text-gray-600">
            Valid Until: <EditableField field="expiryDate" defaultValue="2024-12-31" />
          </p>
        </div>
      </div>

      {/* Product Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PRODUCT INFORMATION</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Type</th>
              <th className="border border-gray-300 p-2 text-left">Variety</th>
              <th className="border border-gray-300 p-2 text-left">Origin</th>
              <th className="border border-gray-300 p-2 text-left">Harvest Period</th>
              <th className="border border-gray-300 p-2 text-left">Processing Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceType" defaultValue="Maize" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceVariety" defaultValue="Longe 5" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceOrigin" defaultValue="Kazo, Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestPeriod" defaultValue="March-May 2024" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="processingMethod" defaultValue="Sun-dried" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceType2" defaultValue="Beans" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceVariety2" defaultValue="K132" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceOrigin2" defaultValue="Kanoni, Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestPeriod2" defaultValue="Feb-Apr 2024" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="processingMethod2" defaultValue="Threshed" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SHIPMENT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Total Quantity:</p>
            <p className="text-sm"><EditableField field="totalQuantity" defaultValue="40,000 kg" /></p>
            
            <p className="font-semibold mt-2">Shipment Reference:</p>
            <p className="text-sm"><EditableField field="shipmentRef" defaultValue="SHP-2024-002" /></p>
            
            <p className="font-semibold mt-2">Container Number:</p>
            <p className="text-sm"><EditableField field="containerNumber" defaultValue="MSCU7654321" /></p>
          </div>
          <div>
            <p className="font-semibold">Port of Loading:</p>
            <p className="text-sm"><EditableField field="loadingPort" defaultValue="Mombasa, Kenya" /></p>
            
            <p className="font-semibold mt-2">Final Destination:</p>
            <p className="text-sm"><EditableField field="destination" defaultValue="Rotterdam, Netherlands" /></p>
            
            <p className="font-semibold mt-2">Vessel/Flight:</p>
            <p className="text-sm"><EditableField field="transportVessel" defaultValue="MSC Isabella" /></p>
          </div>
        </div>
      </div>

      {/* Quality Parameters */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">QUALITY PARAMETERS</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Maize:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="maizeParams" 
                defaultValue="Moisture content: 12.5%
Foreign matter: <1%
Broken kernels: <2%
Insect damage: None
Aflatoxin: <5ppb
Color: Yellow" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Beans:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="beanParams" 
                defaultValue="Moisture content: 11.8%
Foreign matter: <0.5%
Broken seeds: <1%
Insect damage: None
Size: Medium-Large
Color: Red mottled" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Compliance */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">EXPORT COMPLIANCE</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Document Type</th>
              <th className="border border-gray-300 p-2 text-left">Reference Number</th>
              <th className="border border-gray-300 p-2 text-left">Issuing Authority</th>
              <th className="border border-gray-300 p-2 text-left">Date Issued</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="docType1" defaultValue="Phytosanitary Certificate" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docRef1" defaultValue="UG-PHY-24-0456" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docAuth1" defaultValue="Ministry of Agriculture" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docDate1" defaultValue="2024-04-28" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="docType2" defaultValue="Certificate of Origin" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docRef2" defaultValue="UG-CO-24-5672" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docAuth2" defaultValue="Uganda Export Promotion Board" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docDate2" defaultValue="2024-04-29" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="docType3" defaultValue="Quality Certificate" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docRef3" defaultValue="UG-QC-24-7891" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docAuth3" defaultValue="Uganda National Bureau of Standards" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docDate3" defaultValue="2024-04-30" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Certification & Traceability */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">CERTIFICATION & TRACEABILITY</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Certification Standards:</p>
              <ul className="text-sm list-disc pl-4">
                <li><EditableField field="cert1" defaultValue="Global G.A.P" /></li>
                <li><EditableField field="cert2" defaultValue="ISO 22000" /></li>
                <li><EditableField field="cert3" defaultValue="Organic EU" /></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Traceability Information:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Farm Group ID: <EditableField field="farmGroupId" defaultValue="KZF-2024-15" /></li>
                <li>Processing Station: <EditableField field="processingStation" defaultValue="Kazo Central Processing Facility" /></li>
                <li>Lot Number: <EditableField field="lotNumber" defaultValue="KZL-GEN-24-0045" /></li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-4">
            <EditableField 
              field="traceabilityInfo" 
              defaultValue="Full traceability from farm to export is maintained in accordance with certification requirements. Digital tracking system implemented with QR code verification available for buyers." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>
      
      {/* Declaration */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-green-800">DECLARATION</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-sm">
            <EditableField 
              field="declaration" 
              defaultValue="We hereby certify that the agricultural produce described above is of Uganda origin, produced during the stated harvest period, and processed according to international standards. The produce meets all quality parameters required for export and complies with the phytosanitary regulations of both Uganda and the destination country." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>

      {/* Authorized Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">QUALITY CONTROL MANAGER</p>
          <p className="text-sm">Name: <EditableField field="qcManagerName" defaultValue="John Mukiibi" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">EXPORT DIRECTOR</p>
          <p className="text-sm">Name: <EditableField field="exportDirName" defaultValue="Sarah Namulondo" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
      </div>

      {/* Official Stamps */}
      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-gray-500">[UNBS Stamp]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Company Seal]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Chamber of Commerce]</p>
        </div>
      </div>

      {/* QR Code */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 mb-1">Scan to verify certificate authenticity</p>
        <div className="inline-block p-4 bg-gray-100 rounded-md">
          <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-xs">QR Code</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralProduceComplianceTemplate;
