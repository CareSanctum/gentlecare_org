import React, { useState, useEffect } from 'react';
import { User, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarWithCamera } from "@/components/ui/avatar";
import { useAppSelector } from '@/store/hooks';
import { sendfileRequest } from '@/requests/sendfileRequest';
import { viewRequest } from '@/requests/viewRequest';
interface PersonalInfoProps {
  personalInfo: {
    fullName: string;
    dob: string;
    gender: string;
    bloodGroup: string;
    height: string;
    weight: string;
    wakeUpTime?: string;
    image_url: string;
    currentLocation: {
      status: "home" | "travelling";
      expectedReturn?: string;
    };
  };
}

export const PersonalInfoCard = ({ personalInfo }: PersonalInfoProps) => {
  const {username, accessToken} = useAppSelector((state) => state.auth);
  const [profile_url, setprofile_url] = useState("");

  const fetchprofilePicture = async () => {
    try {
      const data = await viewRequest(username);  // Call the function
      setprofile_url(data?.patient?.profile_picture_url || personalInfo.image_url);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleFileUpload = async (file: File) =>{
    const sanitizedFileName = file.name.replace(/\s+/g, "_"); 
    const formData = new FormData();
    formData.append("file", new File([file], sanitizedFileName, { type: file.type })); // Append the file with a field name "file"
    formData.append("name", "profile_picture");
    formData.append("user_name", username);
    try {
      // ✅ Show a loading state (optional)
      setprofile_url("");  
  
      // ✅ Upload file to the backend first
      await sendfileRequest(formData);
  
      // ✅ Only update profile_url after getting a successful response
      fetchprofilePicture();
    } catch (error) {
      console.error("Upload failed:", error);
      // ❌ Show an error message (optional)
      alert("Failed to upload profile picture. Please try again.");
    }
  }
  useEffect(() => {
    fetchprofilePicture();  // Run the function on mount
  }, [username]);
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <AvatarWithCamera className="h-32 w-32" handleFileUpload={handleFileUpload}>
            <AvatarImage src={profile_url} alt={personalInfo.fullName} />
            <AvatarFallback>
              <User className="h-16 w-16" />
            </AvatarFallback>
          </AvatarWithCamera>
        </div>
        <CardTitle className="text-2xl">{personalInfo.fullName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">{new Date(personalInfo.dob).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{personalInfo.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Blood Group</p>
            <p className="font-medium">{personalInfo.bloodGroup}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Height(cm)</p>
            <p className="font-medium">{personalInfo.height}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight(kg)</p>
            <p className="font-medium">{personalInfo.weight}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wake Up Time</p>
            <p className="font-medium">{personalInfo.wakeUpTime || "6:00 AM"}</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="font-medium">
            {personalInfo.currentLocation.status === "home" 
              ? "At Home" 
              : `Travelling (Expected Return: ${personalInfo.currentLocation.expectedReturn})`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};