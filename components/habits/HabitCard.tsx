import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithSchedule } from '../../hooks/UseHabits';
import {
    formatDaysOfWeek,
    formatScheduleInfo,
    getScheduleCategory,
    getCategoryColor
} from '../../utils/Schedule';

interface HabitCardProps {
    habit: HabitWithSchedule;
    onPress: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
    const category = getScheduleCategory(habit);
    const categoryColor = getCategoryColor(category);

    const handleDetailsPress = (event: any) => {
        event.stopPropagation();
        onPress();
    };

    const getScheduleSubtitle = () => {
        const scheduleType = habit.schedule_type;
        if (scheduleType === 'weekly') {
            return formatDaysOfWeek(habit.dow_mask || 127);
        }
        if (scheduleType === 'interval') {
            return formatScheduleInfo(habit);
        }
        return '';
    };

    const scheduleSubtitle = getScheduleSubtitle();

    return (
        <View style={styles.habitCard}>
            <View style={styles.habitCardHeader}>
                <View style={styles.habitIcon}>
                    <Ionicons name={habit.icon as any} size={24} color={habit.color} />
                </View>
                <View style={styles.habitInfo}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <Text style={styles.habitSchedule}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    {scheduleSubtitle && (
                        <Text style={styles.habitScheduleDetail}>{scheduleSubtitle}</Text>
                    )}
                </View>
                <View style={styles.habitBadge}>
                    <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                        <Text style={styles.categoryBadgeText}>{category.toUpperCase()}</Text>
                    </View>
                </View>
            </View>

            {habit.description && (
                <Text style={styles.habitDescription} numberOfLines={2}>
                    {habit.description}
                </Text>
            )}

            <View style={styles.habitCardFooter}>
                <Text style={styles.habitType}>{habit.type}</Text>
                <TouchableOpacity style={styles.seeMoreButton} onPress={handleDetailsPress}>
                    <Ionicons name="information-circle-outline" size={16} color="#666" />
                    <Text style={styles.seeMoreText}>Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    habitCard: {
        backgroundColor: 'white',
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    habitCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    habitIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    habitSchedule: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    habitScheduleDetail: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    habitBadge: {
        alignItems: 'flex-end',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryBadgeText: {
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    habitDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    habitCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    habitType: {
        fontSize: 12,
        color: '#999',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    seeMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeMoreText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
});