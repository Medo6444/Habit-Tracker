import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DAYS_OF_WEEK } from '../../utils/HabitConstants';

interface DaySelectorProps {
    selectedDays: number; // dow_mask
    onToggleDay: (dayValue: number) => void;
    style?: any;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
                                                            selectedDays,
                                                            onToggleDay,
                                                            style
                                                        }) => {
    return (
        <View style={[styles.daysContainer, style]}>
            {DAYS_OF_WEEK.map((day) => {
                const isSelected = (selectedDays & day.key) > 0;
                return (
                    <TouchableOpacity
                        key={day.key}
                        style={[
                            styles.dayButton,
                            isSelected ? styles.dayButtonSelected : undefined
                        ]}
                        onPress={() => onToggleDay(day.key)}
                    >
                        <Text style={[
                            styles.dayText,
                            isSelected ? styles.dayTextSelected : undefined
                        ]}>
                            {day.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    dayButtonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    dayTextSelected: {
        color: 'white',
    },
});