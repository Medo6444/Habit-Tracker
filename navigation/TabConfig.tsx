import { Ionicons } from '@expo/vector-icons';

// Tab Navigator Style Configuration
export const tabBarStyle = {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
};

export const headerStyle = {
    backgroundColor: '#007AFF',
};

export const headerTitleStyle = {
    fontWeight: 'bold' as const,
};

// Icon mapping for routes
const routeIcons: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
    ToDo: { focused: 'checkbox', unfocused: 'checkbox-outline' },
    Profile: { focused: 'person', unfocused: 'person-outline' },
    Habits: { focused: 'calendar', unfocused: 'calendar-outline' },
};

// Screen options function
export const getTabScreenOptions = ({ route }: { route: any }) => ({
    tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
        const routeConfig = routeIcons[route.name];
        const iconName = routeConfig
            ? (focused ? routeConfig.focused : routeConfig.unfocused)
            : 'help-outline' as keyof typeof Ionicons.glyphMap;

        return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle,
    headerStyle,
    headerTintColor: 'white',
    headerTitleStyle,
});

// Screen configurations
export const screenConfigs = {
    ToDo: {
        title: "Today's Tasks",
        tabBarLabel: 'ToDo'
    },
    Profile: {
        title: 'My Profile',
        tabBarLabel: 'Profile'
    },
    Habits: {
        title: 'All Habits',
        tabBarLabel: 'Habits'
    }
};