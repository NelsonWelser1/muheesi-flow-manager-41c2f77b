
import React from 'react';

const PrintableContent = ({ printableContentRef, selectedNote }) => {
  if (!selectedNote) return null;
  
  return (
    <div className="hidden">
      <div ref={printableContentRef} className="p-8">
        <h1 className="text-2xl font-bold text-center">DELIVERY NOTE</h1>
        <p className="text-center mb-6">Document No: DN-{selectedNote.id.slice(0, 8)}</p>
        
        <div className="text-center mb-6">
          <p className="font-bold">Grand Berna Dairies</p>
          <p>8339 Entebbe Town, Uganda</p>
          <p>Tel: +256 757 757 517 / +256 776 670680</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-2 mb-4">Delivery Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Order Reference:</p>
              <p>{selectedNote.orderReference}</p>
            </div>
            <div>
              <p className="font-medium">Delivery Date:</p>
              <p>{new Date(selectedNote.deliveryDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Status:</p>
              <p>{selectedNote.deliveryStatus}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-2 mb-4">Receiver Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Receiver Name:</p>
              <p>{selectedNote.receiverName}</p>
            </div>
            <div>
              <p className="font-medium">Contact:</p>
              <p>{selectedNote.receiverContact}</p>
            </div>
            <div>
              <p className="font-medium">Location:</p>
              <p>{selectedNote.deliveryLocation}</p>
            </div>
            <div>
              <p className="font-medium">Delivery Person:</p>
              <p>{selectedNote.deliveryPerson}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b pb-2 mb-4">Delivered Items</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Item</th>
                <th className="border border-gray-300 p-2 text-left">Quantity</th>
                <th className="border border-gray-300 p-2 text-left">Unit</th>
              </tr>
            </thead>
            <tbody>
              {selectedNote.items && Array.isArray(selectedNote.items) && selectedNote.items.length > 0 ? (
                selectedNote.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{item.name}</td>
                    <td className="border border-gray-300 p-2">{item.quantity}</td>
                    <td className="border border-gray-300 p-2">{item.unit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border border-gray-300 p-2 text-center">No items</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between mt-12">
          <div className="w-5/12">
            <p>Delivered by:</p>
            <div className="border-t border-black h-8 mt-10"></div>
            <p>Name: {selectedNote.deliveryPerson}</p>
            <p>Date: ____________________</p>
          </div>
          
          <div className="w-5/12">
            <p>Received by:</p>
            <div className="border-t border-black h-8 mt-10"></div>
            <p>Name: {selectedNote.receiverName}</p>
            <p>Date: ____________________</p>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Generated on {new Date().toLocaleString()}</p>
          <p>This is a system-generated document.</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableContent;
