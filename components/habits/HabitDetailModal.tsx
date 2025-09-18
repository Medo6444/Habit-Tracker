import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithSchedule } from '../../hooks/UseHabits';
import { formatDaysOfWeek, formatScheduleInfo } from '../../utils/Schedule';

interface HabitDetailModalProps {
    habit: HabitWithSchedule | null;
    visible: boolean;
    onClose: () => void;
    onDelete: (habitId: number) => void;
}

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
                                                                      habit,
                                                                      visible,
                                                                      onClose,
                                                                      onDelete
                                                                  }) => {
    if (!habit) return null;

    const handleDelete = () => {
        Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        onDelete(habit.id);
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Habit Details</Text>
                    <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                        <Ionicons name="trash" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.detailSection}>
                        <View style={styles.habitHeaderDetail}>
                            <View style={[styles.habitIconLarge, { backgroundColor: habit.color }]}>
                                <Ionicons name={habit.icon as any} size={32} color="white" />
                            </View>
                            <View>
                                <Text style={styles.habitNameLarge}>{habit.name}</Text>
                                <Text style={styles.habitScheduleLarge}>{formatScheduleInfo(habit)}</Text>
                            </View>
                        </View>
                    </View>

                    {habit.description && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Description</Text>
                            <Text style={styles.detailValue}>{habit.description}</Text>
                        </View>
                    )}

                    <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Type</Text>
                        <Text style={styles.detailValue}>{habit.type}</Text>
                    </View>

                    {habit.target_value && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Target</Text>
                            <Text style={styles.detailValue}>
                                {habit.target_value} {habit.unit && `${habit.unit}`}
                            </Text>
                        </View>
                    )}

                    <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Date Range</Text>
                        <Text style={styles.detailValue}>
                            {new Date(habit.start_date).toLocaleDateString()}
                            {habit.end_date && ` - ${new Date(habit.end_date).toLocaleDateString()}`}
                        </Text>
                    </View>

                    <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Schedule Details</Text>
                        <Text style={styles.detailValue}>
                            {habit.schedule_type === 'daily' && 'Every day'}
                            {habit.schedule_type === 'weekly' && formatDaysOfWeek(habit.dow_mask || 127)}
                            {habit.schedule_type === 'interval' && `Every ${habit.interval_days} days`}
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    deleteButton: {
        padding: 8,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    detailSection: {
        marginBottom: 24,
    },
    habitHeaderDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    habitIconLarge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    habitNameLarge: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    habitScheduleLarge: {
        fontSize: 16,
        color: '#666',
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
});