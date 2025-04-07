import { useState, useEffect } from "react";
import getGoogleFitdata from "@/requests/Google-Fit/GetGoogleFitDataRequest";
import { useAppSelector } from "@/store/hooks";

interface Metrics {
    step_count?: number;
    heart_rate?: number;
    systolic?: number;
    diastolic?: number;
    weight?: number;
    sleep_duration?: number;
    body_temperature?: number;
    blood_glucose?: number;
}

export interface HourlyData {
    step_count: { time: string; value: number | null }[];
    heart_rate: { time: string; value: number | null }[];
    systolic: { time: string; value: number | null }[];
    diastolic: { time: string; value: number | null }[];
    weight: { time: string; value: number | null }[];
    sleep_duration: { time: string; value: number | null }[];
    body_temperature: { time: string; value: number | null }[];
    blood_glucose: { time: string; value: number | null }[];
}

const processGoogleFitHourlyResponse = (data: any): HourlyData => {
    const formattedData: HourlyData = {
        step_count: [],
        heart_rate: [],
        systolic: [],
        diastolic: [],
        weight: [],
        sleep_duration: [],
        body_temperature: [],
        blood_glucose: []
    };

    for (const [timestamp, value] of Object.entries(data)) {
        const metrics = value as Metrics; // Type assertion

        // Extract only the time (HH:mm) from the timestamp (YYYY-MM-DD HH:mm)
        const time = timestamp.split(" ")[1];
        console.log(time);

        formattedData.step_count.push({ time, value: metrics.step_count ?? null });
        formattedData.heart_rate.push({ time, value: metrics.heart_rate ?? null });
        formattedData.systolic.push({ time, value: metrics.systolic ?? null });
        formattedData.diastolic.push({ time, value: metrics.diastolic ?? null });
        formattedData.weight.push({ time, value: metrics.weight ?? null });
        formattedData.sleep_duration.push({ time, value: metrics.sleep_duration ?? null });
        formattedData.body_temperature.push({ time, value: metrics.body_temperature ?? null });
        formattedData.blood_glucose.push({ time, value: metrics.blood_glucose ?? null });
    }

    return formattedData;
}

export const useHourlyGoogleFitData = () => {
    const { username } = useAppSelector((state) => state.auth);
    const [Hourlydata, setweeklydata] = useState<HourlyData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawData = await getGoogleFitdata(username, "hourly");
                const formattedData = processGoogleFitHourlyResponse(rawData);
                setweeklydata(formattedData); // Updates the state with the fetched data
            } catch (err) {
                console.log("Error fetching data", err);
            }
        };

        fetchData();
    }, [username]); // Only re-fetch if username changes

    return {Hourlydata}; // Return the latest state (null initially, then the fetched data)
};