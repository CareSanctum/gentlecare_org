import { useEffect, useState } from "react";
import axios from "axios";

export interface MetricType {
    Title: string;
    icon: string;
    visible: boolean;
    tooltipDescription: string;
    tooltipUnit: string;
    tooltipNormalRange: string;
    Latestvalue: number | [number, number];
    ValueUnit: string;
    lastChecked: string;
    trendData?: Array<{
        name: string;
        color: string;
        data: Array<{ date: string; value: number }>|Array<{time: string, value: number}>;
    }>
    }
    
    export interface ResponseData {
        PrimaryVitals: MetricType[];
        AdditionalMetrics: MetricType[];
    }

export const useMetricsData = () => {
    const [metricsData, setmetricsData] = useState<ResponseData | null>(null);
    const [metricsloading, setmetricsLoading] = useState(true);
    const [metricserror, setmetricsError] = useState<string | null>(null);
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('https://5c1fced9-e3b6-4603-a87e-92d1e86fb266.mock.pstmn.io/metrics/');
                const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                setmetricsData(parsedData);
          
            } catch (err:any) {
                if (err.response) {
                    setmetricsError(err.response.data.message || 'Server error');
                  } else if (err.request) {
                    // No response received
                    setmetricsError('No response from server');
                  } else {
                    // Other errors
                    setmetricsError(err.message || 'Unexpected error');
                  }
            } finally {
                setmetricsLoading(false);
            }
        };
        fetchConfig();
    }, []);
    return { metricsData, metricsloading, metricserror };
}