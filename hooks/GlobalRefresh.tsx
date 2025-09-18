import React, { createContext, useContext, useState } from 'react';
import {useHabits} from "./UseHabits";

interface RefreshContextType {
    refreshTrigger: number;
    triggerRefresh: () => void;
    refreshHabits: () => void;
    refreshTemplates: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const refreshHabits = () => {
        // You can add specific refresh types if needed
        triggerRefresh();
    };

    const refreshTemplates = () => {
        triggerRefresh();
    };

    return (
        <RefreshContext.Provider value={{
            refreshTrigger,
            triggerRefresh,
            refreshHabits,
            refreshTemplates
        }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => {
    const context = useContext(RefreshContext);
    if (context === undefined) {
        throw new Error('useRefresh must be used within a RefreshProvider');
    }
    return context;
};

// Enhanced useHabits hook that responds to refresh triggers
export const useHabitsWithRefresh = () => {
    const { refreshTrigger } = useRefresh();
    const habitsHook = useHabits();

    // Re-run effects when refreshTrigger changes
    React.useEffect(() => {
        // This will cause any component using this hook to refresh
        // when triggerRefresh() is called from anywhere in the app
    }, [refreshTrigger]);

    return habitsHook;
};