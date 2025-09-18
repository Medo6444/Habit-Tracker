import React, {useEffect, useState} from 'react';
import {SQLiteProvider} from 'expo-sqlite';
import {ActivityIndicator, Text, View, StyleSheet} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import initializeDatabase from "./components/InitializeDatabase";
import {getTabScreenOptions, screenConfigs} from "./navigation/TabConfig";
import Add from "./screens/Add";
import {RefreshProvider} from "./hooks/GlobalRefresh";

const Tab = createBottomTabNavigator();

// Main App Component
export default function App() {
    const [isDBInitialized, setIsDBInitialized] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const setupDatabase = async () => {
        try {
            const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
            const dirInfo = await FileSystem.getInfoAsync(sqliteDir);

            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(sqliteDir, {intermediates: true});
            }
            setIsDBInitialized(true);
        } catch (e) {
            console.error('Database setup failed', e);
            const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
            setError(errorMessage);
        }
    }

    useEffect(() => {
        setupDatabase();
    }, []);

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Database Error: {error}</Text>
            </View>
        )
    }

    if (!isDBInitialized) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF"/>
                <Text style={styles.loadingText}>Setting up Database...</Text>
            </View>
        )
    }

    return (
        <NavigationContainer>
            <RefreshProvider>
                <SQLiteProvider
                    databaseName="habitTrackerDB.db"
                    onInit={initializeDatabase}
                    useSuspense
                >
                    <React.Suspense
                        fallback={
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color="#007AFF"/>
                                <Text style={styles.loadingText}>Initializing app...</Text>
                            </View>
                        }
                    >
                        <Tab.Navigator screenOptions={getTabScreenOptions}>
                            <Tab.Screen
                                name="ToDo"
                                component={Home}
                                options={screenConfigs.ToDo}
                            />
                            <Tab.Screen
                                name="Habits"
                                component={Add}
                                options={screenConfigs.Habits}
                            />
                            <Tab.Screen
                                name="Profile"
                                component={Profile}
                                options={screenConfigs.Profile}
                            />
                        </Tab.Navigator>
                    </React.Suspense>
                </SQLiteProvider>
            </RefreshProvider>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff3333',
        textAlign: 'center',
    },
});