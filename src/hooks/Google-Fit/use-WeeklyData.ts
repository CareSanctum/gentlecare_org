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

export interface WeeklyData {
    step_count: { date: string; value: number | null }[];
    heart_rate: { date: string; value: number | null }[];
    systolic: { date: string; value: number | null }[];
    diastolic: { date: string; value: number | null }[];
    weight: { date: string; value: number | null }[];
    sleep_duration: { date: string; value: number | null }[];
    body_temperature: { date: string; value: number | null }[];
    blood_glucose: { date: string; value: number | null }[];
}

const processGoogleFitResponse = (data: any): WeeklyData => {
    const formattedData: WeeklyData = {
        step_count: [],
        heart_rate: [],
        systolic: [],
        diastolic: [],
        weight: [],
        sleep_duration: [],
        body_temperature: [],
        blood_glucose: []
    };

    for (const [date, value] of Object.entries(data)) {
        const metrics = value as Metrics; // Type assertion
        formattedData.step_count.push({ date, value: metrics.step_count ?? null });
        formattedData.heart_rate.push({ date, value: metrics.heart_rate ?? null });
        formattedData.systolic.push({ date, value: metrics.systolic ?? null });
        formattedData.diastolic.push({ date, value: metrics.diastolic ?? null });
        formattedData.weight.push({ date, value: metrics.weight ?? null });
        formattedData.sleep_duration.push({ date, value: metrics.sleep_duration ?? null });
        formattedData.body_temperature.push({ date, value: metrics.body_temperature ?? null });
        formattedData.blood_glucose.push({ date, value: metrics.blood_glucose ?? null });
    }

    return formattedData;
};

export const useWeeklyGoogleFitData = () => {
    const { username } = useAppSelector((state) => state.auth);
    const [weeklydata, setweeklydata] = useState<WeeklyData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawData = await getGoogleFitdata(username, "weekly");
                const formattedData = processGoogleFitResponse(rawData);
                setweeklydata(formattedData); // Updates the state with the fetched data
                console.log(formattedData);
            } catch (err) {
                setweeklydata(null);
                console.log("Error fetching data", err);
            }
        };

        fetchData();
    }, [username]); // Only re-fetch if username changes

    return {weeklydata}; // Return the latest state (null initially, then the fetched data)
};
