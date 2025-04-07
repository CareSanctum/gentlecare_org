import React from 'react';
import { Heart, Activity, Wind, Thermometer } from 'lucide-react';
import { HealthMetricCard } from './HealthMetricCard';
import { HourlyData } from '@/hooks/Google-Fit/use-HourlyData';
import { WeeklyData } from '@/hooks/Google-Fit/use-WeeklyData';
import { ResponseData } from '@/hooks/use-MetricsData';

type PrimaryVitalsProps = {
  response: ResponseData;  // Expecting the response object only
};

export const PrimaryVitals = ({ response }: PrimaryVitalsProps) => {
  const getGridClass = (count: number) => {
    return `grid-cols-1 md:grid-cols-2 ${
      count === 1 ? "lg:grid-cols-1" :
      count === 2 ? "lg:grid-cols-2" :
      count === 3 ? "lg:grid-cols-3" :
      count === 4 ? "lg:grid-cols-2" : 
      "lg:grid-cols-3" // 6+ items → 3 columns (2 per row)
    }`;
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-primary">Primary Vitals</h2>
      <div className={`grid gap-6 ${getGridClass(response.PrimaryVitals.length)}`}>
      {
        response.PrimaryVitals.map((metric, index) => {
          const {  Title, Latestvalue, ValueUnit, icon, visible, lastChecked, trendData, tooltipDescription, tooltipUnit, tooltipNormalRange} = metric;
          return (
            <HealthMetricCard
              key={index}  // Ensure each item has a unique key for list rendering
              Title={Title}
              Latestvalue={Latestvalue}
              ValueUnit={ValueUnit}
              icon={icon}
              visible={visible}
              lastChecked={lastChecked}
              trendData={trendData}
              tooltipDescription={tooltipDescription}
              tooltipUnit={tooltipUnit}
              tooltipNormalRange={tooltipNormalRange}
            />
          );
        })
      }
      </div>
    </div>
  );
};