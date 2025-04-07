import React from 'react';
import { Heart } from 'lucide-react';
import { BsFiletypePdf } from "react-icons/bs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MedicalInfoProps {
  medicalInfo: {
    healthConditions: string;
    allergies: string;
    surgeries: string;
    doctorName: string;
    doctorContact: string;
    preferredHospital: string;
    PrescsUrl: string;
  };
}

export const MedicalInfoCard = ({ medicalInfo }: MedicalInfoProps) => {




  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Medical Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Health Conditions</p>
            <p className="font-medium">{medicalInfo.healthConditions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Allergies</p>
            <p className="font-medium">{medicalInfo.allergies}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Past Surgeries</p>
            <p className="font-medium">{medicalInfo.surgeries}</p>
          </div>
          <div>
              <p className="text-sm text-gray-500">Preferred Doctor</p>
              <p className="font-medium">{medicalInfo.doctorName}</p>
          </div>
          <div>
              <p className="text-sm text-gray-500">Doctor's Contact</p>
              <p className="font-medium">{medicalInfo.doctorContact}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Preferred Hospital/Clinic</p>
            <p className="font-medium">{medicalInfo.preferredHospital}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};