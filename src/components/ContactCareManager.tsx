import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Phone, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { contactCMRequest } from "@/requests/contactCMReques";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { toast } from '@/hooks/use-toast';

const ContactCareManager = () => {
    const { username } = useAppSelector((state) => state.auth);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [CMDetails, setCMdetails] = useState<any>(null);
    const handleContact = async () => {
        setLoading(true);
        const message = await contactCMRequest(username);
        toast({
          title: "Mail sent to Care Manager",
          description: `${message}`,
        });
        setLoading(false);
      };
    return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-primary/10 shadow-lg">
    <CardHeader>
      <CardTitle className="text-primary">Support</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-primary" />
          <p className="text-gray-700">{CMDetails?.care_manager?.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-primary" />
          <p className="text-gray-700">{CMDetails?.care_manager?.phone_number}</p>
        </div>
      </div>
      <Button 
        className="w-full bg-primary hover:bg-primary/90" 
        onClick={handleContact}
        disabled={!CMDetails?.care_manager?.email || !CMDetails?.care_manager?.phone_number}>
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5 text-white" />
        ) : (
          'Contact Care Manager'
        )}
      </Button>
    </CardContent>
  </Card>);
}