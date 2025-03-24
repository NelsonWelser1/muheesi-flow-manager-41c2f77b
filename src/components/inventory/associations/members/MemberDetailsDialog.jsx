
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import MemberExportActions from './MemberExportActions';
import { Calendar, Coffee, MapPin, Phone, User } from "lucide-react";

const MemberDetailsDialog = ({ member, isOpen, onClose }) => {
  if (!member) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Member Details</AlertDialogTitle>
          <AlertDialogDescription>
            Detailed information about {member.full_name}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="flex flex-col md:flex-row gap-6">
            {member.photo_url && (
              <div className="w-full md:w-1/3">
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src={member.photo_url} 
                    alt={member.full_name} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className={`w-full ${member.photo_url ? 'md:w-2/3' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User size={16} />
                    <span>Member Name</span>
                  </div>
                  <p className="font-medium">{member.full_name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    <span>Location</span>
                  </div>
                  <p className="font-medium">{member.location || 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={16} />
                    <span>Phone</span>
                  </div>
                  <p className="font-medium">{member.phone || 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Coffee size={16} />
                    <span>Coffee Type</span>
                  </div>
                  <p className="font-medium">{member.coffee_type || 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Farm Size</span>
                  </div>
                  <p className="font-medium">{member.farm_size ? `${member.farm_size} hectares` : 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Experience</span>
                  </div>
                  <p className="font-medium">{member.experience ? `${member.experience} years` : 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>Join Date</span>
                  </div>
                  <p className="font-medium">{member.join_date ? new Date(member.join_date).toLocaleDateString() : 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>Last Delivery</span>
                  </div>
                  <p className="font-medium">{member.last_delivery ? new Date(member.last_delivery).toLocaleDateString() : 'N/A'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Member Level</span>
                  </div>
                  <p className="font-medium capitalize">{member.member_level || 'Bronze'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Status</span>
                  </div>
                  <p className="font-medium capitalize">{member.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex justify-between">
          <MemberExportActions members={[]} selectedMember={member} />
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MemberDetailsDialog;
