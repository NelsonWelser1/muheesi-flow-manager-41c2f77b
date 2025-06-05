import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Building2, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import './print-styles.css';

const HandbookViewer = ({ company, onBack }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const generatePDF = () => {
    window.print();
  };

  const companySpecificData = {
    'grand-berna': {
      workingHours: '7:00 AM – 4:00 PM, Monday – Friday',
      salaryDay: '28th of each month',
      leaveEntitlement: '21 working days annually',
      probationPeriod: '6 months',
      contactPhone: '+256 700 123 456',
      contactEmail: 'hr@grandberna.com',
      address: 'Mbarara Industrial Area, Uganda'
    },
    'kajon-coffee': {
      workingHours: '8:00 AM – 5:00 PM, Monday – Friday',
      salaryDay: '25th of each month',
      leaveEntitlement: '20 working days annually',
      probationPeriod: '3 months',
      contactPhone: '+256 700 789 012',
      contactEmail: 'hr@kajoncoffee.com',
      address: 'Kampala Coffee House, Uganda'
    },
    'fresheco-exports': {
      workingHours: '9:00 AM – 5:30 PM, Monday – Friday',
      salaryDay: '30th of each month',
      leaveEntitlement: '22 working days annually',
      probationPeriod: '4 months',
      contactPhone: '+256 700 345 678',
      contactEmail: 'hr@fresheco.com',
      address: 'Entebbe Export Zone, Uganda'
    }
  };

  const data = companySpecificData[company.id] || companySpecificData['grand-berna'];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">Staff Handbook</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Handbook Content */}
      <div ref={printRef} className="handbook-content bg-white">
        <Card className="max-w-4xl mx-auto print:shadow-none print:border-none">
          <CardHeader className="text-center border-b bg-gradient-to-r from-blue-50 to-indigo-50 print:bg-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-3xl font-bold text-gray-900">{company.name}</CardTitle>
            </div>
            <h2 className="text-xl text-blue-600 font-semibold">Staff Handbook</h2>
            <p className="text-gray-600 mt-2">Your Guide to Success with Us</p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Welcome Message */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Welcome to Our Team!
              </h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  Dear Team Member,
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Welcome to {company.name}! We are thrilled to have you join our dedicated team. This handbook 
                  serves as your comprehensive guide to our company culture, policies, and procedures. It's designed 
                  to help you understand what we stand for and what you can expect during your journey with us.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We believe that informed employees are empowered employees, and this handbook will help you 
                  navigate your role with confidence and clarity.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 font-medium">
                  Welcome aboard!
                </p>
              </div>
            </section>

            {/* Company Overview */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Company Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Our Mission</h4>
                    <p className="text-gray-700 text-sm">{company.mission}</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-700 mb-2">Our Vision</h4>
                    <p className="text-gray-700 text-sm">{company.vision}</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-4 border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-700 mb-3">Our Core Values</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-800">Integrity</span>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-800">Innovation</span>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-800">Teamwork</span>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-800">Accountability</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Employment Policies */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Employment Policies
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Equal Opportunity Statement</h4>
                    <p className="text-gray-700 text-sm">
                      {company.name} is an equal opportunity employer. We are committed to creating an inclusive 
                      environment where all employees are valued regardless of race, color, religion, gender, 
                      sexual orientation, age, disability, or national origin.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Anti-Harassment & Non-Discrimination</h4>
                    <p className="text-gray-700 text-sm">
                      We maintain a zero-tolerance policy for harassment and discrimination. All employees 
                      deserve to work in a safe and respectful environment.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Probation Period</h4>
                    <p className="text-gray-700 text-sm">
                      New employees serve a probation period of {data.probationPeriod} from their start date, 
                      during which performance and fit are evaluated.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Code of Conduct */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Code of Conduct
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Respectful Behavior</h4>
                    <p className="text-gray-700 text-sm">
                      Treat all colleagues, clients, and partners with dignity and respect.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Attendance & Punctuality</h4>
                    <p className="text-gray-700 text-sm">
                      Regular attendance and punctuality are essential for team success.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Confidentiality</h4>
                    <p className="text-gray-700 text-sm">
                      Maintain strict confidentiality of company and client information.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Professional Standards</h4>
                    <p className="text-gray-700 text-sm">
                      Maintain high standards of work quality and professional conduct.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Compensation and Benefits */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Compensation and Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-800 mb-2">Salary Payment</h4>
                    <p className="text-green-700 text-sm">Paid monthly on the {data.salaryDay}</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-800 mb-2">Annual Leave</h4>
                    <p className="text-blue-700 text-sm">{data.leaveEntitlement}</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-purple-800 mb-2">Health Insurance</h4>
                    <p className="text-purple-700 text-sm">Starts after probation period</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Workplace Procedures */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Workplace Procedures
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Working Hours</h4>
                    <p className="text-gray-700 text-sm">{data.workingHours}</p>
                    <p className="text-gray-600 text-xs mt-1">1-hour lunch break included</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Remote Work Guidelines</h4>
                    <p className="text-gray-700 text-sm">
                      Remote work opportunities may be available based on role requirements and manager approval.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Disciplinary Procedures */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Disciplinary Procedures
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Verbal Warning', 'Written Warning', 'Final Warning', 'Termination'].map((step, index) => (
                  <Card key={step} className="text-center">
                    <CardContent className="p-4">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm">{step}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Health and Safety */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Health and Safety
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Reporting Hazards</h4>
                    <p className="text-gray-700 text-sm">
                      Immediately report any workplace hazards or injuries to your supervisor or HR department.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Emergency Procedures</h4>
                    <p className="text-gray-700 text-sm">
                      Familiarize yourself with emergency exits and procedures. Emergency contacts are posted throughout the facility.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Technology Use */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Technology Use
              </h3>
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Use company devices responsibly and for work-related purposes</li>
                    <li>• Do not install unauthorized software or share passwords</li>
                    <li>• Report any technical issues to the IT department immediately</li>
                    <li>• Follow data security protocols when handling sensitive information</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Contact Information
              </h3>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span>{data.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span>{data.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>{data.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Acknowledgment Form */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-100 pb-2">
                Acknowledgment
              </h3>
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-6">
                  <p className="text-gray-700 text-sm mb-6">
                    I acknowledge that I have received, read, and understood the {company.name} Staff Handbook. 
                    I understand that it is my responsibility to comply with the policies and procedures outlined herein.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name:</label>
                      <div className="border-b border-gray-400 h-8"></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date:</label>
                      <div className="border-b border-gray-400 h-8"></div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Signature:</label>
                    <div className="border-b border-gray-400 h-8"></div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HandbookViewer;
