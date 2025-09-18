import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
    name?: string;
    age?: number;
    weight?: number;
    height?: number;
    gender?: 'male' | 'female' | 'other';
    activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
    goals?: string[];
    timezone?: string;
    profileImage?: string;
    joinDate?: string;
    preferences?: {
        theme: 'dark' | 'light' | 'system';
        notifications: boolean;
        reminders: boolean;
        weekStartsOn: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday';
    };
}

const Storage_Key = '@user_profile';

export const saveUserProfile = async (profile: Partial<UserProfile>): Promise<void> => {
    try {
        // Get existing profile first
        const existingProfile = await getUserProfile();

        // Merge with new data
        const updatedProfile = {...existingProfile, ...profile};

        const jsonValue = JSON.stringify(updatedProfile);
        await AsyncStorage.setItem(Storage_Key, jsonValue);
        console.log('User profile saved successfully');
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
};

export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const jsonValue = await AsyncStorage.getItem(Storage_Key);

        if (jsonValue !== null) {
            return JSON.parse(jsonValue);
        }

        // Return default profile if none exists
        return {
            preferences: {
                theme: 'system',
                notifications: true,
                reminders: true,
                weekStartsOn: 'Monday'
            }
        };
    } catch (error) {
        console.error('Error loading user profile:', error);
        throw error;
    }
};

export const updateProfileField = async <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
): Promise<void> => {
    try {
        const profile = await getUserProfile();
        profile[key] = value;
        await saveUserProfile(profile);
    } catch (error) {
        console.error(`Error updating ${String(key)}:`, error);
        throw error;
    }
};

export const clearUserProfile = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(Storage_Key);
        console.log('User profile cleared');
    } catch (error) {
        console.error('Error clearing user profile:', error);
        throw error;
    }
};

export const isProfileComplete = async (): Promise<boolean> => {
    try {
        const profile = await getUserProfile();
        const requiredFields = ['name', 'age', 'weight', 'height'];

        return requiredFields.every(field => profile[field as keyof UserProfile] != null);
    } catch (error) {
        console.error('Error checking profile completeness:', error);
        return false;
    }
};

export const calculateBMI = (weight: number, height: number): number => {
    // height should be in cm, weight in kg
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

// Get BMI category
export const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obesity';
};

// React hook for user profile
import {useState, useEffect} from 'react';

export const useUserProfile = () => {
    const [profile, setProfile] = useState<UserProfile>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const userProfile = await getUserProfile();
            setProfile(userProfile);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        try {
            await saveUserProfile(updates);
            setProfile(prev => ({...prev, ...updates}));
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            throw err;
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile: loadProfile
    };
};