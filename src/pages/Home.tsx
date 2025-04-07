
import React, { useState, useEffect } from 'react';
import { HomeHeader } from '@/components/HomeHeader';
import { PrimaryVitals } from '@/components/PrimaryVitals';
import { AdditionalHealthMetrics } from '@/components/AdditionalHealthMetrics';
import { HealthStatusCard } from '@/components/HealthStatusCard';
import { BlurredHealthStatusCard } from '@/components/BlurredComponents/Blurred_HealthStatusCard';
import { PrescriptionManagement } from '@/components/PrescriptionManagement';
import { TicketHistory } from "@/components/TicketHistory";
import { ConciergeService } from "@/components/ConciergeService";
import BlurredConciergeService from '@/components/BlurredComponents/Blurred_ConciergeService';
import BlurredCommunityEvents from '@/components/BlurredComponents/Blurred_CommunityEvents';
import { BuddyScheduler } from "@/components/BuddyScheduler";
import { CommunityEvents } from "@/components/CommunityEvents";
import PaymentsSection from '@/components/PaymentsSection';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Activity, Smartphone, Watch, Info, Mail, Phone, Loader2, UserPen } from 'lucide-react';
import { format } from 'date-fns';
import { useMetricsData } from '@/hooks/use-MetricsData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from '@/hooks/use-toast';
import { useAppSelector } from '@/store/hooks';
import { gethealthdataRequest } from '@/requests/gethealthdataRequest';
import { getCMdetailsRequest } from '@/requests/getCMdetailsRequest';
import { contactCMRequest } from '@/requests/contactCMReques';
import { useHourlyGoogleFitData } from '@/hooks/Google-Fit/use-HourlyData';
import { useWeeklyGoogleFitData } from '@/hooks/Google-Fit/use-WeeklyData';
import BlurredPaymentsSection from '@/components/BlurredComponents/Blurred_PaymentsSection';
import useHomeConfig from '@/hooks/use-HomeConfig';
import { Feature } from '@/hooks/use-HomeConfig';
// Data source types
type DataSource = 'doctor' | 'googlefit';
// Time period types
type TimePeriod = 'Week' | 'Day';


//utility function to convert date
const formatCheckedAt = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();

  // Remove time from the date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Format time in 12-hour format
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${formattedTime}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${formattedTime}`;
  } else {
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${formattedTime}`;
  }
};

const changeDateFormat = (dateStr: string) => {
  const date = new Date(dateStr);

  // Get day, month, and year
  const day = date.getDate();
  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);

  return `${day} ${month} ${year}`;
}

