import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Pill, Car, ShoppingBag, Phone, LockKeyhole } from "lucide-react";
import { Button } from "../ui/button";
import { OverlayText } from "./OverlayText";
const BlurredConciergeService = ({ RestrictedText }: { RestrictedText: string }) => {
    const renderServiceButton = (service: string, icon: React.ReactNode) => {
        return (
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            {icon}
            <span>{service}</span>
          </Button>
        );
  };
    return (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Concierge Services</CardTitle>
          </CardHeader>
          <div className="relative">
          <CardContent className="grid grid-cols-2 gap-4 blur-sm pointer-events-none opacity-90">
            {renderServiceButton("Medicine Delivery", <Pill className="h-6 w-6" />)}
            {renderServiceButton("Cab Booking", <Car className="h-6 w-6" />)}
            {renderServiceButton("Grocery Shopping", <ShoppingBag className="h-6 w-6" />)}
            {renderServiceButton("Other Assistance", <Phone className="h-6 w-6" />)}
          </CardContent>
    
          {/* Overlay Text */}
          <OverlayText RestrictedText={RestrictedText} />
        </div>
        </Card>
      );
}
export default BlurredConciergeService;