import { StaffTypes } from '@/types/staff';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { cn } from '@workspace/ui/lib/utils';
import { X, Mail, Phone, MapPin, Briefcase, Building2, Calendar, Shield, Globe } from 'lucide-react';

interface StaffDetailProps {
  staff: StaffTypes;
  onClose: () => void;
}

export default function StaffDetail({ staff, onClose }: StaffDetailProps) {
  return (
    <Dialog>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{staff.name}</DialogTitle>
            </DialogHeader>
            <p>{staff.email}</p>
            <p>{staff.phoneNumber}</p>
                <p>{staff.position}</p>
                <p>{staff.division.name}</p>
                <p>{staff.joinedAt}</p>
                <p>{staff.activeStatus ? "Active" : "Inactive"}</p>
                <p>{staff.isPublished ? "Published" : "Unpublished"}</p>
                <p>{staff.coverArea}</p>
        </DialogContent>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
    </Dialog>
  );
}
