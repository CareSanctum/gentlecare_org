import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { BlurredGraph } from './BlurredComponents/Blurred_Graph';
import { Info } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { MetricType } from '@/hooks/use-MetricsData';


function formatNumberOrPair(value: number | [number, number]): string {
    return typeof value === "number" ? value.toString() : `${value[0]}/${value[1]}`;
}
const DynamicIcon = ({ iconName }: { iconName: string }) => {
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Info; // Default to Info
  return <IconComponent className="h-4 w-4 text-muted-foreground" />;
}

function mergeTrendData(trendData: MetricType['trendData'], xKey: string) {
  console.log(trendData);
  const merged = {};

  trendData.forEach((line) => {
    line.data.forEach((point) => {
      const xValue = point[xKey];
      if (!merged[xValue]) merged[xValue] = { [xKey]: xValue };
      merged[xValue][line.name] = point.value;
    });
  });
  console.log(merged);
  return Object.values(merged);
}

export const HealthMetricCard = ({ 
  Title, 
  Latestvalue, 
  ValueUnit,
  icon, 
  visible,
  lastChecked, 
  trendData,
  tooltipDescription,
  tooltipUnit,
  tooltipNormalRange
}:MetricType ) => {

  const isTimeBased = trendData && trendData[0].data[0] && 'time' in trendData[0].data[0];
  const formattedValue = formatNumberOrPair(Latestvalue);

  const xKey = isTimeBased ? "time" : "date";
  const mergedData = trendData && mergeTrendData(trendData, xKey);


  return (
    <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{Title}</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <p>{tooltipDescription}</p>
                  {<p>Unit: {tooltipUnit}</p>}
                  {<p>Normal Range: {tooltipNormalRange}</p>}
                </div>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <div className="text-primary"><DynamicIcon iconName={icon} /></div>
      </CardHeader>
      {visible ? (
      <CardContent>
      <div className="text-2xl font-bold mb-2">{formattedValue} {ValueUnit}</div>
      <div className="text-xs text-gray-500 mb-2">Last checked: {lastChecked}</div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ top: 0, right: 3, bottom: 3, left: 3 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xKey} 
              fontSize={10}
              tickFormatter={(value) => isTimeBased ? value : new Date(value).toLocaleDateString(undefined, { weekday: 'short' })}
              interval={0}
            />
            <YAxis fontSize={10} />
            <Tooltip />
            <Legend iconType= 'plainline'/>
            {trendData.map((dataSet) => (
              <Line
                key={dataSet.name}
                // data={dataSet.data}
                type="linear" 
                dataKey={dataSet.name}
                name={dataSet.name}
                stroke={dataSet.color}
                strokeWidth={2}
                dot={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
      ): <BlurredGraph RestrictedText="Upgrade to premium to access this feature"/> }
    </Card>
  );
};