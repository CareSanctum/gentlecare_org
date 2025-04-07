import { CardContent } from "../ui/card";

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { OverlayText } from "./OverlayText";
import { LockKeyhole } from "lucide-react";

const generateTrendData = (baseValue: number, variance: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: baseValue + Math.random() * variance * 2 - variance,
    }));
  };

export const BlurredGraph = ({ RestrictedText }: { RestrictedText: string }) => {
    const mergedData = generateTrendData(120, 20);
    return (
<div className="relative">
  <CardContent className="blur-sm pointer-events-none opacity-90">
    <div className="text-2xl font-bold mb-2">120 mmHG</div>
    <div className="text-xs text-gray-500 mb-2">Last checked: 123123123</div>
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData} margin={{ top: 0, right: 3, bottom: 3, left: 3 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis fontSize={10} />
          <Tooltip />
          <Legend iconType='plainline' />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6B0F8B"
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
  <OverlayText RestrictedText={RestrictedText}/>
</div>
    );
}