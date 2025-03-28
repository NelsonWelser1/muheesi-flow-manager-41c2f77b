
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const CoffeeComplianceTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-purple-300 p-2"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-purple-300 p-1"
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
          <h1 className="text-2xl font-bold text-purple-800">COFFEE QUALITY CERTIFICATE</h1>
          <p className="text-sm text-gray-600 mt-2">
            Certificate #: <EditableField field="documentNumber" defaultValue="KL-CQC-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date Issued: <EditableField field="issueDate" defaultValue="2024-05-01" />
          </p>
          <p className="text-sm text-gray-600">
            Valid Until: <EditableField field="expiryDate" defaultValue="2024-12-31" />
          </p>
        </div>
      </div>

      {/* Coffee Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-purple-800">COFFEE INFORMATION</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-50">
              <th className="border border-gray-300 p-2 text-left">Coffee Type</th>
              <th className="border border-gray-300 p-2 text-left">Grade</th>
              <th className="border border-gray-300 p-2 text-left">Region</th>
              <th className="border border-gray-300 p-2 text-left">Harvest Period</th>
              <th className="border border-gray-300 p-2 text-left">Processing Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="coffeeType" defaultValue="Arabica" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="coffeeGrade" defaultValue="AA" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="coffeeRegion" defaultValue="Mount Elgon" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestPeriod" defaultValue="October-December 2023" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="processingMethod" defaultValue="Washed" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="coffeeType2" defaultValue="Robusta" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="coffeeGrade2" defaultValue="Screen 18" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="coffeeRegion2" defaultValue="Western Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestPeriod2" defaultValue="January-March 2024" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="processingMethod2" defaultValue="Natural" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sensory Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-purple-800">SENSORY ANALYSIS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-3 bg-purple-50">
            <p className="font-semibold">Arabica:</p>
            <table className="w-full border-collapse mt-2">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Aroma:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="aromaArabica" defaultValue="Floral, citrus, with honey notes" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Flavor:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="flavorArabica" defaultValue="Bright acidity, berry, chocolate finish" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Body:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="bodyArabica" defaultValue="Medium, silky" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Acidity:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="acidityArabica" defaultValue="High, bright" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Aftertaste:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="aftertasteArabica" defaultValue="Sweet, lingering" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Overall Score:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="scoreArabica" defaultValue="86.5/100" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border rounded p-3 bg-purple-50">
            <p className="font-semibold">Robusta:</p>
            <table className="w-full border-collapse mt-2">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Aroma:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="aromaRobusta" defaultValue="Earthy, woody, with nutty notes" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Flavor:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="flavorRobusta" defaultValue="Bold, malty, with slight spice" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Body:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="bodyRobusta" defaultValue="Full, creamy" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Acidity:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="acidityRobusta" defaultValue="Low" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Aftertaste:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="aftertasteRobusta" defaultValue="Smooth, slightly bitter" />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Overall Score:</td>
                  <td className="border border-gray-300 p-2">
                    <EditableField field="scoreRobusta" defaultValue="83/100" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Technical Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-purple-800">TECHNICAL ANALYSIS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-50">
              <th className="border border-gray-300 p-2 text-left">Parameter</th>
              <th className="border border-gray-300 p-2 text-left">Arabica Results</th>
              <th className="border border-gray-300 p-2 text-left">Robusta Results</th>
              <th className="border border-gray-300 p-2 text-left">Standard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-medium">Moisture Content</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="moistureArabica" defaultValue="10.5%" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="moistureRobusta" defaultValue="11.2%" />
              </td>
              <td className="border border-gray-300 p-2">≤ 12.5%</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-medium">Screen Size</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="screenArabica" defaultValue="15+ (94%)" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="screenRobusta" defaultValue="18 (92%)" />
              </td>
              <td className="border border-gray-300 p-2">≥ 90% retention</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-medium">Defects</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="defectsArabica" defaultValue="2 full defects/300g" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="defectsRobusta" defaultValue="5 full defects/300g" />
              </td>
              <td className="border border-gray-300 p-2">≤ 8 full defects/300g</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-medium">Water Activity</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="waterArabica" defaultValue="0.55 aw" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="waterRobusta" defaultValue="0.58 aw" />
              </td>
              <td className="border border-gray-300 p-2">≤ 0.65 aw</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-medium">Density</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="densityArabica" defaultValue="0.74 g/mL" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="densityRobusta" defaultValue="0.69 g/mL" />
              </td>
              <td className="border border-gray-300 p-2">≥ 0.65 g/mL</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-purple-800">SHIPMENT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Total Quantity:</p>
            <p className="text-sm"><EditableField field="totalQuantity" defaultValue="18,000 kg" /></p>
            
            <p className="font-semibold mt-2">Shipment Reference:</p>
            <p className="text-sm"><EditableField field="shipmentRef" defaultValue="SHP-2024-C001" /></p>
            
            <p className="font-semibold mt-2">Container Number:</p>
            <p className="text-sm"><EditableField field="containerNumber" defaultValue="MSCU7654321" /></p>
          </div>
          <div>
            <p className="font-semibold">Port of Loading:</p>
            <p className="text-sm"><EditableField field="loadingPort" defaultValue="Mombasa, Kenya" /></p>
            
            <p className="font-semibold mt-2">Final Destination:</p>
            <p className="text-sm"><EditableField field="destination" defaultValue="Hamburg, Germany" /></p>
            
            <p className="font-semibold mt-2">Vessel/Flight:</p>
            <p className="text-sm"><EditableField field="transportVessel" defaultValue="MSC Isabella" /></p>
          </div>
        </div>
      </div>

      {/* Certification & Traceability */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-purple-800">CERTIFICATION & TRACEABILITY</h3>
        <div className="border rounded p-3 bg-purple-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Certification Standards:</p>
              <ul className="text-sm list-disc pl-4">
                <li><EditableField field="cert1" defaultValue="Rainforest Alliance" /></li>
                <li><EditableField field="cert2" defaultValue="UTZ Certified" /></li>
                <li><EditableField field="cert3" defaultValue="4C (Common Code for the Coffee Community)" /></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Traceability Information:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Farm Group ID: <EditableField field="farmGroupId" defaultValue="KCF-2024-15" /></li>
                <li>Processing Station: <EditableField field="processingStation" defaultValue="Kanoni Central Processing Unit" /></li>
                <li>Lot Number: <EditableField field="lotNumber" defaultValue="KCL-ARB-24-0045" /></li>
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
        <h3 className="text-lg font-bold mb-2 text-purple-800">DECLARATION</h3>
        <div className="border rounded p-3 bg-purple-50">
          <p className="text-sm">
            <EditableField 
              field="declaration" 
              defaultValue="We hereby certify that the coffee described above has been analyzed and meets the quality standards for export. The coffee is free from foreign materials, pests, and contaminants, and complies with all food safety requirements for the destination country. This certificate is issued in accordance with the standards and regulations of the Uganda Coffee Development Authority (UCDA) and international coffee quality criteria." 
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
          <p className="text-sm text-gray-500">[UCDA Stamp]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Company Seal]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[ICO Stamp]</p>
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

export default CoffeeComplianceTemplate;