const Home = () => {
  const navigate = useNavigate();
  const { username } = useAppSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [CMDetails, setCMdetails] = useState<any>(null);

  const [dataSource, setDataSource] = useState<DataSource>('doctor');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('Week');
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState(false);
  const [isGoogleFitDialogOpen, setIsGoogleFitDialogOpen] = useState(false);
  const [dataTab, setDataTab] = useState<'primary' | 'additional'>('primary');
  const { weeklydata } = useWeeklyGoogleFitData();
  const { Hourlydata } = useHourlyGoogleFitData();
  console.log(Hourlydata);

  // This would come from an actual API in a real app
  const lastSyncTime = new Date();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await gethealthdataRequest(username);  // Call the function
        const CMdata = await getCMdetailsRequest(username);
        console.log(data);
        setUserDetails(data);
        setCMdetails(CMdata);

        console.log(userDetails); // Store response in the state
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchUserDetails();  // Run the function on mount
  }, []);

  const handleContact = async () => {
    setLoading(true);
    const message = await contactCMRequest(username);
    toast({
      title: "Mail sent to Care Manager",
      description: `${message}`,
    });
    setLoading(false);
  };

  useEffect(() => {
    const checkGoogleFitConnection = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/google-fit/refresh/?user_name=${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setIsGoogleFitConnected(true);
          console.log("✅ Google Fit connected successfully.");
        } else {
          setIsGoogleFitConnected(false);
          console.log("⚠️ Google Fit connection failed.");
        }
      } catch (error) {
        console.error("❌ Error checking Google Fit connection:", error);
        setIsGoogleFitConnected(false);
      }
    };

    checkGoogleFitConnection();
  }, []);

  const handleConnectGoogleFit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/google-fit/auth?user_name=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token if required
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.auth_url) {
          // Manually redirect to the Google Fit auth URL
          handleAuthRedirect(data.auth_url);
        } else {
          toast({
            title: "Error Connecting Google Fit",
            description: "Auth URL not received.",
            variant: "destructive",
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error Connecting Google Fit",
          description: errorData?.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting Google Fit:", error);
      toast({
        title: "Error",
        description: "Unable to connect Google Fit.",
        variant: "destructive",
      });
    }
  };

  let popupWindow: Window | null = null;
  let popupInterval: NodeJS.Timeout | null = null;



  const handleAuthRedirect = (authUrl: string) => {
    if (!popupWindow || popupWindow.closed) {
      // Open the popup if not already opened
      popupWindow = window.open(authUrl, "_blank", "width=600,height=600");

      // Start checking if the popup is closed
      if (popupInterval) {
        clearInterval(popupInterval);
      }
      popupInterval = setInterval(() => {
        if (popupWindow?.closed) {
          clearInterval(popupInterval!);
          setIsGoogleFitConnected(true); // Show success message when popup is closed
        }
      }, 500);
    } else {
      // If already opened, update the same popup's URL
      popupWindow.location.href = authUrl;
    }
  };



  // Extract health data from user details
  const status_message: string = userDetails?.health_status_overview?.status_message || "";
  const next_checkup_date: string = userDetails?.health_status_overview?.next_checkup_date || "";

  const HeartRate: number = userDetails?.vital_signs?.heart_rate || 0;
  const BloodPressure: string = userDetails?.vital_signs?.blood_pressure || "";
  const RespiratoryRate: number = userDetails?.vital_signs?.respiratory_rate || 0;
  const Temperature: number = userDetails?.vital_signs?.temperature || 0;
  const vitals_checked_at: string = userDetails?.vital_signs?.checked_at || "";

  const BloodSugar: number = userDetails?.health_metrics?.blood_sugar || 0;
  const Ecg: string = userDetails?.health_metrics?.ecg || "";
  const Bmi: number = userDetails?.health_metrics?.bmi || 0;
  const SleepLevel: number = userDetails?.health_metrics?.sleep_level || 0;
  const StressLevel: string = userDetails?.health_metrics?.stress_level || "";
  const BloodOxygen: number = userDetails?.health_metrics?.blood_oxygen || 0;
  const health_checked_at: string = userDetails?.health_metrics?.checked_at || "";

  const {metricsData, metricserror, metricsloading} = useMetricsData();
  const { config, configloading, error } = useHomeConfig();
  if (configloading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-16 h-16 text-gray-500" />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  const needsBlur = (Servicename: string) => {
    const feature = config?.features.find((feature) => feature.name === Servicename);
    return feature ? true : false;
  }
  const getRestrictedMessage = (name: string) => {
    return config?.features.find(f => f.name === name)?.restrictedMessage ?? "Restricted";
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
          {needsBlur("HealthStatusCard") ? <BlurredHealthStatusCard RestrictedText={getRestrictedMessage("HealthStatusCard")} /> :<HealthStatusCard status_message={status_message} next_checkup_date={next_checkup_date} />}
          </div>
          <Card className="md:w-1/3">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium">Data Sources</h3>
                <div className="flex gap-2 items-center">
                  {isGoogleFitConnected ? (
                    <>
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <Smartphone className="h-4 w-4" />
                        <span>Google Fit Connected</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Last synced: {format(lastSyncTime, 'MMM d, h:mm a')}
                      </span>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 text-sm"
                      onClick={() => setIsGoogleFitDialogOpen(true)}
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>Connect Google Fit</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Google Fit Connection Dialog */}
        <Dialog open={isGoogleFitDialogOpen} onOpenChange={setIsGoogleFitDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              {isGoogleFitConnected ? <DialogTitle>Connect Google Fit</DialogTitle> : <DialogTitle>Connected toGoogle Fit</DialogTitle>}
              <DialogDescription>
                Access your health data from Google Fit to get more insights.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {isGoogleFitConnected ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-600">
                  <Activity className="h-5 w-5" />
                  <span className="font-medium">Your Google Fit account is connected</span>
                </div>
              ) : (
                <Button
                  onClick={handleConnectGoogleFit}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                  </svg>
                  Connect with Google
                </Button>
              )}

              <div className="space-y-3 mt-4">
                <h4 className="font-medium">How to connect your wearable device:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Install Google Fit app on your phone</li>
                  <li>Connect your wearable device to Google Fit</li>
                  <li>Allow health data access permissions</li>
                  <li>Sync your device with Google Fit</li>
                </ol>
                <div className="flex items-center gap-2 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                  <Info className="h-4 w-4 shrink-0" />
                  <p>Need help setting up your device? Contact your Care Manager at <span className="font-medium">support@caresanctum.com</span></p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGoogleFitDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filter section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Data Source</h3>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${dataSource === 'doctor' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
                    onClick={() => setDataSource('doctor')}
                  >
                    <UserPen className="h-3 w-3" />
                    Doctor Entered
                  </button>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${dataSource === 'googlefit' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'} ${!isGoogleFitConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => isGoogleFitConnected && setDataSource('googlefit')}
                          disabled={!isGoogleFitConnected}
                        >
                          <Smartphone className="h-3 w-3" />
                          Google Fit
                        </button>
                      </TooltipTrigger>
                      {!isGoogleFitConnected && (
                        <TooltipContent>
                          <p>Connect to Google Fit to view this data</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {dataSource == "googlefit" ? (<div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Time Period</h3>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${timePeriod === 'Week' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
                    onClick={() => setTimePeriod('Week')}
                  >
                    Week
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${timePeriod === 'Day' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
                    onClick={() => setTimePeriod('Day')}
                  >
                    Day
                  </button>
                </div>
              </div>) : (<></>)}
            </div>
          </CardContent>
        </Card>

        {/* Main metrics content */}
        <Tabs defaultValue="primary" className="space-y-4" value={dataTab} onValueChange={(value) => setDataTab(value as 'primary' | 'additional')}>
          <TabsList>
            <TabsTrigger value="primary">Primary Vitals</TabsTrigger>
            <TabsTrigger value="additional">Additional Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="primary" className="mt-6">
            {dataSource == "doctor" ? (
              <PrimaryVitals response={metricsData} />

            ) : timePeriod == "Week" ? (
              <PrimaryVitals response={metricsData} />
            ) : (
              <PrimaryVitals response={metricsData} />
            )}

          </TabsContent>
          <TabsContent value="additional" className="mt-6">
            {dataSource == "doctor" ? (
              <AdditionalHealthMetrics
                response={metricsData}
              />
            ) : timePeriod == "Week" ? (
              <AdditionalHealthMetrics
                response={metricsData}
              />
            ) : (
              <AdditionalHealthMetrics
                response={metricsData}
              />
            )}

          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <TicketHistory />
          {needsBlur("ConciergeServices") ? <BlurredConciergeService RestrictedText={getRestrictedMessage("ConciergeServices")} /> : <ConciergeService />}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <BuddyScheduler config={config}/>
          {needsBlur("CommunityEvents") ? ( <BlurredCommunityEvents RestrictedText={getRestrictedMessage("CommunityEvents")} />) : ( <CommunityEvents />)}
        </div>

        <PrescriptionManagement />
        <div className="grid gap-6 md:grid-cols-2">
          {needsBlur("PaymentsSubscriptions") ?   <BlurredPaymentsSection RestrictedText={getRestrictedMessage("PaymentsSubscriptions")}/>: <PaymentsSection />}

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
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;