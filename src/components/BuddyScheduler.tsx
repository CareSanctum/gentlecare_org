import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoIcon, Calendar as CalendarIcon, User } from 'lucide-react';
import { Input } from './ui/input';
import { useAppSelector } from '@/store/hooks';
import { schedulevisitRequest } from '@/requests/schedulevisitRequest';
import useVisitData from '@/hooks/use-visits';
import { HomepageConfig } from '@/hooks/use-HomeConfig';
import { BlurredScheduler } from './BlurredComponents/Blurred_Scheduler';


const changeDateFormat = (date: string): string => {
  const eventDate = new Date(date);
  const datePart = eventDate.toLocaleDateString();
  const timePart = eventDate.toLocaleTimeString();
  return datePart + " " +  timePart;
}

export const BuddyScheduler = ({config}: {config: HomepageConfig}) => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = React.useState<string>("");
  const [showCareManagerScheduler, setShowCareManagerScheduler] = React.useState(false);
  const [showDoctorScheduler, setShowDoctorScheduler] = React.useState(false);
  const [showBuddyScheduler, setShowBuddyScheduler] = React.useState(false);
  const {username} = useAppSelector((state) => state.auth);
  const visitData = useVisitData(username);
  console.log(visitData);

  const handleSchedule = async (visit_type: 'buddy' | 'care_manager' | 'doctor') => {
    if (!date && !timeSlot) {
      toast({
        title: "Please select both date and time slot",
        variant: "destructive",
      });
      return;
    }
    const scheduledDateTime = date?.toISOString().split("T")[0] + "T" + timeSlot + ":00";
    const response = await schedulevisitRequest(username, visit_type, scheduledDateTime);
    console.log(username, visit_type, scheduledDateTime);
    console.log(visitData);
    toast({
      title: "Visit Scheduled",
      description: `Your ${visit_type === 'buddy' ? 'buddy visit' : visit_type === 'care_manager' ? 'care manager appointment' : 'doctor appointment'} has been scheduled for ${date.toLocaleDateString()} at ${timeSlot}.Kindly Check your Mail`,
    });

    // Reset states after scheduling
    setDate(null);
    setTimeSlot("");
    setShowCareManagerScheduler(false);
    setShowDoctorScheduler(false);
    setShowBuddyScheduler(false);
  };
  const handleJoinMeet = (fileurl:string) => {
    window.open(fileurl, "_blank"); // Opens PDF in a new tab
}


  const renderScheduler = (type: 'care_manager' | 'doctor' | 'buddy') => {
    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={setDate}
          className="rounded-md border"
        />
        <div className="space-y-2">
          <Label>Select Time Slot {type === 'care_manager' ? '(30 minutes)' : type === 'doctor' ? '(15 minutes)' : '(4 hours)'}</Label>
          <Input id="wakeUpTime" type="time" value={timeSlot} onChange={(event) => setTimeSlot(event.target.value)}/>
        </div>
        <Button 
          className="w-full" 
          onClick={() => handleSchedule(type)}
          disabled={!date && !timeSlot}
        >
          Schedule {type === 'buddy' ? 'Buddy Visit' : type === 'care_manager' ? 'Care Manager Appointment' : 'Doctor Appointment'}
        </Button>
      </div>
    );
  };

  const needsBlur = (Servicename: string) => {
    const feature = config?.features.find((feature) => feature.name === Servicename);
    return feature ? true : false;
  }
  const getRestrictedMessage = (name: string) => {
    return config?.features.find(f => f.name === name)?.restrictedMessage ?? "Restricted";
  };
  
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Schedule Visits</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Tabs defaultValue="care_manager" className="space-y-4 h-full flex flex-col">
          <TabsList className="grid grid-cols-3 gap-4">
            <TabsTrigger value="care_manager"
              onClick={() => {
                setShowCareManagerScheduler(false);
                setShowDoctorScheduler(false);
                setShowBuddyScheduler(false);
                setDate(null);
                setTimeSlot("");
              }}
            >
              
            Care Manager
            </TabsTrigger>
            <TabsTrigger value="doctor"
              onClick={() => {
                  setShowCareManagerScheduler(false);
                  setShowDoctorScheduler(false);
                  setShowBuddyScheduler(false);
                  setDate(null);
                  setTimeSlot("");
                }}
            >             
              Doctor
            </TabsTrigger>
            <TabsTrigger value="buddy"
              onClick={() => {
                setShowCareManagerScheduler(false);
                setShowDoctorScheduler(false);
                setShowBuddyScheduler(false);
                setDate(null);
                setTimeSlot("");
              }}
            > 
              Buddy
            </TabsTrigger>
          </TabsList>

          {needsBlur("ScheduleVisits_CM") ? <TabsContent value="care_manager" className="space-y-4 flex-1 flex flex-col">
            {!showCareManagerScheduler ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Next Scheduled Visit</h3>
                {visitData  && visitData["care_manager"] ? (
                  <p className="text-sm text-gray-600">{changeDateFormat(visitData["care_manager"].scheduled_datetime)}</p>
                ):(
                  <p className="text-sm text-gray-600">No scheduled visit</p>
                )}
                <Button variant="outline" className="mt-2" 
                  onClick={() => setShowCareManagerScheduler(true)}>
                  Reschedule
                </Button>
              </div>
            ) : renderScheduler('care_manager')}
          </TabsContent>: <BlurredScheduler RestrictedText={getRestrictedMessage("ScheduleVisits_CM")}/>}

          <TabsContent value="doctor" className="space-y-4">
            {!showDoctorScheduler ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Next Teleconsultation</h3>
                {visitData && visitData["doctor"] ? (
                  <p className="text-sm text-gray-600">{changeDateFormat(visitData["doctor"].scheduled_datetime)}</p>
                ):(
                  <p className="text-sm text-gray-600">No scheduled visit</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={() => setShowDoctorScheduler(true)}>
                    Reschedule
                  </Button>
                  <Button className="flex items-center gap-2" onClick={() => handleJoinMeet(visitData["doctor"].gmeet_link)}>
                    <VideoIcon className="h-4 w-4" />
                    Join Session
                  </Button>
                </div>
              </div>
            ) : renderScheduler('doctor')}
          </TabsContent>

          {needsBlur("ScheduleVisits_Buddy") ? <TabsContent value="buddy" className="space-y-4">
              {!showBuddyScheduler ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Next Scheduled Visit</h3>
                {visitData && visitData && visitData["buddy"] ? (
                  <p className="text-sm text-gray-600">{changeDateFormat(visitData["buddy"].scheduled_datetime)}</p>
                ):(
                  <p className="text-sm text-gray-600">No scheduled visit</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={() => setShowBuddyScheduler(true)}>
                    Reschedule
                  </Button>
                </div>
              </div>
            ) : renderScheduler('doctor')}
          </TabsContent>: <BlurredScheduler RestrictedText={getRestrictedMessage("ScheduleVisits_Buddy")}/>}
        </Tabs>
      </CardContent>
    </Card>
  );
};