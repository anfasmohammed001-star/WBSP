import { DUMMY_DATA } from "@/data/dummy";

// Simple hook to access dummy data
// In the future, this could accept a key to fetch specific data sections
export const useDummyData = () => {
    // We could add logic here to toggle between real and dummy data based on an env var
    // For now, we return the structure directly for easy usage in UI components
    return DUMMY_DATA;
};

export const isDummyMode = () => true; 
