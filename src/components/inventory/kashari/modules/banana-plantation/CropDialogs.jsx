
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CropForm from './CropForm';

export const AddCropDialog = ({ isOpen, setIsOpen, form, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Add New Crop</DialogTitle>
        </DialogHeader>
        <CropForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export const EditCropDialog = ({ isOpen, setIsOpen, form, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Edit Crop</DialogTitle>
        </DialogHeader>
        <CropForm form={form} onSubmit={onSubmit} isEdit={true} />
      </DialogContent>
    </Dialog>
  );
};

export const DeleteCropDialog = ({ isOpen, setIsOpen, cropToDelete, handleDeleteCrop }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this crop record? This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => handleDeleteCrop(cropToDelete?.id)}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
