import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const PaymentsSection = () => {
    return (
        <Card className="bg-gradient-to-br from-white to-gray-50 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Payment & Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Current Plan: Premium Care (₹14,999/month)</p>
          <Button  className="bg-primary hover:bg-primary/90">
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    )
}

export default PaymentsSection;