import { useEffect, useState } from "react";
import axios from "axios";

export interface Feature {
  name: string;
  enabled: boolean;
  restrictedMessage: string;
}
export type HomepageConfig = {
  features: Feature[];
};


const  useHomeConfig = () => {
    const [config, setConfig] = useState<HomepageConfig | null>(null);
    const [configloading, setConfigLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('https://5c1fced9-e3b6-4603-a87e-92d1e86fb266.mock.pstmn.io/config/');
                const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                setConfig(parsedData);
          
            } catch (err:any) {
                if (err.response) {
                    setError(err.response.data.message || 'Server error');
                  } else if (err.request) {
                    // No response received
                    setError('No response from server');
                  } else {
                    // Other errors
                    setError(err.message || 'Unexpected error');
                  }
            } finally {
                setConfigLoading(false);
            }
        };
        fetchConfig();
    }, []);
    return { config, configloading, error };
}

export default useHomeConfig;