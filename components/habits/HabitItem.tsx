import * as React from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface HabitWithSchedule {
    id: number;
    name: string;
    description?: string;
    type: 'boolean' | 'count' | 'quantity' | 'duration';
    target_value?: number;
    unit?: string;
    color: string;
    icon: string;
    start_date: string;
    end_date?: string;
    schedule_type: 'daily' | 'weekly' | 'interval';
    dow_mask: number | null;
    interval_days: number | null;
    entry_value: number | null;
    entry_id: number | null;
}

interface HabitItemProps {
    habit: HabitWithSchedule;
    selectedDate: string;
    isCurrentDay: boolean;
    onUpdate: (habitId: number, value: number | null) => void;
    onDelete?: (habitId: number, date: string) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({
                                                        habit,
                                                        selectedDate,
                                                        isCurrentDay,
                                                        onUpdate,
                                                        onDelete
                                                    }) => {
    const [tempValue, setTempValue] = React.useState<string>('');
    const [showInput, setShowInput] = React.useState(false);
    const [showDeleteButton, setShowDeleteButton] = React.useState(false);

    const currentValue = habit.entry_value || 0;
    const hasEntry = habit.entry_id !== null;
    const isCompleted = habit.type === 'boolean' ? currentValue > 0 : currentValue >= (habit.target_value || 1);

    const handleLongPress = () => {
        if (isCurrentDay) {
            setShowDeleteButton(true);
        }
    };

    const handleDeletePress = () => {
        Alert.alert(
            'Hide Habit for Today',
            `Are you sure you want to hide "${habit.name}" from today's list? This will remove it from today's view but won't affect the habit itself or other days.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => setShowDeleteButton(false)
                },
                {
                    text: 'Hide',
                    style: 'destructive',
                    onPress: () => {
                        if (onDelete) {
                            onDelete(habit.id, selectedDate);
                        }
                        setShowDeleteButton(false);
                    }
                }
            ]
        );
    };

    const handleBooleanToggle = () => {
        if (!isCurrentDay) return;
        onUpdate(habit.id, currentValue > 0 ? null : 1);
    };

    const handleCountUpdate = (increment: boolean) => {
        if (!isCurrentDay) return;
        const newValue = Math.max(0, currentValue + (increment ? 1 : -1));
        onUpdate(habit.id, newValue === 0 ? null : newValue);
    };

    const handleQuantitySubmit = () => {
        if (!isCurrentDay) return;
        const value = parseFloat(tempValue);
        if (isNaN(value) || value < 0) {
            Alert.alert('Invalid Input', 'Please enter a valid positive number');
            return;
        }
        onUpdate(habit.id, value === 0 ? null : value);
        setShowInput(false);
        setTempValue('');
    };

    const handleDurationSubmit = () => {
        if (!isCurrentDay) return;
        const minutes = parseInt(tempValue);
        if (isNaN(minutes) || minutes < 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of minutes');
            return;
        }
        onUpdate(habit.id, minutes === 0 ? null : minutes);
        setShowInput(false);
        setTempValue('');
    };

    const renderControl = () => {
        switch (habit.type) {
            case 'boolean':
                return (
                    <TouchableOpacity
                        style={[
                            styles.checkboxButton,
                            isCompleted && styles.completedCheckbox,
                            !isCurrentDay && styles.disabledControl
                        ]}
                        onPress={handleBooleanToggle}
                        disabled={!isCurrentDay}
                    >
                        <Ionicons
                            name={isCompleted ? "checkmark" : "close"}
                            size={20}
                            color={isCompleted ? "#fff" : "#666"}
                        />
                    </TouchableOpacity>
                );

            case 'count':
                return (
                    <View style={styles.counterContainer}>
                        <TouchableOpacity
                            style={[styles.counterButton, !isCurrentDay && styles.disabledControl]}
                            onPress={() => handleCountUpdate(false)}
                            disabled={!isCurrentDay}
                        >
                            <Ionicons name="remove" size={20} color={isCurrentDay ? "#666" : "#ccc"} />
                        </TouchableOpacity>
                        <Text style={styles.counterText}>
                            {currentValue}{habit.target_value ? `/${habit.target_value}` : ''}
                        </Text>
                        <TouchableOpacity
                            style={[styles.counterButton, !isCurrentDay && styles.disabledControl]}
                            onPress={() => handleCountUpdate(true)}
                            disabled={!isCurrentDay}
                        >
                            <Ionicons name="add" size={20} color={isCurrentDay ? "#666" : "#ccc"} />
                        </TouchableOpacity>
                    </View>
                );

            case 'quantity':
                return (
                    <View style={styles.inputContainer}>
                        {showInput ? (
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.valueInput}
                                    value={tempValue}
                                    onChangeText={setTempValue}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    autoFocus
                                />
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleQuantitySubmit}
                                >
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => {
                                        setShowInput(false);
                                        setTempValue('');
                                    }}
                                >
                                    <Ionicons name="close" size={16} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.quantityButton, !isCurrentDay && styles.disabledControl]}
                                onPress={() => isCurrentDay && setShowInput(true)}
                                disabled={!isCurrentDay}
                            >
                                <Text style={styles.quantityText}>
                                    {currentValue} {habit.unit || 'units'}
                                    {habit.target_value ? ` / ${habit.target_value}` : ''}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );

            case 'duration':
                return (
                    <View style={styles.inputContainer}>
                        {showInput ? (
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.valueInput}
                                    value={tempValue}
                                    onChangeText={setTempValue}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    autoFocus
                                />
                                <Text style={styles.unitText}>min</Text>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleDurationSubmit}
                                >
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => {
                                        setShowInput(false);
                                        setTempValue('');
                                    }}
                                >
                                    <Ionicons name="close" size={16} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.quantityButton, !isCurrentDay && styles.disabledControl]}
                                onPress={() => isCurrentDay && setShowInput(true)}
                                disabled={!isCurrentDay}
                            >
                                <Text style={styles.quantityText}>
                                    {Math.floor(currentValue / 60)}h {currentValue % 60}m
                                    {habit.target_value ? ` / ${Math.floor((habit.target_value || 0) / 60)}h ${(habit.target_value || 0) % 60}m` : ''}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.habitItem,
                !isCurrentDay && styles.disabledHabit,
                isCompleted && styles.completedHabit
            ]}
            onLongPress={handleLongPress}
            delayLongPress={500}
            onPress={() => setShowDeleteButton(false)}
        >
            <View style={styles.habitHeader}>
                <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
                    <Ionicons name={habit.icon as any} size={20} color="#fff" />
                </View>
                <View style={styles.habitInfo}>
                    <Text style={[
                        styles.habitName,
                        !isCurrentDay && styles.disabledText
                    ]}>
                        {habit.name}
                    </Text>
                    {habit.description && (
                        <Text style={[
                            styles.habitDescription,
                            !isCurrentDay && styles.disabledText
                        ]}>
                            {habit.description}
                        </Text>
                    )}
                </View>

                {showDeleteButton && isCurrentDay && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeletePress}
                    >
                        <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.habitControl}>
                {renderControl()}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    habitItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    disabledHabit: {
        opacity: 0.6,
    },
    completedHabit: {
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    habitHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    habitIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    habitDescription: {
        fontSize: 14,
        color: '#666',
    },
    disabledText: {
        color: '#aaa',
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    habitControl: {
        alignItems: 'center',
    },
    checkboxButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    completedCheckbox: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    counterText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        minWidth: 60,
        textAlign: 'center',
    },
    inputContainer: {
        alignItems: 'center',
    },
    quantityButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        minWidth: 100,
    },
    quantityText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 16,
        minWidth: 60,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    unitText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        marginRight: 8,
    },
    submitButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    disabledControl: {
        opacity: 0.5,
    },
});