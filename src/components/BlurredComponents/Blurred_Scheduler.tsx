import { TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { OverlayText } from "./OverlayText";

export const BlurredScheduler = ({ RestrictedText }: { RestrictedText: string }) => {
    return (
        <div className="relative">
        <TabsContent value="care_manager" className="space-y-4 blur-sm pointer-events-none opacity-90">
          <div className="p-4 bg-gray-50 rounded-lg ">
            <h3 className="font-medium mb-2">Next Scheduled Visit</h3>
              <p className="text-sm text-gray-600">No scheduled visit</p>
            <Button variant="outline" className="mt-2" >
              Reschedule
            </Button>
          </div>
        
      </TabsContent>
      <OverlayText RestrictedText={RestrictedText} />
      </div>
    )
}