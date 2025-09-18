import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reminder } from '../../navigation/types';
import { formatTime } from '../../utils/TimeUtils';

interface ReminderCardProps {
    reminder: Reminder;
    index: number;
    onUpdate: (index: number, field: keyof Reminder, value: any) => void;
    onRemove: (index: number) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
                                                              reminder,
                                                              index,
                                                              onUpdate,
                                                              onRemove
                                                          }) => {
    return (
        <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
                <Text style={styles.reminderTitle}>
                    Reminder {index + 1}
                </Text>
                <View style={styles.reminderControls}>
                    <Switch
                        value={reminder.enabled}
                        onValueChange={(value) => onUpdate(index, 'enabled', value)}
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={reminder.enabled ? '#007AFF' : '#f4f3f4'}
                    />
                    <TouchableOpacity
                        onPress={() => onRemove(index)}
                        style={styles.removeButton}
                    >
                        <Ionicons name="trash" size={16} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.timeDisplay}>
                {formatTime(reminder.minutes_after_midnight)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    reminderCard: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    reminderControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    removeButton: {
        padding: 4,
    },
    timeDisplay: {
        fontSize: 18,
        fontWeight: '600',
        color: '#007AFF',
    },
});