import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LockKeyhole } from "lucide-react";
import { OverlayText } from "./OverlayText";
const BlurredCommunityEvents = ({ RestrictedText }: { RestrictedText: string }) => {
    return (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Community Events</CardTitle>
          </CardHeader>
          <div className="relative">
          <CardContent className="blur-sm pointer-events-none opacity-90">
            <div className="h-[300px] pr-4">
                <div className="mb-4 p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium"></h4>
                      <p className="text-sm text-muted-foreground"></p>
                      <p className="text-sm text-muted-foreground"></p>
                    </div>
                    {/* <Badge variant={event.status === 'upcoming' ? 'secondary' : 'outline'}>
                      {event.status}
                    </Badge> */}
                  </div>
                  {
                    <Button 
                      className="w-full mt-2" 
                      variant="outline"
                    >
                      Register
                    </Button>
                  }
                  {/* {event.status === 'past' && event.registered && (
                    <Badge variant="outline" className="mt-2">
                      Attended
                    </Badge>
                  )} */}
                </div>
                <div className="mb-4 p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium"></h4>
                      <p className="text-sm text-muted-foreground"></p>
                      <p className="text-sm text-muted-foreground"></p>
                    </div>
                    {/* <Badge variant={event.status === 'upcoming' ? 'secondary' : 'outline'}>
                      {event.status}
                    </Badge> */}
                  </div>
                  {
                    <Button 
                      className="w-full mt-2" 
                      variant="outline"
                    >
                      Register
                    </Button>
                  }
                  {/* {event.status === 'past' && event.registered && (
                    <Badge variant="outline" className="mt-2">
                      Attended
                    </Badge>
                  )} */}
                </div>
              
            </div>
          </CardContent>
          <OverlayText RestrictedText={RestrictedText} />
          </div>
        </Card>
      );
}

export default BlurredCommunityEvents;