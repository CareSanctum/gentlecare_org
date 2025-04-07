import React, {useState, useEffect} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverlayText } from './OverlayText';

export const BlurredHealthStatusCard = ({ RestrictedText }: { RestrictedText: string }) => {
  return (
    <Card className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-white border-none shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Health Status Overview</CardTitle>
      </CardHeader>
      <div className="relative">
      <CardContent className="blur-sm pointer-events-none opacity-90">
        <p className="text-green-200 font-medium">Your health metrics are in danger range</p>
        <p className="mt-2 text-white/80">Next check-up scheduled for:2025-03-19</p>
      </CardContent>
      <OverlayText RestrictedText={RestrictedText}/>
      </div>

    </Card>
  );
};

