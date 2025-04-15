
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteCattleDialog = ({ open, onOpenChange, onConfirm, isLoading, cattle }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Cattle</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this cattle? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {cattle && (
          <div className="py-4">
            <p><strong>Tag Number:</strong> {cattle.tag_number}</p>
            {cattle.name && <p><strong>Name:</strong> {cattle.name}</p>}
            <p><strong>Type:</strong> {cattle.cattle_type}</p>
            <p><strong>Breed:</strong> {cattle.breed}</p>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Cattle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCattleDialog;
