import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface WeeklyCalendarProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ selectedDate, onDateSelect }) => {
    const today = new Date();
    const days = [];

    // Get the start of the week (Sunday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

        days.push({
            name: dayNames[i],
            date: dateString,
            dayNumber: date.getDate(),
            isToday: dateString === today.toISOString().split('T')[0],
            isSelected: dateString === selectedDate
        });
    }

    return (
        <View style={styles.weekContainer}>
            {days.map((day) => (
                <TouchableOpacity
                    key={day.date}
                    style={[
                        styles.dayButton,
                        day.isSelected && styles.selectedDay,
                        day.isToday && !day.isSelected && styles.todayDay
                    ]}
                    onPress={() => onDateSelect(day.date)}
                >
                    <Text style={[
                        styles.dayName,
                        day.isSelected && styles.selectedDayText
                    ]}>
                        {day.name}
                    </Text>
                    <Text style={[
                        styles.dayNumber,
                        day.isSelected && styles.selectedDayText
                    ]}>
                        {day.dayNumber}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    weekContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dayButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        marginHorizontal: 2,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    selectedDay: {
        backgroundColor: '#007AFF',
    },
    todayDay: {
        backgroundColor: '#e3f2fd',
    },
    dayName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    selectedDayText: {
        color: '#fff',
    },
});