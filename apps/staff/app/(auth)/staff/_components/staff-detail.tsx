"use client";

import { StaffTypes } from '@/types/staff.types';
import { Button } from '@workspace/ui/components/button';
import { Mail, Phone, MapPin, Briefcase, Building2, Calendar, Shield, Globe, Pencil } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { formatPhoneNumber } from '@/lib/helpers';

interface StaffDetailProps {
  staff: StaffTypes | null;
}

const StaffDetail = ({ staff }: StaffDetailProps) => {
  if (!staff) return null;

  const data = staff; 
  const joined = data.joinedAt ? new Date(data.joinedAt) : null;

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant={'default'} className="flex-1 flex items-center justify-center gap-2">
          View Details
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>{data.name}</DrawerTitle>
              <Button variant="ghost" size="icon">
                <Pencil />
              </Button>
          </div>
          <DrawerDescription>{data.position} at {data.division?.name}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="text-muted-foreground" />
            <span>{data.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="text-muted-foreground" />
            <span>{formatPhoneNumber(data.phoneNumber)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="text-muted-foreground" />
            <span>{data.coverArea}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="text-muted-foreground" />
            <span>{data.position}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="text-muted-foreground" />
            <span>{data.division?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="text-muted-foreground" />
            <span>Joined on {joined ? joined.toLocaleDateString("id-ID") : "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="text-muted-foreground" />
            <span>Role: {data.division?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="text-muted-foreground" />
            <span>{data.coverArea}</span>
          </div>
          <div>
            <p className='text-green-500'>created by : {data.createdBy?.id}</p>
          </div>
          <div>
            <p className='text-green-500'>Last updated : {data.updatedAt.toLocaleString()}</p>
            <p>Updated by: {data.updatedById}</p>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
              <Button variant="outline">
                Close
              </Button>
            </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
export default StaffDetail;
